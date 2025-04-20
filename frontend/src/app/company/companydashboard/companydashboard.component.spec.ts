import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanydashboardComponent } from './companydashboard.component';

describe('CompanydashboardComponent', () => {
  let component: CompanydashboardComponent;
  let fixture: ComponentFixture<CompanydashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanydashboardComponent]
    });
    fixture = TestBed.createComponent(CompanydashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
