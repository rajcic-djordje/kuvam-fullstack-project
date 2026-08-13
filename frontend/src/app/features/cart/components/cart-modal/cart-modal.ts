import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  untracked
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAlertCircle,
  LucideDynamicIcon,
  LucideInfo,
  LucideMinus,
  LucidePlus,
  LucideRefreshCw,
  LucideShieldCheck,
  LucideShoppingBasket,
  LucideStore,
  LucideTrash2,
  LucideX
} from '@lucide/angular';
import {
  catchError,
  forkJoin,
  of
} from 'rxjs';
import { FormDraftService } from '../../../../shared/services/form-draft';
import { OfferService } from '../../../offers/services/offer';
import { OrderService } from '../../../orders/services/order';
import { CartService } from '../../services/cart';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

interface CartNoteDraft {
  buyerNote: string;
}

@Component({
  selector: 'app-cart-modal',
  imports: [
    FormsModule,
    LucideDynamicIcon
  ],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css'
})
export class CartModal
implements OnInit, OnDestroy {
  readonly cartService =
    inject(CartService);

  private readonly document =
    inject(DOCUMENT);

  private readonly orderService =
    inject(OrderService);

  private readonly offerService =
    inject(OfferService);

  private readonly formDraftService =
    inject(FormDraftService);

  private readonly noteDraftKey =
    'cart-buyer-note';

  readonly closeIcon =
    LucideX;

  readonly cartIcon =
    LucideShoppingBasket;

  readonly minusIcon =
    LucideMinus;

  readonly plusIcon =
    LucidePlus;

  readonly removeIcon =
    LucideTrash2;

  readonly storeIcon =
    LucideStore;

  readonly infoIcon =
    LucideInfo;

  readonly shieldIcon =
    LucideShieldCheck;

  readonly refreshIcon =
    LucideRefreshCw;

  readonly alertIcon =
    LucideAlertCircle;

  readonly buyerNote =
    signal('');

  readonly isSubmitting =
    signal(false);

  readonly isRefreshing =
    signal(false);

  readonly error =
    signal('');

  readonly refreshWarning =
    signal('');

  private wasOpen = false;

  private readonly modalEffect =
    effect(() => {
      const isOpen =
        this.cartService.isOpen();

      this.document.body
        .classList.toggle(
          'modal-open',
          isOpen
        );

      if (
        isOpen &&
        !this.wasOpen
      ) {
        untracked(() => {
          this.refreshCart();
        });
      }

      if (!isOpen) {
        this.error.set('');
        this.refreshWarning.set('');
      }

      this.wasOpen = isOpen;
    });

  ngOnInit(): void {
    const draft =
      this.formDraftService
        .load<CartNoteDraft>(
          this.noteDraftKey
        );

    if (draft) {
      this.buyerNote.set(
        draft.buyerNote ?? ''
      );
    }
  }

  ngOnDestroy(): void {
    this.modalEffect.destroy();

    this.document.body
      .classList.remove(
        'modal-open'
      );
  }

  close(): void {
    if (
      this.isSubmitting()
    ) {
      return;
    }

    this.cartService.close();
  }

  decrease(
    offerId: string,
    quantity: number
  ): void {
    if (
      this.isSubmitting() ||
      this.isRefreshing()
    ) {
      return;
    }

    if (quantity <= 1) {
      this.cartService
        .removeItem(
          offerId
        );

      return;
    }

    this.cartService
      .setQuantity(
        offerId,
        quantity - 1
      );
  }

  increase(
    offerId: string,
    quantity: number
  ): void {
    if (
      this.isSubmitting() ||
      this.isRefreshing()
    ) {
      return;
    }

    this.cartService
      .setQuantity(
        offerId,
        quantity + 1
      );
  }

  remove(
    offerId: string
  ): void {
    if (
      this.isSubmitting() ||
      this.isRefreshing()
    ) {
      return;
    }

    this.cartService
      .removeItem(
        offerId
      );
  }

  updateNote(
    value: string
  ): void {
    this.buyerNote.set(
      value
    );

    this.formDraftService.save(
      this.noteDraftKey,
      {
        buyerNote: value
      } satisfies CartNoteDraft
    );
  }

  refreshCart(): void {
    const items =
      this.cartService.items();

    if (
      this.isRefreshing() ||
      items.length === 0
    ) {
      return;
    }

    this.isRefreshing.set(
      true
    );

    this.refreshWarning.set('');

    const requests =
      items.map(
        item => {
          return this.offerService
            .getOfferById(
              item.offerId
            )
            .pipe(
              catchError(() => {
                return of(null);
              })
            );
        }
      );

    forkJoin(requests)
      .subscribe({
        next: responses => {
          let failedRefreshes = 0;

          for (
            const response
            of responses
          ) {
            if (!response) {
              failedRefreshes += 1;

              continue;
            }

            this.cartService
              .syncOffer(
                response.offer
              );
          }

          if (
            failedRefreshes > 0
          ) {
            this.refreshWarning.set(
              'Neke stavke trenutno nije moguće osvežiti. Konačna dostupnost će svakako biti proverena pri slanju porudžbine.'
            );
          }

          this.isRefreshing.set(
            false
          );
        },

        error: () => {
          this.refreshWarning.set(
            'Korpu trenutno nije moguće osvežiti. Konačna dostupnost će biti proverena pri slanju porudžbine.'
          );

          this.isRefreshing.set(
            false
          );
        }
      });
  }

  submit(): void {
    if (
      this.isSubmitting() ||
      this.isRefreshing() ||
      this.cartService
        .items()
        .length === 0
    ) {
      return;
    }

    this.error.set('');
    this.isSubmitting.set(
      true
    );

    this.orderService
      .createOrder({
        items:
          this.cartService
            .items()
            .map(
              item => ({
                offerId:
                  item.offerId,

                quantity:
                  item.quantity
              })
            ),

        buyerNote:
          this.buyerNote()
            .trim() ||
          undefined
      })
      .subscribe({
        next: () => {
          this.cartService.clear();

          this.formDraftService
            .clear(
              this.noteDraftKey
            );

          this.buyerNote.set('');

          this.isSubmitting.set(
            false
          );

          this.cartService.close();
        },

        error: error => {
          this.handleSubmitError(
            error
          );

          this.isSubmitting.set(
            false
          );

          this.refreshCart();
        }
      });
  }

  private handleSubmitError(
    error: HttpErrorResponse
  ): void {
    const response =
      error.error as
        | ApiErrorBody
        | undefined;

    const code =
      response?.error?.code;

    if (
      code ===
      'INSUFFICIENT_OFFER_QUANTITY'
    ) {
      this.error.set(
        'Dostupna količina neke od stavki se u međuvremenu promenila. Korpa je osvežena — proveri količine i pokušaj ponovo.'
      );

      return;
    }

    if (
      code ===
      'OFFER_NOT_AVAILABLE'
    ) {
      this.error.set(
        'Jedna od ponuda više nije dostupna. Korpa je osvežena — proveri stavke pre ponovnog slanja.'
      );

      return;
    }

    if (
      code ===
      'OFFER_NOT_FOUND'
    ) {
      this.error.set(
        'Jedna od ponuda više ne postoji. Proveri sadržaj korpe.'
      );

      return;
    }

    if (
      code ===
      'MULTIPLE_SELLERS_NOT_ALLOWED'
    ) {
      this.error.set(
        'Sve stavke u jednoj porudžbini moraju pripadati istom domaćinu.'
      );

      return;
    }

    if (
      code ===
      'OWN_OFFER_ORDER_NOT_ALLOWED'
    ) {
      this.error.set(
        'Ne možeš poručiti sopstvenu ponudu.'
      );

      return;
    }

    this.error.set(
      response?.error?.message ??
      'Porudžbina trenutno nije poslata. Pokušaj ponovo.'
    );
  }
}