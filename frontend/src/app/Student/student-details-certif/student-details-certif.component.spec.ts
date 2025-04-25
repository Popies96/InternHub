import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailsCertifComponent } from './student-details-certif.component';

describe('StudentDetailsCertifComponent', () => {
  let component: StudentDetailsCertifComponent;
  let fixture: ComponentFixture<StudentDetailsCertifComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDetailsCertifComponent]
    });
    fixture = TestBed.createComponent(StudentDetailsCertifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
