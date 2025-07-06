import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferUserJOBComponent } from './offer-UserJOB.component';

describe('OfferComponent', () => {
  let component: OfferUserJOBComponent;
  let fixture: ComponentFixture<OfferUserJOBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferUserJOBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferUserJOBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
