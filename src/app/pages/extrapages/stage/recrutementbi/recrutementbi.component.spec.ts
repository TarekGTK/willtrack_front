import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecrutementbiComponent } from './recrutementbi.component';

describe('RecrutementbiComponent', () => {
  let component: RecrutementbiComponent;
  let fixture: ComponentFixture<RecrutementbiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecrutementbiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecrutementbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
