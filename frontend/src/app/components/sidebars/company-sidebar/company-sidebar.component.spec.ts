import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySidebarComponent } from './company-sidebar.component';

describe('CompanySidebarComponent', () => {
  let component: CompanySidebarComponent;
  let fixture: ComponentFixture<CompanySidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanySidebarComponent]
    });
    fixture = TestBed.createComponent(CompanySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
