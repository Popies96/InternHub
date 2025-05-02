import { Injectable } from '@angular/core';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignLanguageService {
  private detector: handPoseDetection.HandDetector | null = null;
  private isDetecting = false;
  private isInitialized = false;
  private currentSentence: string[] = [];
  private lastSignTime = 0;
  private readonly signTimeout = 2000; // 2 seconds between signs

  public detectedSign$ = new Subject<string>();
  public sentenceUpdate$ = new Subject<string>();

  private readonly signDictionary: { [key: string]: string } = {
    // Basic ASL letters
    hand_closed: 'A',
    index_point: 'one',
    peace_sign: 'peace',
    thumb_up: 'okey',
    hand_open: 'hi',
    hand_closed_facing_camera: 'e',
    index_point_thumb_in: 'B',
  
    thumb_up_hand_closed: '👍',
    hand_open_palm_forward: 'wait',
    // Add more signs as needed
  };

  async initialize(): Promise<boolean> {
    try {
      // Import and set the backend before anything else
      await import('@tensorflow/tfjs-backend-webgl');
      await tf.setBackend('webgl');

      // Fallback to CPU if WebGL isn't available
      if (!tf.env().get('WEBGL_VERSION')) {
        await import('@tensorflow/tfjs-backend-cpu');
        await tf.setBackend('cpu');
        console.warn('WebGL not available, falling back to CPU backend');
      }

      await tf.ready();

      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig: handPoseDetection.MediaPipeHandsTfjsModelConfig = {
        runtime: 'tfjs',
        modelType: 'full',
      };

      this.detector = await handPoseDetection.createDetector(
        model,
        detectorConfig
      );
      this.isInitialized = true;
      console.log('Current backend:', tf.getBackend());
      console.log('WebGL version:', tf.env().get('WEBGL_VERSION'));
      return true;
    } catch (error) {
      console.error('Initialization failed:', error);
      this.isInitialized = false;
      return false;
    }
  }

  async startDetection(videoElement: HTMLVideoElement) {
    if (!videoElement || videoElement.readyState !== 4) {
      console.error('Video element not ready');
      return;
    }

    this.isDetecting = true;

    const detectFrame = async () => {
      if (!this.isDetecting) return;

      try {
        // Create a canvas to process the video frame
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Draw the video frame to canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Detect hands
        const hands = await this.detector!.estimateHands(canvas);
        console.log('Hands detected:', hands?.length);

        if (hands.length > 0) {
          // Validate landmarks
          const validHand = hands[0].keypoints.every(
            (kp) => !isNaN(kp.x) && !isNaN(kp.y)
          );

          if (validHand) {
            const sign = this.interpretSign(hands[0]);
            if (sign) this.processDetectedSign(sign);
          } else {
            console.warn('Invalid landmarks detected');
          }
        }
      } catch (error) {
        console.error('Detection error:', error);
      }

      requestAnimationFrame(detectFrame);
    };

    detectFrame();
  }

  stopDetection(): void {
    this.isDetecting = false;
  }

  private processDetectedSign(sign: string): void {
    const currentTime = Date.now();

    // Start new sentence if too much time passed since last sign
    if (
      currentTime - this.lastSignTime > this.signTimeout &&
      this.currentSentence.length > 0
    ) {
      this.finalizeSentence();
    }

    this.lastSignTime = currentTime;
    this.detectedSign$.next(sign);

    // Add to current sentence
    if (sign === ' ') {
      this.currentSentence.push(' ');
    } else if (sign.length === 1) {
      this.currentSentence.push(sign);
    } else {
      if (this.currentSentence.length > 0) {
        this.finalizeSentence();
      }
      this.currentSentence.push(sign);
    }

    this.sentenceUpdate$.next(this.getCurrentSentence());
  }

  private finalizeSentence(): void {
    const sentence = this.getCurrentSentence();
    if (sentence.trim().length > 0) {
      this.detectedSign$.next(sentence);
    }
    this.currentSentence = [];
  }

  getCurrentSentence(): string {
    return this.currentSentence.join('').trim();
  }

  clearSentence(): void {
    this.currentSentence = [];
    this.sentenceUpdate$.next('');
  }

  private interpretSign(hand: handPoseDetection.Hand): string | null {
    if (!hand.keypoints || hand.keypoints.length === 0) {
      return null;
    }

    const landmarks = hand.keypoints;
    const normalizedLandmarks = this.normalizeLandmarks(landmarks);

    // Detect specific signs
    if (this.isHandClosed(normalizedLandmarks)) {
      return this.signDictionary['hand_closed'];
    }
    if (this.isIndexPointing(normalizedLandmarks)) {
      return this.signDictionary['index_point'];
    }
    if (this.isPeaceSign(normalizedLandmarks)) {
      return this.signDictionary['peace_sign'];
    }
    if (this.isThumbUp(normalizedLandmarks)) {
      return this.signDictionary['thumb_up'];
    }

    return null;
  }

  private normalizeLandmarks(landmarks: any[]) {
    // Filter out NaN values first
    const validLandmarks = landmarks.filter(
      (kp) => !isNaN(kp.x) && !isNaN(kp.y)
    );

    if (validLandmarks.length === 0) return [];

    const xs = validLandmarks.map((kp) => kp.x);
    const ys = validLandmarks.map((kp) => kp.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return landmarks.map((kp) => ({
      ...kp,
      x: isNaN(kp.x) ? 0 : (kp.x - minX) / (maxX - minX),
      y: isNaN(kp.y) ? 0 : (kp.y - minY) / (maxY - minY),
    }));
  }

  // Sign detection helpers with proper typing
  private isHandClosed(landmarks: { x: number; y: number }[]): boolean {
    const fingerTips = [4, 8, 12, 16, 20];
    const fingerJoints = [3, 7, 11, 15, 19];

    return fingerTips.every(
      (tip, i) => landmarks[tip].y > landmarks[fingerJoints[i]].y
    );
  }

  private isIndexPointing(landmarks: { x: number; y: number }[]): boolean {
    return (
      landmarks[8].y < landmarks[7].y &&
      landmarks[12].y > landmarks[11].y &&
      landmarks[16].y > landmarks[15].y &&
      landmarks[20].y > landmarks[19].y
    );
  }

  private isPeaceSign(landmarks: { x: number; y: number }[]): boolean {
    return (
      landmarks[8].y < landmarks[7].y &&
      landmarks[12].y < landmarks[11].y &&
      landmarks[16].y > landmarks[15].y &&
      landmarks[20].y > landmarks[19].y
    );
  }

  private isThumbUp(landmarks: { x: number; y: number }[]): boolean {
    return (
      landmarks[4].x < landmarks[3].x &&
      landmarks[8].y > landmarks[7].y &&
      landmarks[12].y > landmarks[11].y &&
      landmarks[16].y > landmarks[15].y &&
      landmarks[20].y > landmarks[19].y
    );
  }
}
