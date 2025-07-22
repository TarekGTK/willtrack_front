import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTechnicalComponent } from './calendar-technical.component';

describe('CalendarTechnicalComponent', () => {
  let component: CalendarTechnicalComponent;
  let fixture: ComponentFixture<CalendarTechnicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarTechnicalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarTechnicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
