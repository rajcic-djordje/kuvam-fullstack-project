import { DatePipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import {
  LucideCalendarDays,
  LucideDynamicIcon,
  LucideEllipsis,
  LucideScanSearch,
  LucideShieldAlert,
  LucideShieldCheck,
  LucideStore,
  type LucideIcon
} from '@lucide/angular';
import {
  AdminUsersSort
} from '../../models/admin-user';
import {
  AdminSuspendedUser
} from '../../models/admin-suspended-user';
import {
  AdminUserService
} from '../../services/admin-user';

@Component({
  selector: 'app-admin-suspensions-page',
  imports: [
    DatePipe,
    LucideDynamicIcon
  ],
  templateUrl: './admin-suspensions-page.html',
  styleUrl: './admin-suspensions-page.css'
})
export class AdminSuspensionsPage
  implements OnInit, OnDestroy {
  private readonly adminUserService =
    inject(AdminUserService);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  readonly users = signal<AdminSuspendedUser[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');
  readonly selectedSort =
    signal<AdminUsersSort>('newest');

  readonly suspensionIcon: LucideIcon =
    LucideShieldAlert;

  readonly searchIcon: LucideIcon =
    LucideScanSearch;

  readonly actionsIcon: LucideIcon =
    LucideEllipsis;

  readonly calendarIcon: LucideIcon =
    LucideCalendarDays;

  readonly buyerIcon: LucideIcon =
    LucideShieldCheck;

  readonly sellerIcon: LucideIcon =
    LucideStore;

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.loadUsers();
    }, 350);
  }

  onSortChange(value: string): void {
    const sort: AdminUsersSort =
      value === 'oldest'
        ? 'oldest'
        : 'newest';

    this.selectedSort.set(sort);
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.adminUserService.getSuspendedUsers(
      this.searchTerm(),
      this.selectedSort()
    ).subscribe({
      next: response => {
        this.users.set(response.users ?? []);
        this.isLoading.set(false);
      },
      error: error => {
        this.users.set([]);

        this.errorMessage.set(
          error.error?.error?.message ??
          error.error?.message ??
          'Došlo je do greške pri učitavanju suspendovanih korisnika.'
        );

        this.isLoading.set(false);
      }
    });
  }

  getUserInitials(user: AdminSuspendedUser): string {
    return (
      user.firstName.charAt(0) +
      user.lastName.charAt(0)
    ).toUpperCase();
  }

  getRoleLabel(
    role: AdminSuspendedUser['role']
  ): string {
    const labels: Record<
      AdminSuspendedUser['role'],
      string
    > = {
      buyer: 'Kupac',
      seller: 'Prodavac'
    };

    return labels[role];
  }

  getRoleIcon(
    role: AdminSuspendedUser['role']
  ): LucideIcon {
    return role === 'seller'
      ? this.sellerIcon
      : this.buyerIcon;
  }
}