import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSidurComponent } from './edit-sidur.component';

describe('EditSidurComponent', () => {
  let component: EditSidurComponent;
  let fixture: ComponentFixture<EditSidurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSidurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSidurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
