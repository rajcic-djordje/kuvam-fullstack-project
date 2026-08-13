import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';
import {
  LucideArrowLeft,
  LucideClock,
  LucideDynamicIcon,
  LucideFlag,
  LucideKeyRound,
  LucideMapPin,
  LucideNavigation,
  LucidePackage,
  LucideStar,
  LucideStore,
  LucideX
} from '@lucide/angular';
import { OrderRouteMap } from '../../components/order-route-map';
import { ToastService } from '../../../../shared/services/toast';
import {
  BuyerOrder,
  OrderStatus
} from '../../models/order';
import { OrderService } from '../../services/order';
import { ReportReason } from '../../../reports/models/report';
import { ReportService } from '../../../reports/services/report';
import { ReviewService } from '../../../reviews/services/review';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

@Component({
  selector: 'app-order-detail-page',
  imports: [
    FormsModule,
    LucideDynamicIcon,
    RouterLink,
    OrderRouteMap
  ],
  templateUrl: './order-detail-page.html',
  styleUrl: './order-detail-page.css'
})
export class OrderDetailPage implements OnInit {
  private readonly activatedRoute =
    inject(ActivatedRoute);

  private readonly orderService =
    inject(OrderService);

  private readonly reportService =
    inject(ReportService);

  private readonly reviewService =
    inject(ReviewService);

  private readonly toastService =
    inject(ToastService);

  readonly backIcon =
    LucideArrowLeft;

  readonly orderIcon =
    LucidePackage;

  readonly sellerIcon =
    LucideStore;

  readonly locationIcon =
    LucideMapPin;

  readonly pendingIcon =
    LucideClock;

  readonly codeIcon =
    LucideKeyRound;

  readonly navigationIcon =
    LucideNavigation;

  readonly starIcon =
    LucideStar;

  readonly reportIcon =
    LucideFlag;

  readonly closeIcon =
    LucideX;

  readonly order =
    signal<BuyerOrder | null>(null);

  readonly isLoading =
    signal(true);

  readonly loadError =
    signal('');

  readonly isMarkingOnTheWay =
    signal(false);

  readonly isReportModalOpen =
    signal(false);

  readonly reportReason =
    signal<ReportReason | ''>('');

  readonly reportDescription =
    signal('');

  readonly isSubmittingReport =
    signal(false);

  readonly isReviewModalOpen =
    signal(false);

  readonly reviewRating =
    signal(0);

  readonly reviewComment =
    signal('');

  readonly isSubmittingReview =
    signal(false);

  readonly ratingOptions = [
    1,
    2,
    3,
    4,
    5
  ];

  readonly reportReasonOptions: {
    value: ReportReason;
    label: string;
  }[] = [
    {
      value: 'no_show',
      label: 'Domaćin se nije pojavio'
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
      value: 'food_quality_or_safety',
      label: 'Problem sa kvalitetom ili bezbednošću hrane'
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
    const orderId =
      this.activatedRoute.snapshot.paramMap.get(
        'orderId'
      );

    if (!orderId) {
      this.loadError.set(
        'Porudžbina nije pronađena.'
      );

      this.isLoading.set(false);
      return;
    }

    this.loadOrder(orderId);
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

  markAsOnTheWay(): void {
    const currentOrder =
      this.order();

    if (
      !currentOrder ||
      currentOrder.status !== 'ready' ||
      currentOrder.buyerOnTheWayAt ||
      this.isMarkingOnTheWay()
    ) {
      return;
    }

    this.isMarkingOnTheWay.set(true);

    this.orderService
      .markMyOrderAsOnTheWay(
        currentOrder._id
      )
      .subscribe({
        next: response => {
          this.order.set(
            response.order
          );

          this.toastService.success(
            'Domaćin je obavešten da si krenuo po porudžbinu.'
          );

          this.isMarkingOnTheWay.set(
            false
          );
        },
        error: error => {
          this.isMarkingOnTheWay.set(
            false
          );

          this.handleActionError(
            error
          );
        }
      });
  }

  openReviewModal(): void {
    const currentOrder =
      this.order();

    if (
      !currentOrder ||
      currentOrder.status !== 'completed'
    ) {
      return;
    }

    this.reviewRating.set(0);
    this.reviewComment.set('');
    this.isReviewModalOpen.set(true);
  }

  closeReviewModal(): void {
    if (
      this.isSubmittingReview()
    ) {
      return;
    }

    this.isReviewModalOpen.set(false);
    this.reviewRating.set(0);
    this.reviewComment.set('');
  }

  selectRating(
    rating: number
  ): void {
    this.reviewRating.set(rating);
  }

  updateReviewComment(
    value: string
  ): void {
    this.reviewComment.set(value);
  }

  submitReview(): void {
    const currentOrder =
      this.order();

    const rating =
      this.reviewRating();

    const comment =
      this.reviewComment().trim();

    if (
      !currentOrder ||
      currentOrder.status !== 'completed' ||
      rating < 1 ||
      rating > 5 ||
      this.isSubmittingReview()
    ) {
      return;
    }

    this.isSubmittingReview.set(true);

    const request = {
      orderId: currentOrder._id,
      rating,
      ...(comment
        ? { comment }
        : {})
    };

    this.reviewService
      .createReview(request)
      .subscribe({
        next: () => {
          this.isSubmittingReview.set(
            false
          );

          this.isReviewModalOpen.set(
            false
          );

          this.reviewRating.set(0);
          this.reviewComment.set('');

          this.toastService.success(
            'Hvala! Tvoja ocena domaćina je uspešno poslata.'
          );
        },
        error: error => {
          this.isSubmittingReview.set(
            false
          );

          this.handleReviewError(
            error
          );
        }
      });
  }

  openReportModal(): void {
    const currentOrder =
      this.order();

    if (
      !currentOrder ||
      currentOrder.status !== 'completed'
    ) {
      return;
    }

    this.reportReason.set('');
    this.reportDescription.set('');
    this.isReportModalOpen.set(true);
  }

  closeReportModal(): void {
    if (
      this.isSubmittingReport()
    ) {
      return;
    }

    this.isReportModalOpen.set(false);
    this.reportReason.set('');
    this.reportDescription.set('');
  }

  updateReportReason(
    value: string
  ): void {
    this.reportReason.set(
      value as ReportReason
    );
  }

  updateReportDescription(
    value: string
  ): void {
    this.reportDescription.set(value);
  }

  submitReport(): void {
    const currentOrder =
      this.order();

    const reason =
      this.reportReason();

    const description =
      this.reportDescription().trim();

    if (
      !currentOrder ||
      currentOrder.status !== 'completed' ||
      !reason ||
      description.length < 10 ||
      this.isSubmittingReport()
    ) {
      return;
    }

    this.isSubmittingReport.set(true);

    this.reportService
      .createReport({
        orderId:
          currentOrder._id,
        reason,
        description
      })
      .subscribe({
        next: () => {
          this.isSubmittingReport.set(
            false
          );

          this.isReportModalOpen.set(
            false
          );

          this.reportReason.set('');
          this.reportDescription.set('');

          this.toastService.success(
            'Prijava domaćina je poslata administratoru.'
          );
        },
        error: error => {
          this.isSubmittingReport.set(
            false
          );

          this.handleReportError(
            error
          );
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
      'sr-Latn-RS',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      new Date(value)
    );
  }

  canShowPickupAddress(
    order: BuyerOrder
  ): boolean {
    return [
      'accepted',
      'ready',
      'completed'
    ].includes(
      order.status
    );
  }

  private loadOrder(
    orderId: string
  ): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.orderService
      .getMyOrderById(orderId)
      .subscribe({
        next: response => {
          this.order.set(
            response.order
          );

          this.isLoading.set(false);
        },
        error: error => {
          this.order.set(null);
          this.isLoading.set(false);

          this.handleLoadError(
            error
          );
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
      'ORDER_NOT_FOUND'
    ) {
      this.loadError.set(
        'Porudžbina nije pronađena ili nemaš pristup njenim podacima.'
      );

      return;
    }

    this.loadError.set(
      response?.error?.message ??
      'Porudžbinu trenutno nije moguće učitati.'
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
      'BUYER_ALREADY_ON_THE_WAY'
    ) {
      this.toastService.error(
        'Domaćin je već obavešten da si krenuo.'
      );

      return;
    }

    if (
      code ===
      'BUYER_CANNOT_BE_MARKED_ON_THE_WAY'
    ) {
      this.toastService.error(
        'Domaćina možeš obavestiti tek kada je porudžbina spremna.'
      );

      return;
    }

    this.toastService.error(
      response?.error?.message ??
      'Domaćina trenutno nije moguće obavestiti.'
    );
  }

  private handleReviewError(
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
      'ORDER_ALREADY_REVIEWED'
    ) {
      this.isReviewModalOpen.set(false);
      this.reviewRating.set(0);
      this.reviewComment.set('');

      this.toastService.error(
        'Već si ocenio domaćina za ovu porudžbinu.'
      );

      return;
    }

    if (
      code ===
      'ORDER_CANNOT_BE_REVIEWED'
    ) {
      this.isReviewModalOpen.set(false);
      this.reviewRating.set(0);
      this.reviewComment.set('');

      this.toastService.error(
        'Samo završena porudžbina može da bude ocenjena.'
      );

      return;
    }

    this.toastService.error(
      response?.error?.message ??
      'Ocenu trenutno nije moguće poslati.'
    );
  }

  private handleReportError(
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
      'ORDER_ALREADY_REPORTED'
    ) {
      this.isReportModalOpen.set(false);
      this.reportReason.set('');
      this.reportDescription.set('');

      this.toastService.error(
        'Već si poslao prijavu za ovu porudžbinu.'
      );

      return;
    }

    if (
      code ===
      'ORDER_CANNOT_BE_REPORTED'
    ) {
      this.isReportModalOpen.set(false);
      this.reportReason.set('');
      this.reportDescription.set('');

      this.toastService.error(
        'Samo završena porudžbina može da bude prijavljena.'
      );

      return;
    }

    this.toastService.error(
      response?.error?.message ??
      'Prijavu trenutno nije moguće poslati.'
    );
  }
}