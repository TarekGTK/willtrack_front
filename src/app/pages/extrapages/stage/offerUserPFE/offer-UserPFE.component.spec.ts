import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferUserPFEComponent } from './offer-UserPFE.component';

describe('OfferComponent', () => {
  let component: OfferUserPFEComponent;
  let fixture: ComponentFixture<OfferUserPFEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferUserPFEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferUserPFEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
