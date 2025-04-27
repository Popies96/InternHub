import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewTestComponent } from './interview-test.component';

describe('InterviewTestComponent', () => {
  let component: InterviewTestComponent;
  let fixture: ComponentFixture<InterviewTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewTestComponent]
    });
    fixture = TestBed.createComponent(InterviewTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
