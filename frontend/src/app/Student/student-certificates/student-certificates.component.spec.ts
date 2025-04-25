import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCertificatesComponent } from './student-certificates.component';

describe('StudentCertificatesComponent', () => {
  let component: StudentCertificatesComponent;
  let fixture: ComponentFixture<StudentCertificatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentCertificatesComponent]
    });
    fixture = TestBed.createComponent(StudentCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
