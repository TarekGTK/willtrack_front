import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegroupementComponent } from './regroupement.component';

describe('RegroupementComponent', () => {
  let component: RegroupementComponent;
  let fixture: ComponentFixture<RegroupementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegroupementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegroupementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
