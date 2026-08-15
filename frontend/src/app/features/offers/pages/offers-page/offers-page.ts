import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';
import {
  LucideBadgeCheck,
  LucideChevronRight,
  LucideClock,
  LucideDynamicIcon,
  LucideMapPin,
  LucidePackageOpen,
  LucideScanSearch,
  LucideStore,
  LucideX
} from '@lucide/angular';
import { HorizontalScrollDirective } from '../../../../shared/directives/horizontal-scroll/horizontal-scroll';
import { ApiErrorService } from '../../../../shared/services/api-error';
import {
  getOfferCategoryConfig,
  OFFER_CATEGORY_FILTERS,
  OfferCategoryConfig
} from '../../constants/offer-categories';
import {
  OfferCategory,
  OfferCategoryFilter,
  PublicSeller
} from '../../models/seller';
import { SellerService } from '../../services/seller';

@Component({
  selector: 'app-offers-page',
  imports: [
    LucideDynamicIcon,
    RouterLink,
    HorizontalScrollDirective
  ],
  templateUrl: './offers-page.html',
  styleUrl: './offers-page.css'
})
export class OffersPage implements OnInit {
  private readonly sellerService =
    inject(SellerService);

  private readonly activatedRoute =
    inject(ActivatedRoute);

  private readonly apiErrorService =
    inject(ApiErrorService);

  readonly searchIcon =
    LucideScanSearch;

  readonly clearIcon =
    LucideX;

  readonly mapPinIcon =
    LucideMapPin;

  readonly storeIcon =
    LucideStore;

  readonly verifiedIcon =
    LucideBadgeCheck;

  readonly offersIcon =
    LucidePackageOpen;

  readonly arrowIcon =
    LucideChevronRight;

  readonly clockIcon =
    LucideClock;

  readonly categories =
    OFFER_CATEGORY_FILTERS;

  readonly searchTerm =
    signal('');

  readonly selectedCategory =
    signal<OfferCategoryFilter>('all');

  readonly sellers =
    signal<PublicSeller[]>([]);

  readonly isLoading =
    signal(true);

  readonly loadError =
    signal('');

  ngOnInit(): void {
    const search =
      this.activatedRoute.snapshot.queryParamMap.get(
        'search'
      );

    const category =
      this.activatedRoute.snapshot.queryParamMap.get(
        'category'
      );

    if (search) {
      this.searchTerm.set(search);
    }

    if (
      category &&
      this.isValidCategory(category)
    ) {
      this.selectedCategory.set(category);
    }

    this.loadSellers();
  }

  updateSearch(event: Event): void {
    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }

  search(): void {
    this.loadSellers();
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.loadSellers();
  }

  selectCategory(
    category: OfferCategoryFilter
  ): void {
    if (
      this.selectedCategory() ===
      category
    ) {
      return;
    }

    this.selectedCategory.set(category);
    this.loadSellers();
  }

  retry(): void {
    this.loadSellers();
  }

  categoryConfig(
    category: OfferCategory
  ): OfferCategoryConfig {
    return getOfferCategoryConfig(
      category
    );
  }

  sellerInitials(
    businessName: string
  ): string {
    const words = businessName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) {
      return '?';
    }

    if (words.length === 1) {
      return words[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`
      .toUpperCase();
  }

  private loadSellers(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    const category =
      this.selectedCategory();

    this.sellerService
      .getSellers({
        search:
          this.searchTerm().trim() ||
          undefined,

        category:
          category === 'all'
            ? undefined
            : category
      })
      .subscribe({
        next: response => {
          this.sellers.set(
            response.sellers
          );

          this.isLoading.set(false);
        },

        error: error => {
          this.sellers.set([]);
          this.isLoading.set(false);

          this.loadError.set(
            this.apiErrorService.getMessage(
              error,
              'Prodavci trenutno nisu dostupni.'
            )
          );
        }
      });
  }

  private isValidCategory(
    category: string
  ): category is OfferCategory {
    return this.categories.some(
      option =>
        option.id !== 'all' &&
        option.id === category
    );
  }
}