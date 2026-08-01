import {
  Component,
  inject,
  signal
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import {
  LucideChevronDown,
  LucideDynamicIcon,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideUserPlus,
  LucideUserRound,
  type LucideIcon
} from '@lucide/angular';
import { AuthService } from '../../../features/auth/services/auth';

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
  readonly isProfileMenuOpen = signal(false);

  readonly userIcon: LucideIcon =
    LucideUserRound;

  readonly registerIcon: LucideIcon =
    LucideUserPlus;

  readonly dashboardIcon: LucideIcon =
    LucideLayoutDashboard;

  readonly logoutIcon: LucideIcon =
    LucideLogOut;

  readonly chevronIcon: LucideIcon =
    LucideChevronDown;

  private readonly router = inject(Router);

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update(
      value => !value
    );
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  logout(): void {
    this.closeProfileMenu();

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