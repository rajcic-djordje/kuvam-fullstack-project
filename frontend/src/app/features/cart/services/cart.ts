import {
  computed,
  Injectable,
  signal
} from '@angular/core';
import { Offer } from '../../offers/models/offer';
import {
  CartItem,
  CartState
} from '../models/cart';

const CART_STORAGE_KEY = 'kuvam-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly state = signal<CartState>(
    this.readStoredCart()
  );

  private readonly openSignal = signal(false);

  readonly cart = this.state.asReadonly();
  readonly isOpen = this.openSignal.asReadonly();

  readonly items = computed(() => {
    return this.state().items;
  });

  readonly seller = computed(() => {
    return this.state().seller;
  });

  readonly itemCount = computed(() => {
    return this.state().items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  });

  readonly totalPrice = computed(() => {
    return this.state().items.reduce(
      (sum, item) => {
        return (
          sum +
          item.unitPrice *
          item.quantity
        );
      },
      0
    );
  });

  addOffer(
    offer: Offer,
    quantity: number
  ): 'added' | 'different-seller' {
    const current = this.state();

    if (
      current.seller &&
      current.seller.id !==
        offer.seller._id
    ) {
      return 'different-seller';
    }

    const existingItem =
      current.items.find(
        item => {
          return (
            item.offerId ===
            offer._id
          );
        }
      );

    const nextQuantity =
      Math.min(
        (
          existingItem?.quantity ??
          0
        ) + quantity,
        offer.availableQuantity
      );

    const nextItem: CartItem = {
      offerId: offer._id,
      name: offer.name,
      imageUrl: offer.imageUrl,
      unit: offer.unit,
      unitPrice: offer.price,
      quantity: nextQuantity,
      availableQuantity:
        offer.availableQuantity
    };

    const items =
      existingItem
        ? current.items.map(
            item => {
              return (
                item.offerId ===
                offer._id
              )
                ? nextItem
                : item;
            }
          )
        : [
            ...current.items,
            nextItem
          ];

    this.setState({
      seller:
        current.seller ?? {
          id:
            offer.seller._id,

          businessName:
            offer.seller
              .businessName
        },

      items
    });

    return 'added';
  }

  replaceWithOffer(
    offer: Offer,
    quantity: number
  ): void {
    this.setState({
      seller: null,
      items: []
    });

    this.addOffer(
      offer,
      quantity
    );
  }

  syncOffer(
    offer: Offer
  ): void {
    const current =
      this.state();

    const existingItem =
      current.items.find(
        item => {
          return (
            item.offerId ===
            offer._id
          );
        }
      );

    if (!existingItem) {
      return;
    }

    if (
      !offer.isActive ||
      offer.availableQuantity <= 0
    ) {
      this.removeItem(
        offer._id
      );

      return;
    }

    const quantity =
      Math.min(
        existingItem.quantity,
        offer.availableQuantity
      );

    const items =
      current.items.map(
        item => {
          if (
            item.offerId !==
            offer._id
          ) {
            return item;
          }

          return {
            ...item,
            name:
              offer.name,

            imageUrl:
              offer.imageUrl,

            unit:
              offer.unit,

            unitPrice:
              offer.price,

            quantity,

            availableQuantity:
              offer.availableQuantity
          };
        }
      );

    this.setState({
      seller:
        current.seller,

      items
    });
  }

  setQuantity(
    offerId: string,
    quantity: number
  ): void {
    const current =
      this.state();

    const items =
      current.items.map(
        item => {
          if (
            item.offerId !==
            offerId
          ) {
            return item;
          }

          return {
            ...item,

            quantity:
              Math.max(
                1,
                Math.min(
                  quantity,
                  item.availableQuantity
                )
              )
          };
        }
      );

    this.setState({
      ...current,
      items
    });
  }

  removeItem(
    offerId: string
  ): void {
    const current =
      this.state();

    const items =
      current.items.filter(
        item => {
          return (
            item.offerId !==
            offerId
          );
        }
      );

    this.setState({
      seller:
        items.length > 0
          ? current.seller
          : null,

      items
    });
  }

  clear(): void {
    this.setState({
      seller: null,
      items: []
    });
  }

  open(): void {
    this.openSignal.set(
      true
    );
  }

  close(): void {
    this.openSignal.set(
      false
    );
  }

  private setState(
    state: CartState
  ): void {
    this.state.set(
      state
    );

    if (
      typeof localStorage !==
      'undefined'
    ) {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(state)
      );
    }
  }

  private readStoredCart(): CartState {
    if (
      typeof localStorage ===
      'undefined'
    ) {
      return {
        seller: null,
        items: []
      };
    }

    try {
      const value =
        localStorage.getItem(
          CART_STORAGE_KEY
        );

      if (!value) {
        return {
          seller: null,
          items: []
        };
      }

      const state =
        JSON.parse(
          value
        ) as CartState;

      if (
        !Array.isArray(
          state.items
        ) ||
        (
          state.items.length >
            0 &&
          !state.seller
        )
      ) {
        return {
          seller: null,
          items: []
        };
      }

      return state;
    } catch {
      return {
        seller: null,
        items: []
      };
    }
  }
}