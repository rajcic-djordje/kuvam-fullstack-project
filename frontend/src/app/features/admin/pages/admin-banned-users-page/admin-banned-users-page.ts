import { DatePipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import {
  LucideAlertTriangle,
  LucideCalendarDays,
  LucideDynamicIcon,
  LucideEllipsis,
  LucideEye,
  LucideFlag,
  LucideMail,
  LucideScanSearch,
  LucideShieldCheck,
  LucideShieldX,
  LucideStore,
  LucideUserRound,
  LucideUserRoundX,
  LucideX,
  type LucideIcon
} from '@lucide/angular';
import {
  AdminUser,
  AdminUsersRoleFilter,
  AdminUsersSort
} from '../../models/admin-user';
import { AdminUserService } from '../../services/admin-user';

type BannedUserModalMode =
  | 'profile'
  | 'unban'
  | null;

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
  private readonly adminUserService =
    inject(AdminUserService);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  readonly users = signal<AdminUser[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');

  readonly selectedRole =
    signal<AdminUsersRoleFilter>('all');

  readonly selectedSort =
    signal<AdminUsersSort>('newest');

  readonly openedMenuUserId =
    signal<string | null>(null);

  readonly selectedUser =
    signal<AdminUser | null>(null);

  readonly modalMode =
    signal<BannedUserModalMode>(null);

  readonly modalError = signal('');
  readonly isSubmitting = signal(false);

  readonly bannedUsersIcon: LucideIcon =
    LucideUserRoundX;

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

  readonly viewIcon: LucideIcon =
    LucideEye;

  readonly unbanIcon: LucideIcon =
    LucideShieldX;

  readonly closeIcon: LucideIcon =
    LucideX;

  readonly profileIcon: LucideIcon =
    LucideUserRound;

  readonly warningIcon: LucideIcon =
    LucideAlertTriangle;

  readonly emailIcon: LucideIcon =
    LucideMail;

  readonly reportsIcon: LucideIcon =
    LucideFlag;

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
    this.closeActionsMenu();

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.loadUsers();
    }, 350);
  }

  onRoleChange(value: string): void {
    const role: AdminUsersRoleFilter =
      value === 'buyer' || value === 'seller'
        ? value
        : 'all';

    this.selectedRole.set(role);
    this.closeActionsMenu();
    this.loadUsers();
  }

  onSortChange(value: string): void {
    const sort: AdminUsersSort =
      value === 'oldest'
        ? 'oldest'
        : 'newest';

    this.selectedSort.set(sort);
    this.closeActionsMenu();
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.closeActionsMenu();

    this.adminUserService.getUsers(
      this.searchTerm(),
      this.selectedRole(),
      'banned',
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
          'Došlo je do greške pri učitavanju banovanih korisnika.'
        );

        this.isLoading.set(false);
      }
    });
  }

  toggleActionsMenu(userId: string): void {
    this.openedMenuUserId.update(currentId =>
      currentId === userId
        ? null
        : userId
    );
  }

  closeActionsMenu(): void {
    this.openedMenuUserId.set(null);
  }

  openProfile(user: AdminUser): void {
    this.openModal('profile', user);
  }

  openUnbanUser(user: AdminUser): void {
    this.openModal('unban', user);
  }

  openModal(
    mode: Exclude<BannedUserModalMode, null>,
    user: AdminUser
  ): void {
    this.closeActionsMenu();
    this.selectedUser.set(user);
    this.modalMode.set(mode);
    this.modalError.set('');
  }

  closeModal(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.selectedUser.set(null);
    this.modalMode.set(null);
    this.modalError.set('');
  }

  confirmUnban(): void {
    const user = this.selectedUser();

    if (!user || this.modalMode() !== 'unban') {
      return;
    }

    this.isSubmitting.set(true);
    this.modalError.set('');

    this.adminUserService.unbanUser(user._id).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadUsers();
      },
      error: error => {
        this.modalError.set(
          error.error?.error?.message ??
          error.error?.message ??
          'Došlo je do greške pri ukidanju bana.'
        );

        this.isSubmitting.set(false);
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