import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { GeminiService } from 'src/app/services/gemini.service';

@Component({
  selector: 'app-task-chat',
  templateUrl: './task-chat.component.html',
  styleUrls: ['./task-chat.component.css'],
})
export class TaskChatComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  prompt = '';
  isProcessing = false;
  errorMessage = '';
  chatMessages: {
    text: string;
    isUser: boolean;
    timestamp?: string;
    imageUrl?: string;
  }[] = [];
  selectedFile: File | null = null; // Track selected file
  imagePrompt = '';

  constructor(private geminiService: GeminiService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (!this.selectedFile) return;

    // Add image preview to chat immediately
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.chatMessages.push({
        text: this.imagePrompt, // Include any text prompt with the image
        isUser: true,
        timestamp: this.getCurrentTime(),
        imageUrl: e.target.result,
      });
    };
    reader.readAsDataURL(this.selectedFile);

    // Clear the file input
    this.fileInput.nativeElement.value = '';
    // Don't process immediately - wait for user to optionally add a prompt
  }

  async sendImageWithPrompt() {
    if (!this.selectedFile) return;

    this.isProcessing = true;
    this.errorMessage = '';

    try {
      const prompt =
        this.imagePrompt.trim() ||
        "Analyze this image and provide relevant information. Focus on technical aspects if it's a diagram or screenshot.";

      const result = await this.geminiService.generateFromImage(
        prompt,
        this.selectedFile
      );

      const cleanedResponse = result.replace(/^Response:\s*/i, '');

      this.chatMessages.push({
        text: cleanedResponse,
        isUser: false,
        timestamp: this.getCurrentTime(),
      });
    } catch (error) {
      console.error('Error processing image:', error);
      this.chatMessages.push({
        text: "Sorry, I couldn't process that image. Please try again.",
        isUser: false,
        timestamp: this.getCurrentTime(),
      });
    } finally {
      this.isProcessing = false;
      this.selectedFile = null;
      this.imagePrompt = '';
    }
  }

  async generate() {
    if (!this.prompt.trim() && !this.selectedFile) {
      this.errorMessage = 'Please enter a message or upload a file';
      return;
    }
    if (this.selectedFile) {
      await this.sendImageWithPrompt();
      if (this.prompt.trim()) {
        const textPrompt = this.prompt;
        this.prompt = '';
        await this.sendTextPrompt(textPrompt);
      }
    } else {
      await this.sendTextPrompt(this.prompt);
    }
  }

  private async sendTextPrompt(promptText: string) {
    this.chatMessages.push({
      text: promptText,
      isUser: true,
      timestamp: this.getCurrentTime(),
    });

    this.isProcessing = true;
    this.errorMessage = '';
    this.prompt = '';

    try {
      const enhancedPrompt = `
      You are an AI assistant for internship students. 
      Focus on helping with technical tasks assigned by companies.
      
      Guidelines:
      1. Provide concise, practical solutions
      2. Offer code examples when applicable
      3. Explain concepts simply
      4. Format any JSON responses as clean, readable text
      5. Reject non-task-related questions politely
      
      Current query: ${promptText}
      `;

      const result = await this.geminiService.generateTextTask(enhancedPrompt);

      let responseText = result;

      try {
        const jsonData = JSON.parse(responseText);
        responseText = this.formatJsonToText(Object.values(jsonData));
      } catch (e) {}

      this.chatMessages.push({
        text: responseText,
        isUser: false,
        timestamp: this.getCurrentTime(),
      });
    } catch (error) {
      console.error('Error generating response:', error);
      this.chatMessages.push({
        text: 'Sorry, I encountered an error. Please try again later.',
        isUser: false,
        timestamp: this.getCurrentTime(),
      });
    } finally {
      this.isProcessing = false;
    }
  }
  private formatJsonToText(data: any): string {
    if (Array.isArray(data)) {
      return data.map((item) => this.formatJsonToText(item)).join('\n\n');
    }

    if (typeof data === 'object' && data !== null) {
      return Object.entries(data)
        .map(([key, value]) => {
          const formattedKey =
            key.charAt(0).toUpperCase() +
            key.slice(1).replace(/([A-Z])/g, ' $1');
          if (typeof value === 'object' && value !== null) {
            return `${formattedKey}:\n${this.formatJsonToText(value)}`;
          }
          return `${formattedKey}: ${value}`;
        })
        .join('\n');
    }

    return String(data);
  }
}
