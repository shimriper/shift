import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekCreateComponent } from './week-create.component';

describe('WeekCreateComponent', () => {
  let component: WeekCreateComponent;
  let fixture: ComponentFixture<WeekCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
