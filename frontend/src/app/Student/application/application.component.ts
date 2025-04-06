import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFiles: File[] | null = null;

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    } else {
      this.selectedFiles = null;
    }
  }

  // Optional: Programmatically trigger file dialog
  openFileDialog() {
    this.fileInput.nativeElement.click();
  }
}
