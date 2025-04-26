import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTasksrepComponent } from './company-tasksrep.component';

describe('CompanyTasksrepComponent', () => {
  let component: CompanyTasksrepComponent;
  let fixture: ComponentFixture<CompanyTasksrepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyTasksrepComponent]
    });
    fixture = TestBed.createComponent(CompanyTasksrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
