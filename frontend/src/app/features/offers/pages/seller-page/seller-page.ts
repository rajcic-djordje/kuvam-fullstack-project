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
  LucideArrowLeft,
  LucideBadgeCheck,
  LucideChevronRight,
  LucideDynamicIcon,
  LucideMapPin,
  LucideStar,
  LucideStore
} from '@lucide/angular';
import { HorizontalScrollDirective } from '../../../../shared/directives/horizontal-scroll/horizontal-scroll';
import { ApiErrorService } from '../../../../shared/services/api-error';
import { Review } from '../../../reviews/models/review';
import { ReviewService } from '../../../reviews/services/review';
import { SellerLocationMap } from '../../components/seller-location-map/seller-location-map';
import {
  OFFER_CATEGORIES,
  OfferCategoryConfig
} from '../../constants/offer-categories';
import {
  OfferCategory,
  PublicSeller,
  SellerOfferPreview
} from '../../models/seller';
import { SellerService } from '../../services/seller';

@Component({
  selector: 'app-seller-page',
  imports: [
    LucideDynamicIcon,
    RouterLink,
    SellerLocationMap,
    HorizontalScrollDirective
  ],
  templateUrl: './seller-page.html',
  styleUrl: './seller-page.css'
})
export class SellerPage implements OnInit {
  private readonly sellerService =
    inject(SellerService);

  private readonly activatedRoute =
    inject(ActivatedRoute);

  private readonly reviewService =
    inject(ReviewService);

  private readonly apiErrorService =
    inject(ApiErrorService);

  readonly backIcon = LucideArrowLeft;
  readonly mapPinIcon = LucideMapPin;
  readonly verifiedIcon = LucideBadgeCheck;
  readonly storeIcon = LucideStore;
  readonly arrowIcon = LucideChevronRight;
  readonly starIcon = LucideStar;

  readonly seller =
    signal<PublicSeller | null>(null);

  readonly isLoading =
    signal(true);

  readonly loadError =
    signal('');

  readonly reviews =
    signal<Review[]>([]);

  readonly reviewsCount =
    signal(0);

  readonly averageRating =
    signal(0);

  readonly isReviewsLoading =
    signal(false);

  readonly reviewsError =
    signal('');

  readonly starOptions = [
    1,
    2,
    3,
    4,
    5
  ];

  ngOnInit(): void {
    const slug =
      this.activatedRoute.snapshot.paramMap.get(
        'slug'
      );

    if (!slug) {
      this.loadError.set(
        'Domaćin nije pronađen.'
      );

      this.isLoading.set(false);

      return;
    }

    this.loadSeller(slug);
  }

  retry(): void {
    const slug =
      this.activatedRoute.snapshot.paramMap.get(
        'slug'
      );

    if (!slug) {
      return;
    }

    this.loadSeller(slug);
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

  formatReviewDate(
    value: string
  ): string {
    return new Intl.DateTimeFormat(
      'sr-Latn-RS',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    ).format(
      new Date(value)
    );
  }

  roundedAverageRating(): string {
    return this.averageRating()
      .toFixed(1);
  }

  reviewsCountLabel(
    count: number
  ): string {
    const lastTwo =
      count % 100;

    const last =
      count % 10;

    if (
      lastTwo >= 11 &&
      lastTwo <= 14
    ) {
      return 'ocena';
    }

    if (last === 1) {
      return 'ocena';
    }

    if (
      last >= 2 &&
      last <= 4
    ) {
      return 'ocene';
    }

    return 'ocena';
  }

  availableCategories(
    offers: SellerOfferPreview[]
  ): OfferCategoryConfig[] {
    return OFFER_CATEGORIES.filter(
      category => {
        return offers.some(
          offer =>
            offer.category ===
            category.id
        );
      }
    );
  }

  offersForCategory(
    offers: SellerOfferPreview[],
    category: OfferCategory
  ): SellerOfferPreview[] {
    return offers.filter(
      offer =>
        offer.category ===
        category
    );
  }

  private loadSeller(
    slug: string
  ): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.sellerService
      .getSellerBySlug(slug)
      .subscribe({
        next: response => {
          this.seller.set(
            response.seller
          );

          this.isLoading.set(false);

          this.loadReviews(
            response.seller.id
          );
        },

        error: error => {
          this.seller.set(null);
          this.isLoading.set(false);

          this.loadError.set(
            this.apiErrorService.getMessage(
              error,
              'Podaci domaćina trenutno nisu dostupni.'
            )
          );
        }
      });
  }

  private loadReviews(
    sellerId: string
  ): void {
    this.isReviewsLoading.set(true);
    this.reviewsError.set('');

    this.reviewService
      .getSellerReviews(sellerId)
      .subscribe({
        next: response => {
          this.reviews.set(
            response.reviews
          );

          this.reviewsCount.set(
            response.reviewsCount
          );

          this.averageRating.set(
            response.averageRating
          );

          this.isReviewsLoading.set(
            false
          );
        },

        error: () => {
          this.reviews.set([]);
          this.reviewsCount.set(0);
          this.averageRating.set(0);

          this.isReviewsLoading.set(
            false
          );

          this.reviewsError.set(
            'Ocene trenutno nisu dostupne.'
          );
        }
      });
  }
}