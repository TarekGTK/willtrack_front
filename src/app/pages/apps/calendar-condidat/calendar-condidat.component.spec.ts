import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCondidatComponent } from './calendar-condidat.component';

describe('CalendarCondidatComponent', () => {
  let component: CalendarCondidatComponent;
  let fixture: ComponentFixture<CalendarCondidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarCondidatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarCondidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
