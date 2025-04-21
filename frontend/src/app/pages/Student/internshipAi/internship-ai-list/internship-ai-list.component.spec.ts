import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipAiListComponent } from './internship-ai-list.component';

describe('InternshipAiListComponent', () => {
  let component: InternshipAiListComponent;
  let fixture: ComponentFixture<InternshipAiListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternshipAiListComponent]
    });
    fixture = TestBed.createComponent(InternshipAiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
