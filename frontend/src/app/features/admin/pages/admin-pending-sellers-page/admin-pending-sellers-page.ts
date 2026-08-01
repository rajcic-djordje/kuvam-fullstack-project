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
  LucideCheck,
  LucideClock3,
  LucideDynamicIcon,
  LucideEllipsis,
  LucideEye,
  LucideFlag,
  LucideMail,
  LucideScanSearch,
  LucideShieldCheck,
  LucideStore,
  LucideUserRound,
  LucideX,
  LucideXCircle,
  type LucideIcon
} from '@lucide/angular';
import { Observable } from 'rxjs';
import {
  AdminPendingSeller,
  AdminPendingSellerActionResponse,
  AdminPendingSellersSort
} from '../../models/admin-pending-seller';
import {
  AdminPendingSellerService
} from '../../services/admin-pending-seller';

type PendingSellerModalMode =
  | 'profile'
  | 'store'
  | 'approve'
  | 'reject'
  | null;

@Component({
  selector: 'app-admin-pending-sellers-page',
  imports: [
    DatePipe,
    LucideDynamicIcon
  ],
  templateUrl: './admin-pending-sellers-page.html',
  styleUrl: './admin-pending-sellers-page.css'
})
export class AdminPendingSellersPage
  implements OnInit, OnDestroy {
  private readonly adminPendingSellerService =
    inject(AdminPendingSellerService);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  readonly sellers = signal<AdminPendingSeller[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');

  readonly selectedSort =
    signal<AdminPendingSellersSort>('newest');

  readonly openedMenuSellerId =
    signal<string | null>(null);

  readonly selectedSeller =
    signal<AdminPendingSeller | null>(null);

  readonly modalMode =
    signal<PendingSellerModalMode>(null);

  readonly rejectionReason = signal('');
  readonly modalError = signal('');
  readonly isSubmitting = signal(false);

  readonly sellersIcon: LucideIcon =
    LucideStore;

  readonly searchIcon: LucideIcon =
    LucideScanSearch;

  readonly actionsIcon: LucideIcon =
    LucideEllipsis;

  readonly calendarIcon: LucideIcon =
    LucideCalendarDays;

  readonly ownerIcon: LucideIcon =
    LucideUserRound;

  readonly pendingIcon: LucideIcon =
    LucideClock3;

  readonly profileIcon: LucideIcon =
    LucideUserRound;

  readonly storeIcon: LucideIcon =
    LucideStore;

  readonly viewIcon: LucideIcon =
    LucideEye;

  readonly approveIcon: LucideIcon =
    LucideCheck;

  readonly rejectIcon: LucideIcon =
    LucideXCircle;

  readonly closeIcon: LucideIcon =
    LucideX;

  readonly warningIcon: LucideIcon =
    LucideAlertTriangle;

  readonly emailIcon: LucideIcon =
    LucideMail;

  readonly statusIcon: LucideIcon =
    LucideShieldCheck;

  readonly reportsIcon: LucideIcon =
    LucideFlag;

  ngOnInit(): void {
    this.loadSellers();
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
      this.loadSellers();
    }, 350);
  }

  onSortChange(value: string): void {
    const sort: AdminPendingSellersSort =
      value === 'oldest'
        ? 'oldest'
        : 'newest';

    this.selectedSort.set(sort);
    this.closeActionsMenu();
    this.loadSellers();
  }

  loadSellers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.closeActionsMenu();

    this.adminPendingSellerService.getPendingSellers(
      this.searchTerm(),
      this.selectedSort()
    ).subscribe({
      next: response => {
        this.sellers.set(response.sellers ?? []);
        this.isLoading.set(false);
      },
      error: error => {
        this.sellers.set([]);

        this.errorMessage.set(
          error.error?.error?.message ??
          error.error?.message ??
          'Došlo je do greške pri učitavanju prijava prodavaca.'
        );

        this.isLoading.set(false);
      }
    });
  }

  toggleActionsMenu(sellerId: string): void {
    this.openedMenuSellerId.update(currentId =>
      currentId === sellerId
        ? null
        : sellerId
    );
  }

  closeActionsMenu(): void {
    this.openedMenuSellerId.set(null);
  }

  openProfile(seller: AdminPendingSeller): void {
    this.openModal('profile', seller);
  }

  openStore(seller: AdminPendingSeller): void {
    this.openModal('store', seller);
  }

  openApprove(seller: AdminPendingSeller): void {
    this.openModal('approve', seller);
  }

  openReject(seller: AdminPendingSeller): void {
    this.openModal('reject', seller);
  }

  openModal(
    mode: Exclude<PendingSellerModalMode, null>,
    seller: AdminPendingSeller
  ): void {
    this.closeActionsMenu();
    this.selectedSeller.set(seller);
    this.modalMode.set(mode);
    this.rejectionReason.set('');
    this.modalError.set('');
  }

  closeModal(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.modalMode.set(null);
    this.selectedSeller.set(null);
    this.rejectionReason.set('');
    this.modalError.set('');
  }

  onRejectionReasonChange(value: string): void {
    this.rejectionReason.set(value);

    if (this.modalError()) {
      this.modalError.set('');
    }
  }

  confirmApplicationAction(): void {
    const seller = this.selectedSeller();
    const mode = this.modalMode();
    const reason = this.rejectionReason().trim();

    if (
      !seller ||
      (mode !== 'approve' && mode !== 'reject')
    ) {
      return;
    }

    if (mode === 'reject' && reason.length < 3) {
      this.modalError.set(
        'Razlog odbijanja mora imati najmanje 3 karaktera.'
      );

      return;
    }

    let request:
      Observable<AdminPendingSellerActionResponse>;

    if (mode === 'approve') {
      request =
        this.adminPendingSellerService.approveSeller(
          seller._id
        );
    } else {
      request =
        this.adminPendingSellerService.rejectSeller(
          seller._id,
          reason
        );
    }

    this.isSubmitting.set(true);
    this.modalError.set('');

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadSellers();
      },
      error: error => {
        this.modalError.set(
          error.error?.error?.message ??
          error.error?.message ??
          (
            mode === 'approve'
              ? 'Došlo je do greške pri odobravanju prijave.'
              : 'Došlo je do greške pri odbijanju prijave.'
          )
        );

        this.isSubmitting.set(false);
      }
    });
  }

  getSellerInitials(
    seller: AdminPendingSeller
  ): string {
    const firstName =
      seller.user?.firstName?.charAt(0) ?? '';

    const lastName =
      seller.user?.lastName?.charAt(0) ?? '';

    return `${firstName}${lastName}`.toUpperCase();
  }

  getStoreInitials(
    seller: AdminPendingSeller
  ): string {
    return seller.businessName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  getOwnerName(
    seller: AdminPendingSeller
  ): string {
    return [
      seller.user?.firstName,
      seller.user?.lastName
    ]
      .filter(Boolean)
      .join(' ');
  }

  getUserStatusLabel(
    status: AdminPendingSeller['user']['status']
  ): string {
    const labels: Record<
      AdminPendingSeller['user']['status'],
      string
    > = {
      active: 'Aktivan',
      suspended: 'Suspendovan',
      banned: 'Banovan',
      deactivated: 'Deaktiviran'
    };

    return labels[status];
  }
}