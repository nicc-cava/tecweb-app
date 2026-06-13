import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ChallengeCreateComponent } from './components/challenge-create/challenge-create.component';
import { ChallengeSolveComponent } from './components/challenge-solve/challenge-solve.component';
import { RulesComponent } from './components/rules/rules.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
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
