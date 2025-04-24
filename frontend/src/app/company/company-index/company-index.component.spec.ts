import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyIndexComponent } from './company-index.component';

describe('CompanyIndexComponent', () => {
  let component: CompanyIndexComponent;
  let fixture: ComponentFixture<CompanyIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyIndexComponent]
    });
    fixture = TestBed.createComponent(CompanyIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
