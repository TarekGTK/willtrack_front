import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionsalaireComponent } from './predictionsalaire.component';

describe('PredictionsalaireComponent', () => {
  let component: PredictionsalaireComponent;
  let fixture: ComponentFixture<PredictionsalaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredictionsalaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PredictionsalaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
