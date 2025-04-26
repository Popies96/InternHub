import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InterviewService } from 'src/app/services/interview.service';

@Component({
  selector: 'app-interview-scheduler',
  templateUrl: './interview-scheduler.component.html',
  styleUrls: ['./interview-scheduler.component.css']
})
export class InterviewSchedulerComponent implements OnInit {
  form: FormGroup;
  mode: string = 'ONLINE';
  applicationId?: number ;

  constructor(
    private fb: FormBuilder, 
    private interviewService: InterviewService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      applicationId: [{ value: '', disabled: true }, Validators.required],
      scheduledDate: ['', Validators.required],
      mode: ['ONLINE', Validators.required],
      location: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // Extract the applicationId from the route
    this.route.paramMap.subscribe(params => {
      const id = params.get('applicationId');
      if (id !== null) {
        this.applicationId = +id;
        this.form.get('applicationId')?.setValue(this.applicationId);
      } else {
        console.error('I cannot get the application to schedule an interview');
      }
    });
  }

  onModeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.mode = select.value;
  
    if (this.mode === 'ONLINE') {
      this.form.get('location')?.setValue(''); // Clear location if ONLINE
      this.form.get('location')?.clearValidators(); // Remove location validation
    } else {
      this.form.get('location')?.setValidators([Validators.required]); // Add location validation if ONSITE
    }
  
    this.form.get('location')?.updateValueAndValidity(); // Update form validity
  }

  onSubmit() {
    if (this.form.valid) {
      this.interviewService.createInterview(this.form.value).subscribe({
        next: () => alert('Interview scheduled successfully'),
        error: err => alert('Error: ' + err.message)
      });
    }
  }
}
