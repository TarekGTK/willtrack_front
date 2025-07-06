import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesofferStaffComponent } from './mesoffer-Staff.component';

describe('OfferComponent', () => {
  let component: MesofferStaffComponent;
  let fixture: ComponentFixture<MesofferStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesofferStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesofferStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
