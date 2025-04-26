import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiAssistantService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  getCertificateSuggestion(prompt: string, context: any): Observable<any> {
    const fullPrompt = this.buildPrompt(prompt, context);
    const headers = {
      Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      'Content-Type': 'application/json',
    };

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Tu es un assistant expert en création de certificats de stage.',
        },
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
      max_tokens: 500,
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  private buildPrompt(prompt: string, context: any): string {
    return `Contexte:
    - Étudiant: ${context.studentName}
    - Programme: ${context.internshipTitle}
    - Durée: ${context.internshipDuration} mois
    - Compétences: ${context.skills.join(', ')}
    
    Question: ${prompt}
    
    Réponds en français avec des suggestions concrètes pour le certificat.`;
  }
}
