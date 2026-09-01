import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCalendarClock,
  LucideCircleCheckBig,
  LucideClock,
  LucideDynamicIcon,
  LucideFlag,
  LucideKeyRound,
  LucideMail,
  LucidePackage,
  LucidePackageCheck,
  LucideShoppingBag,
  LucideUser,
  LucideX,
  LucidePhone
} from '@lucide/angular';
import { ApiErrorService } from '../../../../shared/services/api-error';
import { ReportReason } from '../../../reports/models/report';
import { ReportService } from '../../../reports/services/report';
import {
  OrderStatus,
  SellerOrder
} from '../../models/order';
import { OrderService } from '../../services/order';
import { ToastService } from '../../../../shared/services/toast';
@Component({
  selector: 'app-seller-order-detail-page',
  imports: [
    FormsModule,
    LucideDynamicIcon,
    RouterLink
  ],
  templateUrl: './seller-order-detail-page.html',
  styleUrl: './seller-order-detail-page.css'
})
export class SellerOrderDetailPage implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly reportService = inject(ReportService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly toastService = inject(ToastService);
  readonly backIcon = LucideArrowLeft;
  readonly orderIcon = LucidePackage;
  readonly buyerIcon = LucideUser;
  readonly emailIcon = LucideMail;
  readonly pendingIcon = LucideClock;
  readonly acceptIcon = LucideCircleCheckBig;
  readonly rejectIcon = LucideX;
  readonly readyIcon = LucidePackageCheck;
  readonly shoppingIcon = LucideShoppingBag;
  readonly codeIcon = LucideKeyRound;
  readonly closeIcon = LucideX;
  readonly pickupTimeIcon = LucideCalendarClock;
  readonly reportIcon = LucideFlag;
  readonly phoneIcon = LucidePhone;

  readonly order = signal<SellerOrder | null>(null);
  readonly isLoading = signal(true);
  readonly loadError = signal('');
  readonly actionError = signal('');
  readonly actionSuccess = signal('');
  readonly isPerformingAction = signal(false);

  readonly isAcceptFormOpen = signal(false);
  readonly estimatedPickupAt = signal('');

  readonly isRejectFormOpen = signal(false);
  readonly rejectionReason = signal('');
  readonly pickupCode = signal('');

  readonly isReportModalOpen = signal(false);
  readonly reportReason = signal<ReportReason | ''>('');
  readonly reportDescription = signal('');
  readonly isSubmittingReport = signal(false);

  readonly reportReasonOptions: {
    value: ReportReason;
    label: string;
  }[] = [
    {
      value: 'no_show',
      label: 'Kupac se nije pojavio'
    },
    {
      value: 'inappropriate_behavior',
      label: 'Neprimereno ponašanje'
    },
    {
      value: 'misleading_information',
      label: 'Netačne ili obmanjujuće informacije'
    },
    {
      value: 'payment_issue',
      label: 'Problem sa plaćanjem'
    },
    {
      value: 'other',
      label: 'Drugo'
    }
  ];

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const orderId = paramMap.get('orderId');

      if (!orderId) {
        this.loadError.set(
          'Porudžbina nije pronađena.'
        );

        this.isLoading.set(false);

        return;
      }

      this.loadOrder(orderId);
    });
  }

  retry(): void {
    const orderId =
      this.activatedRoute.snapshot.paramMap.get(
        'orderId'
      );

    if (!orderId) {
      return;
    }

    this.loadOrder(orderId);
  }

  openAcceptForm(): void {
    this.resetActionMessages();
    this.closeRejectForm();
    this.estimatedPickupAt.set('');
    this.isAcceptFormOpen.set(true);
  }

  closeAcceptForm(): void {
    if (this.isPerformingAction()) {
      return;
    }

    this.isAcceptFormOpen.set(false);
    this.estimatedPickupAt.set('');
  }

  updateEstimatedPickupAt(value: string): void {
    this.estimatedPickupAt.set(value);
  }

  acceptOrder(): void {
    const currentOrder = this.order();
    const estimatedPickupAt = this.estimatedPickupAt();

    if (
      !currentOrder ||
      currentOrder.status !== 'pending' ||
      this.isPerformingAction()
    ) {
      return;
    }

    if (!estimatedPickupAt) {
      this.actionError.set(
        'Izaberi procenjeno vreme preuzimanja.'
      );

      return;
    }

    const pickupDate = new Date(estimatedPickupAt);

    if (
      Number.isNaN(pickupDate.getTime()) ||
      pickupDate <= new Date()
    ) {
      this.actionError.set(
        'Procenjeno vreme preuzimanja mora biti u budućnosti.'
      );

      return;
    }

    this.resetActionMessages();
    this.isPerformingAction.set(true);

    this.orderService.acceptOrder(currentOrder._id, {
      estimatedPickupAt: pickupDate.toISOString()
    }).subscribe({
      next: response => {
        this.order.set(response.order);
        this.isAcceptFormOpen.set(false);
        this.estimatedPickupAt.set('');
        this.actionSuccess.set('Porudžbina je prihvaćena.');
        this.isPerformingAction.set(false);
      },
      error: error => {
        this.actionError.set(
          this.apiErrorService.getMessage(
            error,
            'Akcija trenutno nije moguća.'
          )
        );

        this.isPerformingAction.set(false);
      }
    });
  }

  openRejectForm(): void {
    this.resetActionMessages();
    this.closeAcceptForm();
    this.rejectionReason.set('');
    this.isRejectFormOpen.set(true);
  }

  closeRejectForm(): void {
    if (this.isPerformingAction()) {
      return;
    }

    this.isRejectFormOpen.set(false);
    this.rejectionReason.set('');
  }

  updateRejectionReason(value: string): void {
    this.rejectionReason.set(value);
  }

  rejectOrder(): void {
    const currentOrder = this.order();
    const reason = this.rejectionReason().trim();

    if (
      !currentOrder ||
      currentOrder.status !== 'pending' ||
      this.isPerformingAction()
    ) {
      return;
    }

    if (!reason) {
      this.actionError.set(
        'Unesi razlog odbijanja porudžbine.'
      );

      return;
    }

    this.resetActionMessages();
    this.isPerformingAction.set(true);

    this.orderService.rejectOrder(currentOrder._id, {
      rejectionReason: reason
    }).subscribe({
      next: response => {
        this.order.set(response.order);
        this.actionSuccess.set('Porudžbina je odbijena.');
        this.isPerformingAction.set(false);
        this.closeRejectForm();
      },
      error: error => {
        this.actionError.set(
          this.apiErrorService.getMessage(
            error,
            'Akcija trenutno nije moguća.'
          )
        );

        this.isPerformingAction.set(false);
      }
    });
  }

  markAsReady(): void {
    const currentOrder = this.order();

    if (
      !currentOrder ||
      currentOrder.status !== 'accepted' ||
      this.isPerformingAction()
    ) {
      return;
    }

    this.resetActionMessages();
    this.isPerformingAction.set(true);

    this.orderService.markOrderAsReady(currentOrder._id).subscribe({
      next: response => {
        this.order.set(response.order);
        this.actionSuccess.set(
          'Porudžbina je označena kao spremna za preuzimanje.'
        );
        this.isPerformingAction.set(false);
      },
      error: error => {
        this.actionError.set(
          this.apiErrorService.getMessage(
            error,
            'Akcija trenutno nije moguća.'
          )
        );

        this.isPerformingAction.set(false);
      }
    });
  }

  updatePickupCode(value: string): void {
    this.pickupCode.set(
      value.replace(/\D/g, '').slice(0, 6)
    );
  }

  completeOrder(): void {
    const currentOrder = this.order();
    const code = this.pickupCode().trim();

    if (
      !currentOrder ||
      currentOrder.status !== 'ready' ||
      this.isPerformingAction()
    ) {
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      this.actionError.set(
        'Unesi šestocifreni kod koji ti je dao kupac.'
      );

      return;
    }

    this.resetActionMessages();
    this.isPerformingAction.set(true);

    this.orderService.completeOrder(currentOrder._id, {
      pickupCode: code
    }).subscribe({
      next: response => {
        this.order.set(response.order);
        this.pickupCode.set('');
        this.actionSuccess.set(
          'Porudžbina je uspešno završena.'
        );
        this.isPerformingAction.set(false);
      },
      error: error => {
          const message = this.apiErrorService.getMessage(
            error,
            'Akcija trenutno nije moguća.'
          );

          this.actionError.set(message);
          this.toastService.error(message);

          this.isPerformingAction.set(false);
        }
    });
  }

  openReportModal(): void {
    const currentOrder = this.order();

    if (
      !currentOrder ||
      currentOrder.status !== 'completed'
    ) {
      return;
    }

    this.resetActionMessages();
    this.reportReason.set('');
    this.reportDescription.set('');
    this.isReportModalOpen.set(true);
  }

  closeReportModal(): void {
    if (this.isSubmittingReport()) {
      return;
    }

    this.isReportModalOpen.set(false);
    this.reportReason.set('');
    this.reportDescription.set('');
  }

  updateReportReason(value: string): void {
    this.reportReason.set(value as ReportReason);
  }

  updateReportDescription(value: string): void {
    this.reportDescription.set(value);
  }

  submitReport(): void {
    const currentOrder = this.order();
    const reason = this.reportReason();
    const description = this.reportDescription().trim();

    if (
      !currentOrder ||
      currentOrder.status !== 'completed' ||
      !reason ||
      description.length < 10 ||
      this.isSubmittingReport()
    ) {
      return;
    }

    this.resetActionMessages();
    this.isSubmittingReport.set(true);

    this.reportService.createReport({
      orderId: currentOrder._id,
      reason,
      description
    }).subscribe({
      next: () => {
        this.isSubmittingReport.set(false);
        this.isReportModalOpen.set(false);
        this.reportReason.set('');
        this.reportDescription.set('');
        this.toastService.success(
          'Prijava kupca je uspešno poslata administratoru.'
        );
      },
      error: error => {
        this.isSubmittingReport.set(false);
        this.handleReportError(error);
      }
    });
  }

  statusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      pending: 'Na čekanju',
      accepted: 'Prihvaćena',
      rejected: 'Odbijena',
      ready: 'Spremna za preuzimanje',
      completed: 'Završena',
      cancelled: 'Otkazana'
    };

    return labels[status];
  }

  buyerName(order: SellerOrder): string {
    return `${order.buyer.firstName} ${order.buyer.lastName}`.trim();
  }

  minimumPickupDateTime(): string {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60_000;

    return new Date(now.getTime() - timezoneOffset)
      .toISOString()
      .slice(0, 16);
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('sr-Latn-RS', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  }

  private loadOrder(orderId: string): void {
    this.isLoading.set(true);
    this.loadError.set('');
    this.resetActionMessages();

    this.orderService.getReceivedOrderById(orderId).subscribe({
      next: response => {
        this.order.set(response.order);
        this.isLoading.set(false);
      },
      error: error => {
        this.order.set(null);
        this.isLoading.set(false);

        this.loadError.set(
          this.apiErrorService.getMessage(
            error,
            'Porudžbinu trenutno nije moguće učitati.'
          )
        );
      }
    });
  }

  private resetActionMessages(): void {
    this.actionError.set('');
    this.actionSuccess.set('');
  }

  private handleReportError(error: unknown): void {
    const code = this.apiErrorService.getCode(error);

    if (
      code === 'ORDER_ALREADY_REPORTED' ||
      code === 'ORDER_CANNOT_BE_REPORTED'
    ) {
      this.isReportModalOpen.set(false);
      this.reportReason.set('');
      this.reportDescription.set('');
    }

    this.actionError.set(
      this.apiErrorService.getMessage(
        error,
        'Prijavu trenutno nije moguće poslati.'
      )
    );
  }
}