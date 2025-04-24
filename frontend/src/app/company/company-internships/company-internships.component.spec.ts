import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInternshipsComponent } from './company-internships.component';

describe('CompanyInternshipsComponent', () => {
  let component: CompanyInternshipsComponent;
  let fixture: ComponentFixture<CompanyInternshipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyInternshipsComponent]
    });
    fixture = TestBed.createComponent(CompanyInternshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
