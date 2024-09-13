import { Routes } from '@angular/router';
import { HomepageComponent } from '../components/homepage/homepage.component';
import { LoginComponent } from '../components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
];
