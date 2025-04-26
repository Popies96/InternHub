import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AiAssistantService } from 'src/app/services/ai-assistant.service';

@Component({
  selector: 'app-ai-certificate-assistant',
  templateUrl: './ai-certificate-assistant.component.html',
  styleUrls: ['./ai-certificate-assistant.component.css'],
})
export class AiCertificateAssistantComponent implements OnInit {
  @Input() certificateForm?: FormGroup;
  @Input() formContext: any;

  messages: { sender: string; content: string }[] = [];
  userInput = '';
  isOpen = false;
  isLoading = false;

  constructor(private aiService: AiAssistantService) {}

  ngOnInit() {
    this.addBotMessage(
      'Bonjour ! Je suis ici pour vous aider à rédiger votre certificat. Posez-moi vos questions.'
    );
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.addUserMessage(this.userInput);
    const currentInput = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    this.aiService
      .getCertificateSuggestion(currentInput, this.formContext)
      .subscribe({
        next: (response) => {
          const aiResponse = response.choices[0].message.content;
          this.addBotMessage(aiResponse);
          this.autoFillForm(aiResponse);
        },
        error: (err) => {
          this.addBotMessage(
            "Désolé, je n'ai pas pu obtenir de réponse. Veuillez réessayer."
          );
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  private addUserMessage(content: string) {
    this.messages.push({ sender: 'user', content });
  }

  private addBotMessage(content: string) {
    this.messages.push({ sender: 'bot', content });
  }

  private autoFillForm(aiResponse: string) {
    if (aiResponse.includes('Contenu suggéré:')) {
      const suggestedContent = aiResponse.split('Contenu suggéré:')[1];
      this.certificateForm!.get('certificateContent')!.setValue(
        suggestedContent.trim()
      );
    }
  }
}
