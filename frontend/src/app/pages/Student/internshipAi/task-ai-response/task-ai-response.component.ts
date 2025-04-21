import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/models ';
import { GeminiService } from 'src/app/services/gemini.service';
import { InternshipAiService } from 'src/app/services/internship-ai.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-task-ai-response',
  templateUrl: './task-ai-response.component.html',
  styleUrls: ['./task-ai-response.component.css'],
})
export class TaskAiResponseComponent implements OnInit {
  task: Task | null = null;
  verdict: string | null = null;
  feedback: string | null = null;
  loading = true;
  internshipId: number | null = null;
  userCode: string = '';
  taskId: number | null = null;
  userText: string = ''; // For text editor content
  textFormat: string = 'text'; // For text format (text or code)
  //pdf
  extractedText = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private internshipAiService: InternshipAiService,
    private geminiService: GeminiService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.taskId = +params['taskId']; // Convert to number
      console.log('Task ID changed:', this.taskId);

      if (this.taskId) {
        this.fetchTaskAi();
        this.verdict = null;
        this.feedback = null;
      }
    });
  }

  fetchTaskAi(): void {
    this.loading = true;
    this.task = null; // Clear previous task

    this.internshipAiService.getTaskAiById(this.taskId!).subscribe(
      (data) => {
        this.task = data;
        console.log('Task data:', data);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching task:', error);
        this.loading = false;
      }
    );
  }
  initializeEditors(): void {
    if (!this.task) return;

    if (this.task.responseType === 'code') {
      this.userCode = '';
      // Set language based on file extension or other logic
    } else if (this.task.responseType === 'text') {
      this.userText = '';
    }
  }

  executeCode(): void {
    // Implement code execution logic
    console.log('Executing code:', this.userCode);
  }

  formatText(): void {
    // Implement text formatting logic
    console.log('Formatting text');
  }
  async onFileSelected(event: Event) {
    this.isLoading = true;
    this.errorMessage = '';
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    try {
      const file = input.files[0];
      this.extractedText = await this.pdfService.extractTextFromPdf(file);
    } catch (error) {
      console.error('Error extracting text:', error);
      this.errorMessage = 'Failed to extract text from PDF';
    } finally {
      this.isLoading = false;
    }
  }

  saveText(): void {
    // Implement text saving logic
    console.log('Saving text:', this.userText);
  }

  async generate() {
    if (!this.userText.trim()) {
      console.warn('User input is empty. Please enter some text.');
      return;
    }

    const prompt = `
You are an internship task evaluator AI.

The user has submitted a response to the following task:
Task: "${this.task?.description}"
User's Response: "${this.userText}"

Your job:
1. Analyze the user’s response.
2. If it correctly addresses the task, reply with:
{
  "verdict": "passed",
  "feedback": "Brief supportive comment or clarification of the task if needed."
}
3. If the response is wrong, incomplete, or off-topic, reply with:
{
  "verdict": "refused",
  "feedback": "Explain what the user missed or misunderstood. DO NOT provide the correct answer."
}
  4. If the user asking you to clarify the task and explain more, reply with:
{
  "verdict": "info",
  "feedback": "clarification of the task explain it more but don't provide the answer."
}

⚠️ Do NOT include the answer to the task.
⚠️ Do NOT rephrase or write the user’s response for them.

Only respond with a valid JSON object.
`;

    try {
      const result = await this.geminiService.generateText(prompt);
      console.log('AI Response:', result);
      const parsed = JSON.parse(result);
      this.verdict = parsed.verdict;
      this.feedback = parsed.feedback;
      // Display the response in the text editor
    } catch (error) {
      console.error('Error generating AI response:', error);
    }
  }
}
