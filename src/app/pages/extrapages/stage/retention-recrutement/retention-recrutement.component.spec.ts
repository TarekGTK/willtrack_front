import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionRecrutementComponent } from './retention-recrutement.component';

describe('RetentionRecrutementComponent', () => {
  let component: RetentionRecrutementComponent;
  let fixture: ComponentFixture<RetentionRecrutementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetentionRecrutementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RetentionRecrutementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
