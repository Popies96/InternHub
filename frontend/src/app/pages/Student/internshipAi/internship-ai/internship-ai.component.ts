import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InternshipAi, Task } from 'src/app/models/models ';
import { GeminiService } from 'src/app/services/gemini.service';
import { InternshipAiService } from 'src/app/services/internship-ai.service';

@Component({
  selector: 'app-internship-ai',
  templateUrl: './internship-ai.component.html',
  styleUrls: ['./internship-ai.component.css'],
})
export class InternshipAiComponent {
  internshipForm: FormGroup;
  showModal = false;
  generatedInternship: any | undefined;
  allSkillsByCategory: { [key: string]: string[] } = {
    Frontend: ['Angular', 'React', 'Vue', 'Tailwind CSS', 'HTML', 'CSS'],
    Backend: ['Node.js', 'Spring Boot', 'Express', 'Django'],
    AI: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch'],
    'Full Stack': ['Angular', 'Node.js', 'Spring Boot', 'React', 'Python'],
    DevOps: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
  };
  categories = Object.keys(this.allSkillsByCategory);
  skills: string[] = [];
  isGenerating =false;

  constructor(
    private fb: FormBuilder,
    private geminiService: GeminiService,
    private internshipAiService: InternshipAiService,
    private router: Router
  ) {
    this.internshipForm = this.fb.group({
      duration: ['', Validators.required],
      selectedSkills: [[], Validators.required],
      category: ['', Validators.required],
      description: [''],
    });
    this.internshipForm.get('category')?.valueChanges.subscribe((category) => {
      this.updateSkills(category);
    });
  }

  async generate() {
    if (this.internshipForm.invalid) return;

    const { duration, selectedSkills, category, description } =
      this.internshipForm.value;
    const prompt = `
      Based on the following preferences, generate a one realistic internship offer. Return the response strictly in the form of a JSON object with the following fields:
      - Duration: ${duration}
      - Skills: ${selectedSkills.join(', ')}
      - Category: ${category}
      - Description: ${description || 'No additional details'}
      
      Please include a realistic internship title,description, technologies used, company name, start and end date,and generate tasks that simulate the internship experience and make them either needs a pdf response like a use case problem and stuff like that or a single file code
      include tasks title,description make it detailed in each step ,responseType each task only have one response each either text or code or pdf when and for the text make that task for writing simple document like feature idea and stuff like that
    `;
    try {
      const result = await this.geminiService.generateText(prompt);
      console.log(prompt);
      console.log('Raw result:', result);

      const parsed = typeof result === 'string' ? JSON.parse(result) : result;

      this.generatedInternship = {
        title: parsed.title,
        description: parsed.description,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        technology: parsed.technology,
        companyName: parsed.companyName,
        category: parsed.category,
        active: true,
        taskAiList: (parsed.tasks || []).map((task: Task) => ({
          title: task.title,
          description: task.description,
          responseType: task.responseType,
          status: 'PENDING',
        })),
      };

      console.log('Mapped internship object:', this.generatedInternship);
      this.showModal = true;
    } catch (error) {
      console.error('Error generating internship:', error);
    }
  }
  validateInternship() {
    // Save or send the internship where needed
    console.log('Internship validated:', this.generatedInternship);
    this.internshipAiService
      .createInternshipAi(this.generatedInternship)
      .subscribe(
        (response) => {
          console.log('Internship created successfully:', response);
          this.router.navigate(['/student/internshipAi']);
        },
        (error) => {
          console.error('Error creating internship:', error);
          // Handle error, e.g., show an error message
        }
      );

    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
  }
  updateSkills(category: string) {
    this.skills = this.allSkillsByCategory[category] || [];
    this.internshipForm.get('selectedSkills')?.setValue([]);
  }
  onSkillChange(event: any) {
    const selected = this.internshipForm.get('selectedSkills')?.value || [];
    if (event.target.checked) {
      selected.push(event.target.value);
    } else {
      const index = selected.indexOf(event.target.value);
      if (index >= 0) selected.splice(index, 1);
    }
    this.internshipForm.get('selectedSkills')?.setValue(selected);
  }
}
