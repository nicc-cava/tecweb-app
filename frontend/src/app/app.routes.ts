import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { HomeComponent } from './components/home/home';
import { ChallengeCreateComponent } from './components/challenge-create/challenge-create';
import { ChallengeSolveComponent } from './components/challenge-solve/challenge-solve';
import { RulesComponent } from './components/rules/rules';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { 
    path: 'create', 
    component: ChallengeCreateComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'solve/:id', 
    component: ChallengeSolveComponent, 
    canActivate: [authGuard] 
  }
];
