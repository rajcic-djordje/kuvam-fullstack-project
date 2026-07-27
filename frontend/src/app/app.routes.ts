import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { RegisterPage } from './features/auth/pages/register-page/register-page';
import { MainLayout } from './layouts/main-layout/main-layout';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ProfilePage } from './features/profile/pages/profile-page/profile-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: HomePage
      },
      {
        path: 'profile',
        component: ProfilePage,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    component: RegisterPage,
    canActivate: [guestGuard]
  }
];