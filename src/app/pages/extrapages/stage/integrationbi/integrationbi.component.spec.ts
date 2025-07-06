import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationbiComponent } from './integrationbi.component';

describe('IntegrationbiComponent', () => {
  let component: IntegrationbiComponent;
  let fixture: ComponentFixture<IntegrationbiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationbiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntegrationbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
