import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAiResponseComponent } from './task-ai-response.component';

describe('TaskAiResponseComponent', () => {
  let component: TaskAiResponseComponent;
  let fixture: ComponentFixture<TaskAiResponseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskAiResponseComponent]
    });
    fixture = TestBed.createComponent(TaskAiResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
