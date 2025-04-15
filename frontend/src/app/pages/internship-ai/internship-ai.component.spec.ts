import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipAiComponent } from './internship-ai.component';

describe('InternshipAiComponent', () => {
  let component: InternshipAiComponent;
  let fixture: ComponentFixture<InternshipAiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternshipAiComponent]
    });
    fixture = TestBed.createComponent(InternshipAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
