import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeSolveComponent } from './challenge-solve';

describe('ChallengeSolveComponent', () => {
  let component: ChallengeSolveComponent;
  let fixture: ComponentFixture<ChallengeSolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeSolveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeSolveComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
