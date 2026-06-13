import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeCreateComponent } from './challenge-create';

describe('ChallengeCreate', () => {
  let component: ChallengeCreateComponent;
  let fixture: ComponentFixture<ChallengeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
