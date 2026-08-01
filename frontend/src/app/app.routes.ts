import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { RegisterPage } from './features/auth/pages/register-page/register-page';
import { MainLayout } from './layouts/main-layout/main-layout';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ProfilePage } from './features/profile/pages/profile-page/profile-page';
import { AdminLoginPage } from './features/admin/pages/admin-login-page/admin-login-page';
import { AdminDashboardPage } from './features/admin/pages/admin-dashboard-page/admin-dashboard-page';
import {AdminLayout} from './layouts/admin-layout/admin-layout';
import { adminGuard } from './core/guards/admin-guard';
import { adminGuestGuard } from './core/guards/admin-guest-guard';
import { AdminUsersPage } from './features/admin/pages/admin-users-page/admin-users-page'
import { AdminBannedUsersPage } from './features/admin/pages/admin-banned-users-page/admin-banned-users-page';
import { AdminPendingSellersPage } from './features/admin/pages/admin-pending-sellers-page/admin-pending-sellers-page';
import { AdminSuspensionsPage} from './features/admin/pages/admin-suspensions-page/admin-suspensions-page';
import { AdminReportsPage } from './features/admin/pages/admin-reports-page/admin-reports-page';
import { userGuard } from './core/guards/user-guard';
import { OffersPage } from './features/offers/pages/offers-page/offers-page';


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
        canActivate: [authGuard, userGuard]
      },
      {
        path: 'offers',
        component: OffersPage
      },
    ]
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [guestGuard]
  },
  {
    path: 'admin/login',
    component: AdminLoginPage,
    canActivate: [adminGuestGuard]
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardPage
      },
      {
        path: 'users',
        component: AdminUsersPage
      },
      {
        path: 'banned-users',
        component: AdminBannedUsersPage
      },
      {
        path: 'pending-sellers',
        component: AdminPendingSellersPage
      },
      {
        path: 'suspensions',
        component: AdminSuspensionsPage
      },
      {
        path: 'reports',
        component: AdminReportsPage
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: 'register',
    component: RegisterPage,
    canActivate: [guestGuard]
  }
];