import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';



@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {
     pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }

  async extractText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        try {
          const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let extractedText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText +=
              textContent.items.map((item: any) => item.str).join(' ') + '\n';
          }

          resolve(extractedText);
        } catch (error) {
          reject(`Error extracting text from PDF: ${error}`);
        }
      };

      fileReader.onerror = () => {
        reject('Error reading file');
      };

      fileReader.readAsArrayBuffer(file);
    });
  }
}
