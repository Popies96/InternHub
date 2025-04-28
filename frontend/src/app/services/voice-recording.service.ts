import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceRecordingService {

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: any[] = [];
  private stream: MediaStream | null = null;

  constructor() { }

  startRecording(): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.stream = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        };

        this.mediaRecorder.start();
        console.log('Recording started...');
      })
      .catch(error => {
        console.error('Error accessing microphone: ', error);
      });
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      console.log('Recording stopped...');
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}
