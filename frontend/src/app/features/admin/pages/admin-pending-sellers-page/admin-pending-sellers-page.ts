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
  LucideClock3,
  LucideDynamicIcon,
  LucideEllipsis,
  LucideScanSearch,
  LucideStore,
  LucideUserRound,
  type LucideIcon
} from '@lucide/angular';
import {
  AdminPendingSeller,
  AdminPendingSellersSort
} from '../../models/admin-pending-seller';
import {
  AdminPendingSellerService
} from '../../services/admin-pending-seller';

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

  private searchTimeout?: ReturnType<typeof setTimeout>;

  readonly sellers = signal<AdminPendingSeller[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');
  readonly selectedSort =
    signal<AdminPendingSellersSort>('newest');

  readonly sellersIcon: LucideIcon = LucideStore;
  readonly searchIcon: LucideIcon = LucideScanSearch;
  readonly actionsIcon: LucideIcon = LucideEllipsis;
  readonly calendarIcon: LucideIcon = LucideCalendarDays;
  readonly ownerIcon: LucideIcon = LucideUserRound;
  readonly pendingIcon: LucideIcon = LucideClock3;

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
    this.loadSellers();
  }

  loadSellers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

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

  getSellerInitials(seller: AdminPendingSeller): string {
    const firstName = seller.user?.firstName?.charAt(0) ?? '';
    const lastName = seller.user?.lastName?.charAt(0) ?? '';

    return `${firstName}${lastName}`.toUpperCase();
  }

  getOwnerName(seller: AdminPendingSeller): string {
    return [
      seller.user?.firstName,
      seller.user?.lastName
    ]
      .filter(Boolean)
      .join(' ');
  }
}