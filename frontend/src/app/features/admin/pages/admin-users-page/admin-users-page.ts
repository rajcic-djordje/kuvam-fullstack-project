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
  LucideBan,
  LucideCalendarDays,
  LucideDynamicIcon,
  LucideEllipsis,
  LucideEye,
  LucideFlag,
  LucideMail,
  LucideScanSearch,
  LucideShieldCheck,
  LucideShieldOff,
  LucideShieldX,
  LucideStore,
  LucideUserRound,
  LucideUsersRound,
  LucideX,
  type LucideIcon
} from '@lucide/angular';
import { Observable } from 'rxjs';
import { ApiErrorService } from '../../../../shared/services/api-error';
import {
  AdminUser,
  AdminUserActionResponse,
  AdminUsersRoleFilter,
  AdminUsersSort
} from '../../models/admin-user';
import { AdminUserService } from '../../services/admin-user';

type AdminUserModalMode =
  | 'profile'
  | 'suspend'
  | 'unsuspend'
  | 'ban'
  | 'unban'
  | null;

@Component({
  selector: 'app-admin-users-page',
  imports: [
    DatePipe,
    LucideDynamicIcon
  ],
  templateUrl: './admin-users-page.html',
  styleUrl: './admin-users-page.css'
})
export class AdminUsersPage implements OnInit, OnDestroy {
  private readonly adminUserService =
    inject(AdminUserService);

  private readonly apiErrorService =
    inject(ApiErrorService);

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
    signal<AdminUserModalMode>(null);

  readonly actionReason = signal('');
  readonly modalError = signal('');
  readonly isSubmitting = signal(false);

  readonly usersIcon: LucideIcon =
    LucideUsersRound;

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

  readonly suspendIcon: LucideIcon =
    LucideShieldOff;

  readonly banIcon: LucideIcon =
    LucideBan;

  readonly closeIcon: LucideIcon =
    LucideX;

  readonly warningIcon: LucideIcon =
    LucideAlertTriangle;

  readonly profileIcon: LucideIcon =
    LucideUserRound;

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
      'all',
      this.selectedSort()
    ).subscribe({
      next: response => {
        this.users.set(response.users ?? []);
        this.isLoading.set(false);
      },
      error: error => {
        this.users.set([]);

        this.errorMessage.set(
          this.apiErrorService.getMessage(
            error,
            'Došlo je do greške pri učitavanju korisnika.'
          )
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

  viewProfile(user: AdminUser): void {
    this.openModal('profile', user);
  }

  openSuspendUser(user: AdminUser): void {
    this.openModal('suspend', user);
  }

  openBanUser(user: AdminUser): void {
    this.openModal('ban', user);
  }

  openModal(
    mode: Exclude<AdminUserModalMode, null>,
    user: AdminUser
  ): void {
    this.closeActionsMenu();
    this.selectedUser.set(user);
    this.modalMode.set(mode);
    this.actionReason.set('');
    this.modalError.set('');
  }

  closeModal(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.modalMode.set(null);
    this.selectedUser.set(null);
    this.actionReason.set('');
    this.modalError.set('');
  }

  onReasonChange(value: string): void {
    this.actionReason.set(value);

    if (this.modalError()) {
      this.modalError.set('');
    }
  }

  confirmUserAction(): void {
    const user = this.selectedUser();
    const mode = this.modalMode();
    const reason = this.actionReason().trim();

    if (!user || !mode || mode === 'profile') {
      return;
    }

    if (
      (mode === 'suspend' || mode === 'ban') &&
      reason.length < 3
    ) {
      this.modalError.set(
        'Razlog mora imati najmanje 3 karaktera.'
      );

      return;
    }

    let request:
      Observable<AdminUserActionResponse>;

    switch (mode) {
      case 'suspend':
        request = this.adminUserService.suspendUser(
          user._id,
          reason
        );
        break;

      case 'unsuspend':
        request = this.adminUserService.unsuspendUser(
          user._id
        );
        break;

      case 'ban':
        request = this.adminUserService.banUser(
          user._id,
          reason
        );
        break;

      case 'unban':
        request = this.adminUserService.unbanUser(
          user._id
        );
        break;

      default:
        return;
    }

    this.isSubmitting.set(true);
    this.modalError.set('');

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadUsers();
      },
      error: error => {
        this.modalError.set(
          this.apiErrorService.getMessage(
            error,
            'Došlo je do greške pri izvršavanju akcije.'
          )
        );

        this.isSubmitting.set(false);
      }
    });
  }

  getModalTitle(): string {
    const titles: Record<
      Exclude<AdminUserModalMode, null>,
      string
    > = {
      profile: 'Profil korisnika',
      suspend: 'Suspenduj korisnika',
      unsuspend: 'Ukini suspenziju',
      ban: 'Banuj korisnika',
      unban: 'Ukini ban'
    };

    const mode = this.modalMode();

    return mode
      ? titles[mode]
      : '';
  }

  getModalDescription(): string {
    const user = this.selectedUser();
    const mode = this.modalMode();

    if (!user || !mode) {
      return '';
    }

    const fullName =
      `${user.firstName} ${user.lastName}`;

    const descriptions: Record<
      Exclude<AdminUserModalMode, null>,
      string
    > = {
      profile:
        'Pregled podataka korisničkog naloga.',
      suspend:
        `Nalog korisnika ${fullName} biće privremeno suspendovan.`,
      unsuspend:
        `Korisniku ${fullName} biće vraćen pristup platformi.`,
      ban:
        `Nalog korisnika ${fullName} biće trajno blokiran.`,
      unban:
        `Korisniku ${fullName} biće ukinut ban i vraćen pristup platformi.`
    };

    return descriptions[mode];
  }

  getConfirmButtonLabel(): string {
    const labels: Record<
      Exclude<AdminUserModalMode, 'profile' | null>,
      string
    > = {
      suspend: 'Suspenduj korisnika',
      unsuspend: 'Ukini suspenziju',
      ban: 'Banuj korisnika',
      unban: 'Ukini ban'
    };

    const mode = this.modalMode();

    if (!mode || mode === 'profile') {
      return '';
    }

    return labels[mode];
  }

  isDangerousAction(): boolean {
    return (
      this.modalMode() === 'suspend' ||
      this.modalMode() === 'ban'
    );
  }

  getUserInitials(user: AdminUser): string {
    return (
      user.firstName.charAt(0) +
      user.lastName.charAt(0)
    ).toUpperCase();
  }

  getRoleLabel(role: AdminUser['role']): string {
    const labels: Record<
      AdminUser['role'],
      string
    > = {
      buyer: 'Kupac',
      seller: 'Prodavac'
    };

    return labels[role];
  }

  getStatusLabel(
    status: AdminUser['status']
  ): string {
    const labels: Record<
      AdminUser['status'],
      string
    > = {
      active: 'Aktivan',
      suspended: 'Suspendovan',
      banned: 'Banovan',
      deactivated: 'Deaktiviran'
    };

    return labels[status];
  }

  getRoleIcon(
    role: AdminUser['role']
  ): LucideIcon {
    return role === 'seller'
      ? this.sellerIcon
      : this.buyerIcon;
  }
}