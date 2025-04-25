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
  // Task data
  task: Task | null = null;
  loading = true;
  taskId: number | null = null;

  // Response handling
  userCode: string = '';
  userText: string = '';
  extractedText = '';
  fileToUpload: File | null = null;

  // Evaluation results
  verdict: string | null = null;
  feedback: string | null = null;
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
      this.taskId = +params['taskId'];
      if (this.taskId) {
        this.fetchTaskAi();
        this.resetEvaluation();
      }
    });
  }

  fetchTaskAi(): void {
    this.loading = true;
    this.task = null;

    this.internshipAiService.getTaskAiById(this.taskId!).subscribe({
      next: (data) => {
        this.task = data;
        this.initializeEditors();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching task:', error);
        this.loading = false;
      },
    });
  }

  resetEvaluation(): void {
    this.verdict = null;
    this.feedback = null;
    this.errorMessage = '';
  }

  initializeEditors(): void {
    if (!this.task) return;

    // Reset all input fields
    this.userCode = '';
    this.userText = '';
    this.extractedText = '';
    this.fileToUpload = null;
  }

  async onFileSelected(event: Event) {
    this.resetEvaluation();
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.fileToUpload = input.files[0];
    this.isLoading = true;

    try {
      // Validate file type
      if (this.fileToUpload.type !== 'application/pdf') {
        throw new Error('Please upload a PDF file');
      }

      // Extract text from PDF
      this.extractedText = await this.pdfService.extractText(this.fileToUpload);
      this.userText = this.extractedText;
    } catch (error) {
      console.error('Error processing file:', error);
      this.errorMessage =
        error instanceof Error ? error.message : 'Failed to process file';
      this.fileToUpload = null;
    } finally {
      this.isLoading = false;
    }
  }

  async evaluateResponse() {
    if (!this.task) return;

    this.isLoading = true;
    this.resetEvaluation();

    try {
      let userResponse = '';

      // Determine which response to evaluate
      switch (this.task.responseType) {
        case 'code':
          if (!this.userCode.trim()) {
            throw new Error('Please write some code to evaluate');
          }
          userResponse = this.userCode;
          break;
        case 'text':
        case 'pdf':
          if (!this.userText.trim()) {
            throw new Error('Please provide some text to evaluate');
          }
          userResponse = this.userText;
          break;
      }

      const prompt = this.createEvaluationPrompt(userResponse);
      const result = await this.geminiService.generateText(prompt);

      // Parse the JSON response
      try {
        const parsed = JSON.parse(result.replace(/```json|```/g, ''));
        this.verdict = parsed.verdict;
        this.feedback = parsed.feedback;

        // Check if verdict is "passed" and update task status
        if (this.verdict === 'passed' && this.task) {
          // Create updated task object with COMPLETED status
          const updatedTask: Task = {
            ...this.task,
            status: 'COMPLETED', // Assuming your Task model has a status field
          };

          // Call the update endpoint
          this.internshipAiService
            .updateTask(this.task.id, updatedTask)
            .subscribe({
              next: (updatedTaskDto) => {
                this.task = {
                  id: updatedTaskDto.id,
                  title: updatedTaskDto.title,
                  description: updatedTaskDto.description,
                  responseType: updatedTaskDto.responseType,
                  status: updatedTaskDto.status,
                };
                console.log('Task status updated to COMPLETED');
              },
              error: (error) => {
                console.error('Failed to update task status:', error);
                this.errorMessage =
                  'Evaluation passed but failed to update task status';
              },
            });
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error(
          'The evaluation response was not in the expected format'
        );
      }
    } catch (error) {
      console.error('Error generating evaluation:', error);
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to generate evaluation';
    } finally {
      this.isLoading = false;
    }
  }

  private createEvaluationPrompt(userResponse: string): string {
    return `
You are an internship task evaluator AI.

TASK DESCRIPTION:
${this.task?.description}

USER'S RESPONSE:
${userResponse}

EVALUATION INSTRUCTIONS:
1. Analyze if the response correctly addresses the task requirements
2. Return a JSON object with the following structure:
{
  "verdict": "passed" | "refused" | "info",
  "feedback": "Your detailed feedback here"
}

RULES:
- "passed": If the response fully meets task requirements
- "refused": If the response is incomplete, incorrect, or off-topic
- "info": If the user asks for clarification (without providing answer)
- Feedback should be constructive but NEVER include the correct answer
- For code: check functionality, not just syntax
- For text: check content relevance and completeness
- For files: evaluate the extracted content

Respond ONLY with the JSON object. No additional text or explanations.
`;
  }

  clearResponse(): void {
    if (!this.task) return;

    switch (this.task.responseType) {
      case 'code':
        this.userCode = '';
        break;
      case 'text':
      case 'pdf':
        this.userText = '';
        this.extractedText = '';
        this.fileToUpload = null;
        break;
    }
    this.resetEvaluation();
  }

  // Helper method for template to determine if evaluate button should be disabled
  isEvaluateDisabled(): boolean {
    if (!this.task || this.task.status === 'COMPLETED') return true;

    switch (this.task.responseType) {
      case 'code':
        return !this.userCode.trim();
      case 'text':
        return !this.userText.trim();
      case 'pdf':
        return !this.userText.trim() || !this.fileToUpload;
      default:
        return true;
    }
  }
}
