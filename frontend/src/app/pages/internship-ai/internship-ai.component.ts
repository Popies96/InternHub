import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeminiService } from 'src/app/services/gemini.service';

@Component({
  selector: 'app-internship-ai',
  templateUrl: './internship-ai.component.html',
  styleUrls: ['./internship-ai.component.css'],
})
export class InternshipAiComponent {
  internshipForm: FormGroup;
  generatedInternship: {} | undefined;
  skills = [
    'Angular',
    'Node.js',
    'Python',
    'Machine Learning',
    'Spring Boot',
    'Tailwind CSS',
  ];
  categories = ['Frontend', 'Backend', 'AI', 'Full Stack', 'DevOps'];

  constructor(private fb: FormBuilder, private geminiService: GeminiService) {
    this.internshipForm = this.fb.group({
      duration: ['', Validators.required],
      selectedSkills: [[], Validators.required],
      category: ['', Validators.required],
      description: [''],
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
      
      Please include a realistic internship title, brief description, technologies used, company name, start and end date.
    `;
console.log(prompt);
    const result = await this.geminiService.generateText(prompt);
    this.generatedInternship = JSON.parse(result); 
    console.log(this.generatedInternship);
    
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
