import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private generativeAi: GoogleGenerativeAI;

  constructor() {
    this.generativeAi = new GoogleGenerativeAI(
      'AIzaSyCkJSa3amK_mTHquaitk2a0cE6yztEZRn8'
    ); 
  }

  // Converts a File object to a GoogleGenerativeAI.Part object
  private async fileToGenerativePart(file: File): Promise<any> {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        }
      };
      reader.readAsDataURL(file);
    });

    return {
      inlineData: { 
        data: await base64EncodedDataPromise, 
        mimeType: file.type 
      },
    };
  }

  // Existing text generation method
  async generateTextTask(prompt: string) {
    const model = this.generativeAi.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    };
    const chatSession = model.startChat({
      generationConfig,
      history: [
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
      ],
    });
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response.text();
    return response;
  }

  // New method for image generation/analysis
  async generateFromImage(prompt: string, imageFile: File): Promise<string> {
    // For image generation/analysis, you might want to use a different model
    const model = this.generativeAi.getGenerativeModel({
      model: 'gemini-1.5-flash', // or 'gemini-1.5-pro' for more advanced capabilities
    });

    // Convert the image file to the required format
    const imagePart = await this.fileToGenerativePart(imageFile);

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            imagePart
          ]
        }
      ]
    });

    const response = result.response;
    return response.text();
  }

  // Method for generating images (if using a model that supports image generation)
  async generateImage(prompt: string): Promise<string> {
    // Note: As of my knowledge cutoff, Gemini primarily analyzes images rather than generates them
    // If image generation becomes available, you would use it here
    throw new Error('Image generation not currently supported by this API');
  }
}