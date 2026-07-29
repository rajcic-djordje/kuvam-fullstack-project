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
  LucideShieldCheck,
  LucideStore,
  LucideUserRoundX,
  type LucideIcon
} from '@lucide/angular';
import {
  AdminUser,
  AdminUsersSort
} from '../../models/admin-user';
import { AdminUserService } from '../../services/admin-user';

@Component({
  selector: 'app-admin-banned-users-page',
  imports: [
    DatePipe,
    LucideDynamicIcon
  ],
  templateUrl: './admin-banned-users-page.html',
  styleUrl: './admin-banned-users-page.css'
})
export class AdminBannedUsersPage implements OnInit, OnDestroy {
  private readonly adminUserService = inject(AdminUserService);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  readonly users = signal<AdminUser[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');
  readonly selectedSort = signal<AdminUsersSort>('newest');

  readonly bannedUsersIcon: LucideIcon = LucideUserRoundX;
  readonly searchIcon: LucideIcon = LucideScanSearch;
  readonly actionsIcon: LucideIcon = LucideEllipsis;
  readonly calendarIcon: LucideIcon = LucideCalendarDays;
  readonly buyerIcon: LucideIcon = LucideShieldCheck;
  readonly sellerIcon: LucideIcon = LucideStore;

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

    this.adminUserService.getUsers(
      this.searchTerm(),
      this.selectedSort()
    ).subscribe({
      next: response => {
        const bannedUsers = response.users.filter(
          user => user.status === 'banned'
        );

        this.users.set(bannedUsers);
        this.isLoading.set(false);
      },
      error: error => {
        this.users.set([]);

        this.errorMessage.set(
          error.error?.error?.message ??
          error.error?.message ??
          'Došlo je do greške pri učitavanju banovanih korisnika.'
        );

        this.isLoading.set(false);
      }
    });
  }

  getUserInitials(user: AdminUser): string {
    return (
      user.firstName.charAt(0) +
      user.lastName.charAt(0)
    ).toUpperCase();
  }

  getRoleLabel(role: AdminUser['role']): string {
    const labels: Record<AdminUser['role'], string> = {
      buyer: 'Kupac',
      seller: 'Prodavac'
    };

    return labels[role];
  }

  getRoleIcon(role: AdminUser['role']): LucideIcon {
    return role === 'seller'
      ? this.sellerIcon
      : this.buyerIcon;
  }
}