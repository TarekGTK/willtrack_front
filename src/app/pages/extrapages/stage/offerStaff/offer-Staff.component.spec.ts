import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferStaffComponent } from './offer-Staff.component';

describe('OfferComponent', () => {
  let component: OfferStaffComponent;
  let fixture: ComponentFixture<OfferStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
