import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostintegrationbiComponent } from './postintegrationbi.component';

describe('PostintegrationbiComponent', () => {
  let component: PostintegrationbiComponent;
  let fixture: ComponentFixture<PostintegrationbiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostintegrationbiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostintegrationbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
