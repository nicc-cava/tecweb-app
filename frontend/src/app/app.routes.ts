import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { HomeComponent } from './components/home/home';
import { ChallengeCreateComponent } from './components/challenge-create/challenge-create';
import { ChallengeSolve } from './components/challenge-solve/challenge-solve';
import { Rules } from './components/rules/rules';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'rules', component: Rules },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { 
    path: 'create', 
    component: ChallengeCreateComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'solve/:id', 
    component: ChallengeSolve, 
    canActivate: [authGuard] 
  }
];
