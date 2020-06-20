import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidurListComponent } from './sidur-list.component';

describe('SidurListComponent', () => {
  let component: SidurListComponent;
  let fixture: ComponentFixture<SidurListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidurListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidurListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
