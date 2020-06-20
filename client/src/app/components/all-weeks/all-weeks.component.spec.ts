import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWeeksComponent } from './all-weeks.component';

describe('AllWeeksComponent', () => {
  let component: AllWeeksComponent;
  let fixture: ComponentFixture<AllWeeksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllWeeksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllWeeksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
