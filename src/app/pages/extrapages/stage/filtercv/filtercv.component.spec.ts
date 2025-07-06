import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltercvComponent } from './filtercv.component';

describe('FiltercvComponent', () => {
  let component: FiltercvComponent;
  let fixture: ComponentFixture<FiltercvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltercvComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltercvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
