import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousGroupeComponent } from './sous-groupe.component';

describe('SousGroupeComponent', () => {
  let component: SousGroupeComponent;
  let fixture: ComponentFixture<SousGroupeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SousGroupeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SousGroupeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
