import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferUserComponent } from './offer-User.component';

describe('OfferComponent', () => {
  let component: OfferUserComponent;
  let fixture: ComponentFixture<OfferUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
