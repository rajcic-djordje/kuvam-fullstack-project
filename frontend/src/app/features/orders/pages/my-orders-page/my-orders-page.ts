import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowRight,
  LucideCalendarDays,
  LucideDynamicIcon,
  LucidePackageOpen,
  LucideReceiptText,
  LucideRefreshCw,
  LucideStore
} from '@lucide/angular';
import { HorizontalScrollDirective } from '../../../../shared/directives/horizontal-scroll/horizontal-scroll';
import { ToastService } from '../../../../shared/services/toast';
import {
  BuyerOrder,
  OrderStatus
} from '../../models/order';
import { OrderService } from '../../services/order';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

interface StatusOption {
  value: OrderStatus | 'all';
  label: string;
}

@Component({
  selector: 'app-my-orders-page',
  imports: [
    LucideDynamicIcon,
    RouterLink,
    HorizontalScrollDirective
  ],
  templateUrl: './my-orders-page.html',
  styleUrl: './my-orders-page.css'
})
export class MyOrdersPage implements OnInit {
  private readonly orderService =
    inject(OrderService);

  private readonly toastService =
    inject(ToastService);

  readonly orderIcon =
    LucideReceiptText;

  readonly packageIcon =
    LucidePackageOpen;

  readonly sellerIcon =
    LucideStore;

  readonly calendarIcon =
    LucideCalendarDays;

  readonly arrowIcon =
    LucideArrowRight;

  readonly retryIcon =
    LucideRefreshCw;

  readonly orders =
    signal<BuyerOrder[]>([]);

  readonly selectedStatus =
    signal<OrderStatus | 'all'>('all');

  readonly isLoading =
    signal(true);

  readonly loadError =
    signal('');

  readonly actionOrderId =
    signal<string | null>(null);

  readonly statusOptions: StatusOption[] = [
    {
      value: 'all',
      label: 'Sve'
    },
    {
      value: 'pending',
      label: 'Na čekanju'
    },
    {
      value: 'accepted',
      label: 'Prihvaćene'
    },
    {
      value: 'ready',
      label: 'Spremne'
    },
    {
      value: 'completed',
      label: 'Završene'
    },
    {
      value: 'rejected',
      label: 'Odbijene'
    },
    {
      value: 'cancelled',
      label: 'Otkazane'
    }
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  selectStatus(
    status: OrderStatus | 'all'
  ): void {
    if (
      this.selectedStatus() === status
    ) {
      return;
    }

    this.selectedStatus.set(status);
    this.loadOrders();
  }

  retry(): void {
    this.loadOrders();
  }

  cancelOrder(
    orderId: string
  ): void {
    if (this.actionOrderId()) {
      return;
    }

    this.actionOrderId.set(orderId);

    this.orderService
      .cancelMyOrder(orderId)
      .subscribe({
        next: response => {
          this.updateOrderStatus(
            orderId,
            response.order.status
          );

          this.actionOrderId.set(null);
        },
        error: error => {
          this.handleActionError(error);
          this.actionOrderId.set(null);
        }
      });
  }

  completeOrder(
    orderId: string
  ): void {
    if (this.actionOrderId()) {
      return;
    }

    this.actionOrderId.set(orderId);

    this.orderService
      .completeMyOrder(orderId)
      .subscribe({
        next: response => {
          this.orders.update(
            orders => {
              return orders.map(
                order => {
                  if (
                    order._id !== orderId
                  ) {
                    return order;
                  }

                  return {
                    ...order,
                    buyerOnTheWayAt:
                      response.order
                        .buyerOnTheWayAt
                  };
                }
              );
            }
          );

          this.actionOrderId.set(null);
        },
        error: error => {
          this.handleActionError(error);
          this.actionOrderId.set(null);
        }
      });
  }

  statusLabel(
    status: OrderStatus
  ): string {
    const labels: Record<
      OrderStatus,
      string
    > = {
      pending: 'Na čekanju',
      accepted: 'Prihvaćena',
      rejected: 'Odbijena',
      ready: 'Spremna za preuzimanje',
      completed: 'Završena',
      cancelled: 'Otkazana'
    };

    return labels[status];
  }

  formatDate(
    value: string
  ): string {
    return new Intl.DateTimeFormat(
      'sr-RS',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      new Date(value)
    );
  }

  private loadOrders(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    const selectedStatus =
      this.selectedStatus();

    const status:
      | OrderStatus
      | undefined =
      selectedStatus === 'all'
        ? undefined
        : selectedStatus;

    this.orderService
      .getMyOrders(status)
      .subscribe({
        next: response => {
          this.orders.set(
            response.orders
          );

          this.isLoading.set(false);
        },
        error: error => {
          this.orders.set([]);
          this.isLoading.set(false);

          this.handleLoadError(
            error
          );
        }
      });
  }

  private updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): void {
    this.orders.update(
      orders => {
        if (
          this.selectedStatus() !== 'all' &&
          this.selectedStatus() !== status
        ) {
          return orders.filter(
            order => {
              return (
                order._id !== orderId
              );
            }
          );
        }

        return orders.map(
          order => {
            if (
              order._id !== orderId
            ) {
              return order;
            }

            return {
              ...order,
              status
            };
          }
        );
      }
    );
  }

  private handleLoadError(
    error: HttpErrorResponse
  ): void {
    const response =
      error.error as
        | ApiErrorBody
        | undefined;

    this.loadError.set(
      response?.error?.message ??
      'Porudžbine trenutno nisu dostupne.'
    );
  }

  private handleActionError(
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
      'ORDER_CANNOT_BE_CANCELLED'
    ) {
      this.toastService.error(
        'Samo porudžbine na čekanju mogu da se otkažu.'
      );

      return;
    }

    if (
      code ===
      'BUYER_ALREADY_ON_THE_WAY'
    ) {
      this.toastService.error(
        'Domaćin je već obavešten da si krenuo po porudžbinu.'
      );

      return;
    }

    if (
      code ===
      'BUYER_CANNOT_BE_MARKED_ON_THE_WAY'
    ) {
      this.toastService.error(
        'Domaćina možeš da obavestiš tek kada porudžbina bude spremna.'
      );

      return;
    }

    if (
      code ===
      'ORDER_CANNOT_BE_COMPLETED'
    ) {
      this.toastService.error(
        'Ova porudžbina trenutno ne može da bude završena.'
      );

      return;
    }

    this.toastService.error(
      response?.error?.message ??
      'Akcija trenutno nije moguća.'
    );
  }
}