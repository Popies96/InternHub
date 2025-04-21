import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipAiDetailsComponent } from './internship-ai-details.component';

describe('InternshipAiDetailsComponent', () => {
  let component: InternshipAiDetailsComponent;
  let fixture: ComponentFixture<InternshipAiDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternshipAiDetailsComponent]
    });
    fixture = TestBed.createComponent(InternshipAiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
