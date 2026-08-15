import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideCircleOff,
  LucideDynamicIcon,
  LucideEye,
  LucidePlus,
  LucidePower,
  LucideRefreshCw,
  LucideTrash2
} from '@lucide/angular';
import { HorizontalScrollDirective } from '../../../../shared/directives/horizontal-scroll/horizontal-scroll';
import { ApiErrorService } from '../../../../shared/services/api-error';
import { ToastService } from '../../../../shared/services/toast';
import {
  getOfferCategoryConfig,
  OfferCategoryConfig
} from '../../constants/offer-categories';
import { SellerOffer } from '../../models/offer';
import { OfferService } from '../../services/offer';

type OfferFilter =
  | 'all'
  | 'active'
  | 'inactive';

interface FilterOption {
  value: OfferFilter;
  label: string;
}

@Component({
  selector: 'app-seller-offers-page',
  imports: [
    LucideDynamicIcon,
    RouterLink,
    HorizontalScrollDirective
  ],
  templateUrl: './seller-offers-page.html',
  styleUrl: './seller-offers-page.css'
})
export class SellerOffersPage implements OnInit {
  private readonly offerService =
    inject(OfferService);

  private readonly apiErrorService =
    inject(ApiErrorService);

  private readonly toastService =
    inject(ToastService);

  readonly activateIcon =
    LucidePower;

  readonly deactivateIcon =
    LucideCircleOff;

  readonly retryIcon =
    LucideRefreshCw;

  readonly viewIcon =
    LucideEye;

  readonly addIcon =
    LucidePlus;

  readonly deleteIcon =
    LucideTrash2;

  readonly offers =
    signal<SellerOffer[]>([]);

  readonly selectedFilter =
    signal<OfferFilter>('all');

  readonly isLoading =
    signal(true);

  readonly loadError =
    signal('');

  readonly actionOfferId =
    signal<string | null>(null);

  readonly deletingOfferId =
    signal<string | null>(null);

  readonly filterOptions: FilterOption[] = [
    {
      value: 'all',
      label: 'Sve ponude'
    },
    {
      value: 'active',
      label: 'Aktivne'
    },
    {
      value: 'inactive',
      label: 'Neaktivne'
    }
  ];

  ngOnInit(): void {
    this.loadOffers();
  }

  retry(): void {
    this.loadOffers();
  }

  selectFilter(
    filter: OfferFilter
  ): void {
    if (
      this.selectedFilter() === filter
    ) {
      return;
    }

    this.selectedFilter.set(filter);
  }

  filteredOffers(): SellerOffer[] {
    const filter =
      this.selectedFilter();

    if (filter === 'active') {
      return this.offers().filter(
        offer => offer.isActive
      );
    }

    if (filter === 'inactive') {
      return this.offers().filter(
        offer => !offer.isActive
      );
    }

    return this.offers();
  }

  categoryConfig(
    category: string
  ): OfferCategoryConfig {
    return getOfferCategoryConfig(
      category
    );
  }

  activateOffer(
    offerId: string
  ): void {
    if (
      this.actionOfferId() ||
      this.deletingOfferId()
    ) {
      return;
    }

    this.actionOfferId.set(offerId);

    this.offerService
      .activateOffer(offerId)
      .subscribe({
        next: response => {
          this.updateOffer(
            response.offer
          );

          this.toastService.success(
            'Ponuda je aktivirana.'
          );

          this.actionOfferId.set(null);
        },

        error: error => {
          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Status ponude trenutno nije moguće promeniti.'
            )
          );

          this.actionOfferId.set(null);
        }
      });
  }

  deactivateOffer(
    offerId: string
  ): void {
    if (
      this.actionOfferId() ||
      this.deletingOfferId()
    ) {
      return;
    }

    this.actionOfferId.set(offerId);

    this.offerService
      .deactivateOffer(offerId)
      .subscribe({
        next: response => {
          this.updateOffer(
            response.offer
          );

          this.toastService.success(
            'Ponuda je deaktivirana.'
          );

          this.actionOfferId.set(null);
        },

        error: error => {
          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Status ponude trenutno nije moguće promeniti.'
            )
          );

          this.actionOfferId.set(null);
        }
      });
  }

  deleteOffer(
    offer: SellerOffer
  ): void {
    if (
      this.deletingOfferId() ||
      this.actionOfferId()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Da li sigurno želiš da obrišeš ponudu "${offer.name}"?`
      );

    if (!confirmed) {
      return;
    }

    this.deletingOfferId.set(
      offer._id
    );

    this.offerService
      .deleteOffer(offer._id)
      .subscribe({
        next: () => {
          this.offers.update(
            offers => {
              return offers.filter(
                currentOffer => {
                  return (
                    currentOffer._id !==
                    offer._id
                  );
                }
              );
            }
          );

          this.toastService.success(
            'Ponuda je obrisana.'
          );

          this.deletingOfferId.set(
            null
          );
        },

        error: error => {
          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Ponudu trenutno nije moguće obrisati.'
            )
          );

          this.deletingOfferId.set(
            null
          );
        }
      });
  }

  formatDate(
    value: string
  ): string {
    return new Intl.DateTimeFormat(
      'sr-Latn-RS',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    ).format(
      new Date(value)
    );
  }

  private loadOffers(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.offerService
      .getMyOffers()
      .subscribe({
        next: response => {
          this.offers.set(
            response.offers
          );

          this.isLoading.set(false);
        },

        error: error => {
          this.offers.set([]);
          this.isLoading.set(false);

          this.loadError.set(
            this.apiErrorService.getMessage(
              error,
              'Ponude trenutno nisu dostupne.'
            )
          );
        }
      });
  }

  private updateOffer(
    updatedOffer: SellerOffer
  ): void {
    this.offers.update(
      offers => {
        return offers.map(
          offer => {
            return (
              offer._id ===
              updatedOffer._id
            )
              ? updatedOffer
              : offer;
          }
        );
      }
    );
  }
}