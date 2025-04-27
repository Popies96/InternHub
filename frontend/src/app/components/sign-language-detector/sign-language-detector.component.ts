// sign-language-detector.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { SignLanguageService } from 'src/app/services/sign-language.service';


@Component({
  selector: 'app-sign-language-detector',
  templateUrl: './sign-language-detector.component.html',
  styleUrls: ['./sign-language-detector.component.css'],
})
export class SignLanguageDetectorComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @Output() signDetected = new EventEmitter<string>();
  currentSentence = '';
  isCameraActive = false;
  detectionActive = false;

  constructor(private signLanguageService: SignLanguageService) {}

  async ngOnInit() {
    try {
      // 1. First initialize the service
      const initialized = await this.signLanguageService.initialize();
      if (!initialized) {
        console.error('Failed to initialize hand detection');
        return;
      }

      // 2. Then set up subscriptions
      this.signLanguageService.detectedSign$.subscribe((sign) => {
        console.log('Detected sign:', sign); // Add logging
        this.signDetected.emit(sign);
      });

      this.signLanguageService.sentenceUpdate$.subscribe((sentence) => {
        console.log('Updated sentence:', sentence); // Add logging
        this.currentSentence = sentence;
      });

      // 3. Start camera automatically (or trigger via UI)
      await this.startCamera();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async startCamera() {
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.nativeElement.srcObject = stream;

      // Wait for video to be properly loaded
      await new Promise<void>((resolve) => {
        this.videoElement.nativeElement.onloadeddata = () => {
          console.log(
            'Video dimensions:',
            this.videoElement.nativeElement.videoWidth,
            this.videoElement.nativeElement.videoHeight
          );
          resolve();
        };
      });

      this.isCameraActive = true;
    } catch (err) {
      console.error('Camera error:', err);
    }
  }

  startDetection() {
    if (this.isCameraActive) {
      this.signLanguageService.startDetection(this.videoElement.nativeElement);
      this.detectionActive = true;
    }
  }

  stopDetection() {
    this.signLanguageService.stopDetection();
    this.detectionActive = false;
  }

  clearSentence() {
    this.signLanguageService.clearSentence();
  }

  stopCamera() {
    this.stopDetection();
    this.isCameraActive = false;
    const stream = this.videoElement.nativeElement.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track: MediaStreamTrack) => track.stop());
    }
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
