import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRhComponent } from './calendar-rh.component';

describe('CalendarRhComponent', () => {
  let component: CalendarRhComponent;
  let fixture: ComponentFixture<CalendarRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarRhComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
