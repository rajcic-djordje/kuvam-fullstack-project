import {
  Component,
  inject,
  signal
} from '@angular/core';
import {
  Router,
  RouterLink
} from '@angular/router';
import {
  LucideChevronDown,
  LucideDynamicIcon,
  LucideHouse,
  LucideLogOut,
  LucidePencil,
  LucideUserRound,
  type LucideIcon
} from '@lucide/angular';
import { AuthService } from '../../../features/auth/services/auth';
import { AdminAccountModal } from '../../../features/admin/components/admin-account-modal/admin-account-modal';

@Component({
  selector: 'app-admin-navbar',
  imports: [
    RouterLink,
    LucideDynamicIcon,
    AdminAccountModal
  ],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css'
})
export class AdminNavbar {
  readonly authService = inject(AuthService);
  readonly isProfileMenuOpen = signal(false);
  readonly isAccountModalOpen = signal(false);

  readonly userIcon: LucideIcon = LucideUserRound;
  readonly editIcon: LucideIcon = LucidePencil;
  readonly homeIcon: LucideIcon = LucideHouse;
  readonly logoutIcon: LucideIcon = LucideLogOut;
  readonly chevronIcon: LucideIcon = LucideChevronDown;

  private readonly router = inject(Router);

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update(value => !value);
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  openAccountModal(): void {
    this.closeProfileMenu();
    this.isAccountModalOpen.set(true);
  }

  closeAccountModal(): void {
    this.isAccountModalOpen.set(false);
  }

  logout(): void {
    this.closeProfileMenu();

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/admin/login']);
      },
      error: () => {
        this.router.navigate(['/admin/login']);
      }
    });
  }
}