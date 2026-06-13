import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeSolve } from './challenge-solve';

describe('ChallengeSolve', () => {
  let component: ChallengeSolve;
  let fixture: ComponentFixture<ChallengeSolve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeSolve],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeSolve);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
