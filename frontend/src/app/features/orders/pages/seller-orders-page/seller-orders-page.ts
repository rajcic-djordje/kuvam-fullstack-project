import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';
import {
  LucideCheck,
  LucideClock,
  LucideDynamicIcon,
  LucidePackageCheck,
  LucideRefreshCw,
  LucideShoppingBag,
  LucideX
} from '@lucide/angular';
import { HorizontalScrollDirective } from '../../../../shared/directives/horizontal-scroll/horizontal-scroll';
import { ToastService } from '../../../../shared/services/toast';
import {
  OrderStatus,
  SellerOrder
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
  selector: 'app-seller-orders-page',
  imports: [
    FormsModule,
    LucideDynamicIcon,
    RouterLink,
    HorizontalScrollDirective
  ],
  templateUrl: './seller-orders-page.html',
  styleUrl: './seller-orders-page.css'
})
export class SellerOrdersPage implements OnInit {
  private readonly orderService =
    inject(OrderService);

  private readonly router =
    inject(Router);

  private readonly toastService =
    inject(ToastService);

  readonly orderIcon =
    LucideShoppingBag;

  readonly pendingIcon =
    LucideClock;

  readonly acceptIcon =
    LucideCheck;

  readonly rejectIcon =
    LucideX;

  readonly readyIcon =
    LucidePackageCheck;

  readonly retryIcon =
    LucideRefreshCw;

  readonly orders =
    signal<SellerOrder[]>([]);

  readonly selectedStatus =
    signal<OrderStatus | 'all'>('all');

  readonly isLoading =
    signal(true);

  readonly loadError =
    signal('');

  readonly actionOrderId =
    signal<string | null>(null);

  readonly rejectingOrderId =
    signal<string | null>(null);

  readonly rejectionReason =
    signal('');

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
    this.closeRejectForm();
    this.loadOrders();
  }

  retry(): void {
    this.loadOrders();
  }

  acceptOrder(
    orderId: string
  ): void {
    this.router.navigate([
      '/seller/orders',
      orderId
    ]);
  }

  openRejectForm(
    orderId: string
  ): void {
    this.rejectionReason.set('');
    this.rejectingOrderId.set(orderId);
  }

  closeRejectForm(): void {
    this.rejectingOrderId.set(null);
    this.rejectionReason.set('');
  }

  updateRejectionReason(
    value: string
  ): void {
    this.rejectionReason.set(value);
  }

  rejectOrder(
    orderId: string
  ): void {
    if (this.actionOrderId()) {
      return;
    }

    const reason =
      this.rejectionReason().trim();

    if (!reason) {
      this.toastService.error(
        'Unesi razlog odbijanja porudžbine.'
      );

      return;
    }

    this.actionOrderId.set(orderId);

    this.orderService
      .rejectOrder(
        orderId,
        {
          rejectionReason: reason
        }
      )
      .subscribe({
        next: response => {
          this.updateOrder(
            response.order
          );

          this.toastService.success(
            'Porudžbina je odbijena.'
          );

          this.actionOrderId.set(null);
          this.closeRejectForm();
        },
        error: error => {
          this.handleActionError(
            error
          );

          this.actionOrderId.set(null);
        }
      });
  }

  markAsReady(
    orderId: string
  ): void {
    if (this.actionOrderId()) {
      return;
    }

    this.actionOrderId.set(orderId);

    this.orderService
      .markOrderAsReady(orderId)
      .subscribe({
        next: response => {
          this.updateOrder(
            response.order
          );

          this.toastService.success(
            'Porudžbina je označena kao spremna.'
          );

          this.actionOrderId.set(null);
        },
        error: error => {
          this.handleActionError(
            error
          );

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

  buyerName(
    order: SellerOrder
  ): string {
    return `${order.buyer.firstName} ${order.buyer.lastName}`.trim();
  }

  formatDate(
    value: string
  ): string {
    return new Intl.DateTimeFormat(
      'sr-Latn-RS',
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
      .getReceivedOrders(status)
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

  private updateOrder(
    updatedOrder: SellerOrder
  ): void {
    this.orders.update(
      orders => {
        if (
          this.selectedStatus() !== 'all' &&
          this.selectedStatus() !==
            updatedOrder.status
        ) {
          return orders.filter(
            order => {
              return (
                order._id !==
                updatedOrder._id
              );
            }
          );
        }

        return orders.map(
          order => {
            return (
              order._id ===
              updatedOrder._id
            )
              ? updatedOrder
              : order;
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
      'Primljene porudžbine trenutno nisu dostupne.'
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
      'ORDER_CANNOT_BE_ACCEPTED'
    ) {
      this.toastService.error(
        'Samo porudžbina na čekanju može da se prihvati.'
      );

      return;
    }

    if (
      code ===
      'ORDER_CANNOT_BE_REJECTED'
    ) {
      this.toastService.error(
        'Samo porudžbina na čekanju može da se odbije.'
      );

      return;
    }

    if (
      code ===
      'ORDER_CANNOT_BE_MARKED_READY'
    ) {
      this.toastService.error(
        'Samo prihvaćena porudžbina može da bude označena kao spremna.'
      );

      return;
    }

    if (
      code ===
      'INSUFFICIENT_QUANTITY'
    ) {
      this.toastService.error(
        'Za ovu porudžbinu više nema dovoljno dostupne količine.'
      );

      return;
    }

    this.toastService.error(
      response?.error?.message ??
      'Akcija trenutno nije moguća.'
    );
  }
}