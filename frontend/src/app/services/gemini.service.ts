import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private generativeAi: GoogleGenerativeAI;
  private chatHistory: Array<{
    role: 'user' | 'model';
    parts: { text: string }[];
  }> = [
    {
      role: 'user',
      parts: [
        {
          text: "Based on the following preferences, generate a realistic internship offer. Return the response **strictly** in the form of a JSON object with the following fields: \n- title (string)\n- description (string)\n- startDate (YYYY-MM-DD)\n- endDate (YYYY-MM-DD)\n- technology (comma-separated string)\n- companyName (string)\n- category (string)\n\nPreferences:\n- Duration: 3 months\n- Skills: Angular, TypeScript, Firebase\n- Category: Frontend\n- Description: I'm looking for a frontend internship where I can improve my TypeScript and Firebase integration skills. I want to work on a modern web app with a focus on responsive UI and good code practices.\n",
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: '```json\n{\n  "title": "Frontend Engineering Intern",\n  "description": "Join our team as a Frontend Engineering Intern and contribute to the development of a modern web application. You will be working on building responsive user interfaces, integrating with Firebase, and implementing best practices in TypeScript. This internship offers a great opportunity to enhance your skills in frontend development and gain real-world experience working on a complex project.",\n  "startDate": "2024-06-03",\n  "endDate": "2024-08-30",\n  "technology": "Angular, TypeScript, Firebase",\n  "companyName": "Acme Software Solutions",\n  "category": "Frontend"\n}\n```',
        },
      ],
    },
  ];
  constructor() {
    this.generativeAi = new GoogleGenerativeAI(
      'AIzaSyAi_kYIvz87KO4re2aHr5WBD3xGpf-uf2E'
    );
  }

  private addToHistory(role: 'user' | 'model', text: string) {
    this.chatHistory.push({
      role,
      parts: [{ text }],
    });
  }

  async generateText(prompt: string) {
    const model = this.generativeAi.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseModalities: [],
      responseMimeType: 'application/json',
    };
    this.addToHistory('user', prompt);
    const chatSession = model.startChat({
      generationConfig,
      history: this.chatHistory,
    });
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response.text();
    this.addToHistory('model', response);
    console.log('Chat history:', this.chatHistory);

    return response;
  }
}
