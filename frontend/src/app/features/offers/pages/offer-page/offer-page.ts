import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import {
  LucideArrowLeft,
  LucideChevronRight,
  LucideDynamicIcon,
  LucideMapPin,
  LucidePackageOpen,
  LucideShoppingBasket,
  LucideStore
} from '@lucide/angular';
import { AuthService } from '../../../auth/services/auth';
import { CartService } from '../../../cart/services/cart';
import { ToastService } from '../../../../shared/services/toast';
import {
  getOfferCategoryConfig,
  OfferCategoryConfig
} from '../../constants/offer-categories';
import { Offer } from '../../models/offer';
import { OfferService } from '../../services/offer';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

@Component({
  selector: 'app-offer-page',
  imports: [
    LucideDynamicIcon,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './offer-page.html',
  styleUrl: './offer-page.css'
})
export class OfferPage implements OnInit {
  private readonly activatedRoute = inject(
    ActivatedRoute
  );

  private readonly authService = inject(
    AuthService
  );

  private readonly formBuilder = inject(
    FormBuilder
  );

  private readonly offerService = inject(
    OfferService
  );

  private readonly cartService = inject(
    CartService
  );

  private readonly toastService = inject(
    ToastService
  );

  private readonly router = inject(
    Router
  );

  private wasCartOpen = false;

  readonly backIcon = LucideArrowLeft;
  readonly locationIcon = LucideMapPin;
  readonly quantityIcon = LucidePackageOpen;
  readonly orderIcon = LucideShoppingBasket;
  readonly sellerIcon = LucideStore;
  readonly arrowIcon = LucideChevronRight;
  readonly storeIcon = LucideStore;

  readonly offer = signal<Offer | null>(
    null
  );

  readonly isLoading = signal(true);

  readonly loadError = signal('');

  readonly currentUser =
    this.authService.currentUser;

  readonly isAuthenticated =
    this.authService.isAuthenticated;

  readonly isBuyer = computed(() => {
    return (
      this.currentUser()?.role ===
      'buyer'
    );
  });

  readonly isSeller = computed(() => {
    return (
      this.currentUser()?.role ===
      'seller'
    );
  });

  readonly isAdmin = computed(() => {
    return (
      this.currentUser()?.role ===
      'admin'
    );
  });

  readonly quantityInCart =
    computed(() => {
      const currentOffer =
        this.offer();

      if (!currentOffer) {
        return 0;
      }

      const item =
        this.cartService
          .items()
          .find(item => {
            return (
              item.offerId ===
              currentOffer._id
            );
          });

      return item?.quantity ?? 0;
    });

  readonly remainingAvailableQuantity =
    computed(() => {
      const currentOffer =
        this.offer();

      if (!currentOffer) {
        return 0;
      }

      return Math.max(
        0,
        currentOffer.availableQuantity -
        this.quantityInCart()
      );
    });

  readonly orderForm =
    this.formBuilder.nonNullable.group({
      quantity: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ]
    });

  readonly totalPrice = computed(() => {
    const currentOffer =
      this.offer();

    if (!currentOffer) {
      return 0;
    }

    const quantity = Number(
      this.orderForm.controls.quantity.value
    );

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      return 0;
    }

    return (
      quantity *
      currentOffer.price
    );
  });

  constructor() {
    effect(() => {
      const isCartOpen =
        this.cartService.isOpen();

      if (isCartOpen) {
        this.wasCartOpen = true;
        return;
      }

      if (!this.wasCartOpen) {
        return;
      }

      this.wasCartOpen = false;

      untracked(() => {
        this.refreshOffer();
      });
    });
  }

  ngOnInit(): void {
    const offerId =
      this.activatedRoute.snapshot.paramMap.get(
        'offerId'
      );

    if (!offerId) {
      this.loadError.set(
        'Ponuda nije pronađena.'
      );

      this.isLoading.set(false);
      return;
    }

    this.loadOffer(offerId);
  }

  retry(): void {
    const offerId =
      this.activatedRoute.snapshot.paramMap.get(
        'offerId'
      );

    if (!offerId) {
      return;
    }

    this.loadOffer(offerId);
  }

  goToLogin(): void {
    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          returnUrl:
            this.router.url
        }
      }
    );
  }

  categoryConfig(
    category: string
  ): OfferCategoryConfig {
    return getOfferCategoryConfig(
      category
    );
  }

  createOrder(): void {
    const currentOffer =
      this.offer();

    if (
      !currentOffer ||
      !this.isBuyer()
    ) {
      return;
    }

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();

      this.toastService.error(
        'Proveri količinu pre dodavanja u korpu.'
      );

      return;
    }

    const quantity = Number(
      this.orderForm.controls.quantity.value
    );

    if (!Number.isInteger(quantity)) {
      this.toastService.error(
        'Količina mora biti ceo broj.'
      );

      return;
    }

    const remainingQuantity =
      this.remainingAvailableQuantity();

    if (remainingQuantity <= 0) {
      this.toastService.error(
        'Celokupna dostupna količina ove ponude je već u tvojoj korpi.'
      );

      return;
    }

    if (
      quantity >
      remainingQuantity
    ) {
      this.toastService.error(
        `Možeš dodati još najviše ${remainingQuantity} ${currentOffer.unit}.`
      );

      return;
    }

    const result =
      this.cartService.addOffer(
        currentOffer,
        quantity
      );

    if (
      result ===
      'different-seller'
    ) {
      const shouldReplace =
        window.confirm(
          'U korpi već imaš proizvode drugog domaćina. Da li želiš da isprazniš korpu i dodaš ovu ponudu?'
        );

      if (!shouldReplace) {
        return;
      }

      this.cartService.replaceWithOffer(
        currentOffer,
        quantity
      );
    }

    this.toastService.success(
      'Ponuda je dodata u korpu.'
    );

    this.orderForm.controls.quantity.setValue(
      1
    );

    this.cartService.open();
  }

  private loadOffer(
    offerId: string
  ): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.offerService
      .getOfferById(offerId)
      .subscribe({
        next: response => {
          this.cartService.syncOffer(
            response.offer
          );

          this.offer.set(
            response.offer
          );

          this.isLoading.set(false);
        },
        error: error => {
          this.offer.set(null);
          this.isLoading.set(false);

          this.handleLoadError(
            error
          );
        }
      });
  }

  private refreshOffer(): void {
    const offerId =
      this.activatedRoute.snapshot.paramMap.get(
        'offerId'
      );

    if (!offerId) {
      return;
    }

    this.offerService
      .getOfferById(offerId)
      .subscribe({
        next: response => {
          this.cartService.syncOffer(
            response.offer
          );

          this.offer.set(
            response.offer
          );
        },
        error: error => {
          const response =
            error.error as
              | ApiErrorBody
              | undefined;

          if (
            response?.error?.code ===
            'OFFER_NOT_FOUND'
          ) {
            this.offer.set(null);

            this.loadError.set(
              'Ponuda nije pronađena ili više nije dostupna.'
            );
          }
        }
      });
  }

  private handleLoadError(
    error: HttpErrorResponse
  ): void {
    const response =
      error.error as
        | ApiErrorBody
        | undefined;

    if (
      response?.error?.code ===
      'OFFER_NOT_FOUND'
    ) {
      this.loadError.set(
        'Ponuda nije pronađena ili više nije dostupna.'
      );

      return;
    }

    this.loadError.set(
      response?.error?.message ??
      'Podaci o ponudi trenutno nisu dostupni.'
    );
  }
}