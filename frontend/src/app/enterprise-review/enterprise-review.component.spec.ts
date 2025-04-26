import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseReviewComponent } from './enterprise-review.component';

describe('EnterpriseReviewComponent', () => {
  let component: EnterpriseReviewComponent;
  let fixture: ComponentFixture<EnterpriseReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnterpriseReviewComponent]
    });
    fixture = TestBed.createComponent(EnterpriseReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
