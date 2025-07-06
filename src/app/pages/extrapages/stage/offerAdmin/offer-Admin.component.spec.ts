import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferAdminComponent } from './offer-Admin.component';

describe('OfferComponent', () => {
  let component: OfferAdminComponent;
  let fixture: ComponentFixture<OfferAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
