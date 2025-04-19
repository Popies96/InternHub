import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternshipComponent } from './add-internship.component';

describe('AddInternshipComponent', () => {
  let component: AddInternshipComponent;
  let fixture: ComponentFixture<AddInternshipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddInternshipComponent]
    });
    fixture = TestBed.createComponent(AddInternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
