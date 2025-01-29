import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PennySlotComponent } from './penny-slot.component';

describe('PennySlotComponent', () => {
  let component: PennySlotComponent;
  let fixture: ComponentFixture<PennySlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PennySlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PennySlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
