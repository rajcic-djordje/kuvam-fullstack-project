import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import {
  Router,
  RouterLink
} from '@angular/router';
import {
  LucideChevronRight,
  LucideDynamicIcon,
  LucideHeart,
  LucideLeaf,
  LucideMapPin,
  LucidePackageOpen,
  LucideScanSearch,
  LucideShieldCheck,
  LucideShoppingBag,
  LucideShoppingBasket
} from '@lucide/angular';
import { HorizontalScrollDirective } from '../../../../shared/directives/horizontal-scroll/horizontal-scroll';
import {
  getOfferCategoryConfig,
  OFFER_CATEGORY_FILTERS,
  OfferCategoryConfig
} from '../../../offers/constants/offer-categories';
import { Offer } from '../../../offers/models/offer';
import { OfferService } from '../../../offers/services/offer';

@Component({
  selector: 'app-home-page',
  imports: [
    LucideDynamicIcon,
    RouterLink,
    HorizontalScrollDirective
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  private readonly offerService = inject(
    OfferService
  );

  private readonly router = inject(Router);

  readonly categories =
    OFFER_CATEGORY_FILTERS;

  readonly searchIcon =
    LucideScanSearch;

  readonly verifiedIcon =
    LucideShieldCheck;

  readonly leafIcon =
    LucideLeaf;

  readonly locationIcon =
    LucideMapPin;

  readonly basketIcon =
    LucideShoppingBasket;

  readonly bagIcon =
    LucideShoppingBag;

  readonly heartIcon =
    LucideHeart;

  readonly offerIcon =
    LucidePackageOpen;

  readonly arrowIcon =
    LucideChevronRight;

  readonly latestOffers =
    signal<Offer[]>([]);

  readonly isLoadingOffers =
    signal(true);

  readonly offersError =
    signal(false);

  ngOnInit(): void {
    this.loadLatestOffers();
  }

  searchOffers(search: string): void {
    const searchTerm = search.trim();

    this.router.navigate(
      ['/offers'],
      {
        queryParams: searchTerm
          ? { search: searchTerm }
          : {}
      }
    );
  }

  categoryConfig(
    categoryId: string
  ): OfferCategoryConfig {
    return getOfferCategoryConfig(
      categoryId
    );
  }

  private loadLatestOffers(): void {
    this.isLoadingOffers.set(true);
    this.offersError.set(false);

    this.offerService
      .getOffers()
      .subscribe({
        next: response => {
          this.latestOffers.set(
            response.offers.slice(0, 8)
          );

          this.isLoadingOffers.set(false);
        },
        error: () => {
          this.latestOffers.set([]);
          this.offersError.set(true);
          this.isLoadingOffers.set(false);
        }
      });
  }
}