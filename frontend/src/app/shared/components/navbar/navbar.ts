import {
  Component,
  effect,
  inject,
  signal,
  untracked
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import {
  LucideBellDot,
  LucideCheckCheck,
  LucideDynamicIcon,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMenu,
  LucidePackage,
  LucidePackageCheck,
  LucideShoppingBasket,
  LucideUser,
  LucideX
} from '@lucide/angular';
import { AuthService } from '../../../features/auth/services/auth';
import { CartService } from '../../../features/cart/services/cart';
import { Notification } from '../../../features/notifications/models/notification';
import { NotificationService } from '../../../features/notifications/services/notification';
import { NotificationSocketService } from '../../../features/notifications/services/notification-socket';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideDynamicIcon
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  readonly authService = inject(AuthService);

  readonly notificationService = inject(
    NotificationService
  );

  readonly cartService = inject(CartService);

  readonly isProfileMenuOpen = signal(false);
  readonly isNotificationMenuOpen = signal(false);
  readonly isMobileMenuOpen = signal(false);
  readonly isMarkingAllAsRead = signal(false);

  readonly buyerOrdersIcon =
    LucideShoppingBasket;

  readonly sellerOffersIcon =
    LucidePackage;

  readonly sellerOrdersIcon =
    LucidePackageCheck;

  readonly notificationIcon =
    LucideBellDot;

  readonly readAllIcon =
    LucideCheckCheck;

  readonly userIcon =
    LucideUser;

  readonly dashboardIcon =
    LucideLayoutDashboard;

  readonly logoutIcon =
    LucideLogOut;

  readonly menuIcon =
    LucideMenu;

  readonly closeIcon =
    LucideX;

  private readonly router = inject(Router);

  private readonly notificationSocketService =
    inject(NotificationSocketService);

  constructor() {
    effect(() => {
      const isAuthenticated =
        this.authService.isAuthenticated();

      untracked(() => {
        if (isAuthenticated) {
          this.notificationService
            .loadNotifications();

          this.notificationSocketService
            .connect();

          return;
        }

        this.notificationSocketService
          .disconnect();

        this.notificationService.clear();

        this.closeProfileMenu();
        this.closeNotificationMenu();
        this.closeMobileMenu();
      });
    });
  }

  openCart(): void {
    this.closeProfileMenu();
    this.closeNotificationMenu();
    this.closeMobileMenu();

    this.cartService.open();
  }

  toggleProfileMenu(): void {
    this.closeNotificationMenu();
    this.closeMobileMenu();

    this.isProfileMenuOpen.update(
      value => !value
    );
  }

  toggleNotificationMenu(): void {
    this.closeProfileMenu();
    this.closeMobileMenu();

    this.isNotificationMenuOpen.update(
      value => !value
    );

    if (this.isNotificationMenuOpen()) {
      this.notificationService
        .loadNotifications();
    }
  }

  toggleMobileMenu(): void {
    this.closeProfileMenu();
    this.closeNotificationMenu();

    this.isMobileMenuOpen.update(
      value => !value
    );
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  closeNotificationMenu(): void {
    this.isNotificationMenuOpen.set(false);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  openNotification(
    notification: Notification
  ): void {
    const navigateToOrder = (): void => {
      this.closeNotificationMenu();
      this.closeMobileMenu();

      if (!notification.order) {
        return;
      }

      const role =
        this.authService.currentUser()?.role;

      if (role === 'seller') {
        this.router.navigate([
          '/seller/orders',
          notification.order
        ]);

        return;
      }

      if (role === 'buyer') {
        this.router.navigate([
          '/orders',
          notification.order
        ]);
      }
    };

    if (notification.isRead) {
      navigateToOrder();
      return;
    }

    this.notificationService
      .markAsRead(notification._id)
      .subscribe({
        next: navigateToOrder,
        error: navigateToOrder
      });
  }

  markAllAsRead(): void {
    if (
      this.isMarkingAllAsRead() ||
      this.notificationService.unreadCount() === 0
    ) {
      return;
    }

    this.isMarkingAllAsRead.set(true);

    this.notificationService
      .markAllAsRead()
      .subscribe({
        next: () => {
          this.isMarkingAllAsRead.set(false);
        },
        error: () => {
          this.isMarkingAllAsRead.set(false);
        }
      });
  }

  notificationTime(createdAt: string): string {
    const createdDate = new Date(createdAt);

    const difference =
      Date.now() - createdDate.getTime();

    const minutes =
      Math.floor(difference / 60000);

    if (minutes < 1) {
      return 'Upravo sada';
    }

    if (minutes < 60) {
      return `Pre ${minutes} min`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `Pre ${hours} h`;
    }

    return createdDate.toLocaleDateString(
      'sr-RS',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );
  }

  logout(): void {
    this.closeProfileMenu();
    this.closeNotificationMenu();
    this.closeMobileMenu();

    this.notificationSocketService
      .disconnect();

    this.notificationService.clear();
    this.cartService.clear();
    this.cartService.close();

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }
}