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
import { SellerPage } from './features/offers/pages/seller-page/seller-page';
import { OfferPage } from './features/offers/pages/offer-page/offer-page';
import { MyOrdersPage } from './features/orders/pages/my-orders-page/my-orders-page';
import { buyerGuard } from './core/guards/buyer-guard';
import { SellerOrdersPage } from './features/orders/pages/seller-orders-page/seller-orders-page';
import { sellerGuard } from './core/guards/seller-guard';
import { SellerOffersPage } from './features/offers/pages/seller-offers-page/seller-offers-page';
import { CreateOfferPage } from './features/offers/pages/create-offer-page/create-offer-page';
import { EditOfferPage } from './features/offers/pages/edit-offer-page/edit-offer-page';
import { OrderDetailPage } from './features/orders/pages/order-detail-page/order-detail-page';
import { SellerOrderDetailPage } from './features/orders/pages/seller-order-detail-page/seller-order-detail-page';

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
      {
        path: 'offers/:offerId',
        component: OfferPage
      },
      {
        path: 'sellers/:slug',
        component: SellerPage
      },
      {
        path: 'seller/orders',
        component: SellerOrdersPage,
        canActivate: [authGuard, sellerGuard]
      },
      {
        path: 'seller/orders/:orderId',
        component: SellerOrderDetailPage,
        canActivate: [authGuard, sellerGuard]
      },
      {
        path: 'orders',
        component: MyOrdersPage,
        canActivate: [authGuard, buyerGuard]
      },
      {
        path: 'orders/:orderId',
        component: OrderDetailPage,
        canActivate: [authGuard, buyerGuard]
      },
      {
        path: 'seller/offers',
        component: SellerOffersPage,
        canActivate: [authGuard, sellerGuard]
      },
      {
        path: 'seller/offers/new',
        component: CreateOfferPage,
        canActivate: [authGuard, sellerGuard]
      },
      {
        path: 'seller/offers/:offerId/edit',
        component: EditOfferPage,
        canActivate: [authGuard, sellerGuard]
      }
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
      },
      
    ]
  },
  {
    path: 'register',
    component: RegisterPage,
    canActivate: [guestGuard]
  }
];