import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesofferAdminComponent } from './mesoffer-Admin.component';

describe('OfferComponent', () => {
  let component: MesofferAdminComponent;
  let fixture: ComponentFixture<MesofferAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesofferAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesofferAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
