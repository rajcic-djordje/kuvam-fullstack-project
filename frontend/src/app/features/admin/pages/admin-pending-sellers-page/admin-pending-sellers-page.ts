import { DatePipe, DOCUMENT } from '@angular/common';
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
import { ApiErrorService } from '../../../../shared/services/api-error';
import { FormDraftService } from '../../../../shared/services/form-draft';
import {
  AdminPendingSeller,
  AdminPendingSellerActionResponse,
  AdminPendingSellersSort
} from '../../models/admin-pending-seller';
import { AdminPendingSellerService } from '../../services/admin-pending-seller';

type PendingSellerModalMode =
  | 'profile'
  | 'store'
  | 'approve'
  | 'reject'
  | null;

interface RejectSellerDraft {
  reason: string;
}

@Component({
  selector: 'app-admin-pending-sellers-page',
  imports: [
    DatePipe,
    LucideDynamicIcon
  ],
  templateUrl: './admin-pending-sellers-page.html',
  styleUrl: './admin-pending-sellers-page.css'
})
export class AdminPendingSellersPage implements OnInit, OnDestroy {
  private readonly adminPendingSellerService =
    inject(AdminPendingSellerService);

  private readonly apiErrorService =
    inject(ApiErrorService);

  private readonly formDraftService =
    inject(FormDraftService);

  private readonly document =
    inject(DOCUMENT);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  readonly sellers =
    signal<AdminPendingSeller[]>([]);

  readonly isLoading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly searchTerm =
    signal('');

  readonly selectedSort =
    signal<AdminPendingSellersSort>('newest');

  readonly openedMenuSellerId =
    signal<string | null>(null);

  readonly selectedSeller =
    signal<AdminPendingSeller | null>(null);

  readonly modalMode =
    signal<PendingSellerModalMode>(null);

  readonly rejectionReason =
    signal('');

  readonly modalError =
    signal('');

  readonly isSubmitting =
    signal(false);

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

    this.document.body.classList.remove(
      'modal-open'
    );
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

    this.adminPendingSellerService
      .getPendingSellers(
        this.searchTerm(),
        this.selectedSort()
      )
      .subscribe({
        next: response => {
          this.sellers.set(
            response.sellers ?? []
          );

          this.isLoading.set(false);
        },

        error: error => {
          this.sellers.set([]);

          this.errorMessage.set(
            this.apiErrorService.getMessage(
              error,
              'Došlo je do greške pri učitavanju prijava domaćina.'
            )
          );

          this.isLoading.set(false);
        }
      });
  }

  toggleActionsMenu(sellerId: string): void {
    this.openedMenuSellerId.update(
      currentId => {
        return currentId === sellerId
          ? null
          : sellerId;
      }
    );
  }

  closeActionsMenu(): void {
    this.openedMenuSellerId.set(null);
  }

  openProfile(seller: AdminPendingSeller): void {
    this.openModal(
      'profile',
      seller
    );
  }

  openStore(seller: AdminPendingSeller): void {
    this.openModal(
      'store',
      seller
    );
  }

  openApprove(seller: AdminPendingSeller): void {
    this.openModal(
      'approve',
      seller
    );
  }

  openReject(seller: AdminPendingSeller): void {
    this.openModal(
      'reject',
      seller
    );
  }

  openModal(
    mode: Exclude<PendingSellerModalMode, null>,
    seller: AdminPendingSeller
  ): void {
    this.closeActionsMenu();

    this.selectedSeller.set(seller);
    this.modalMode.set(mode);
    this.modalError.set('');

    if (mode === 'reject') {
      const draft =
        this.formDraftService.load<RejectSellerDraft>(
          this.rejectDraftKey(seller._id)
        );

      this.rejectionReason.set(
        draft?.reason ?? ''
      );
    } else {
      this.rejectionReason.set('');
    }

    this.document.body.classList.add(
      'modal-open'
    );
  }

  closeModal(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.modalMode.set(null);
    this.selectedSeller.set(null);
    this.rejectionReason.set('');
    this.modalError.set('');

    this.document.body.classList.remove(
      'modal-open'
    );
  }

  onRejectionReasonChange(value: string): void {
    this.rejectionReason.set(value);

    const seller =
      this.selectedSeller();

    if (
      seller &&
      this.modalMode() === 'reject'
    ) {
      this.formDraftService.save(
        this.rejectDraftKey(seller._id),
        {
          reason: value
        } satisfies RejectSellerDraft
      );
    }

    if (this.modalError()) {
      this.modalError.set('');
    }
  }

  confirmApplicationAction(): void {
    const seller =
      this.selectedSeller();

    const mode =
      this.modalMode();

    const reason =
      this.rejectionReason().trim();

    if (
      !seller ||
      (
        mode !== 'approve' &&
        mode !== 'reject'
      )
    ) {
      return;
    }

    if (
      mode === 'reject' &&
      reason.length < 3
    ) {
      this.modalError.set(
        'Razlog odbijanja mora imati najmanje 3 karaktera.'
      );

      return;
    }

    let request:
      Observable<AdminPendingSellerActionResponse>;

    if (mode === 'approve') {
      request =
        this.adminPendingSellerService
          .approveSeller(
            seller._id
          );
    } else {
      request =
        this.adminPendingSellerService
          .rejectSeller(
            seller._id,
            reason
          );
    }

    this.isSubmitting.set(true);
    this.modalError.set('');

    request.subscribe({
      next: () => {
        this.formDraftService.clear(
          this.rejectDraftKey(
            seller._id
          )
        );

        this.isSubmitting.set(false);

        this.closeModal();
        this.loadSellers();
      },

      error: error => {
        this.modalError.set(
          this.apiErrorService.getMessage(
            error,
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
    return (
      `${seller.user.firstName.charAt(0)}${seller.user.lastName.charAt(0)}`
    ).toUpperCase();
  }

  getStoreInitials(
    seller: AdminPendingSeller
  ): string {
    return seller.businessName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => {
        return word.charAt(0);
      })
      .join('')
      .toUpperCase();
  }

  getOwnerName(
    seller: AdminPendingSeller
  ): string {
    return (
      `${seller.user.firstName} ${seller.user.lastName}`
    ).trim();
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

  private rejectDraftKey(
    sellerId: string
  ): string {
    return (
      `admin-reject-seller:${sellerId}`
    );
  }
}