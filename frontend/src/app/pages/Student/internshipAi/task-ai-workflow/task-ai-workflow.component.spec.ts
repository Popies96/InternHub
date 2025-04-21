import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAiWorkflowComponent } from './task-ai-workflow.component';

describe('TaskAiWorkflowComponent', () => {
  let component: TaskAiWorkflowComponent;
  let fixture: ComponentFixture<TaskAiWorkflowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskAiWorkflowComponent]
    });
    fixture = TestBed.createComponent(TaskAiWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
