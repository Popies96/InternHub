import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAiSidebarComponent } from './task-ai-sidebar.component';

describe('TaskAiSidebarComponent', () => {
  let component: TaskAiSidebarComponent;
  let fixture: ComponentFixture<TaskAiSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskAiSidebarComponent]
    });
    fixture = TestBed.createComponent(TaskAiSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
