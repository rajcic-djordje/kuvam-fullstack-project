import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCircleCheckBig,
  LucideClock,
  LucideDynamicIcon,
  LucideKeyRound,
  LucideMapPin,
  LucideNavigation,
  LucidePackage,
  LucideStar,
  LucideStore,
  LucideX,
  LucidePhone
} from '@lucide/angular';
import { ApiErrorService } from '../../../../shared/services/api-error';
import { ToastService } from '../../../../shared/services/toast';
import { ReportReason } from '../../../reports/models/report';
import { ReportService } from '../../../reports/services/report';
import { ReviewService } from '../../../reviews/services/review';
import { OrderRouteMap } from '../../components/order-route-map';
import {
  BuyerOrder,
  OrderStatus
} from '../../models/order';
import { OrderService } from '../../services/order';

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
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly reportService = inject(ReportService);
  private readonly reviewService = inject(ReviewService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly toastService = inject(ToastService);

  readonly backIcon = LucideArrowLeft;
  readonly orderIcon = LucidePackage;
  readonly sellerIcon = LucideStore;
  readonly locationIcon = LucideMapPin;
  readonly pendingIcon = LucideClock;
  readonly completedIcon = LucideCircleCheckBig;
  readonly codeIcon = LucideKeyRound;
  readonly navigationIcon = LucideNavigation;
  readonly starIcon = LucideStar;
  readonly closeIcon = LucideX;
  readonly phoneIcon = LucidePhone;

  readonly order = signal<BuyerOrder | null>(null);
  readonly isLoading = signal(true);
  readonly loadError = signal('');
  readonly isMarkingOnTheWay = signal(false);

  readonly isReportModalOpen = signal(false);
  readonly reportReason = signal<ReportReason | ''>('');
  readonly reportDescription = signal('');
  readonly isSubmittingReport = signal(false);

  readonly isReviewModalOpen = signal(false);
  readonly reviewRating = signal(0);
  readonly reviewComment = signal('');
  readonly isSubmittingReview = signal(false);

  readonly ratingOptions = [1, 2, 3, 4, 5];

  readonly reportReasonOptions: {
    value: ReportReason;
    label: string;
  }[] = [
    {
      value: 'no_show',
      label: 'Prodavac se nije pojavio'
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

  markAsOnTheWay(): void {
    const currentOrder = this.order();

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
          this.order.set({
            ...currentOrder,
            buyerOnTheWayAt:
              response.order.buyerOnTheWayAt
          });

          this.isMarkingOnTheWay.set(false);

          this.toastService.success(
            'Prodavac je obavešten da si krenuo po porudžbinu.'
          );
        },

        error: error => {
            this.isMarkingOnTheWay.set(false);

            const code = this.apiErrorService.getCode(error);

            if (code === 'BUYER_CANNOT_BE_MARKED_ON_THE_WAY') {
              this.toastService.error(
                'Status porudžbine je u međuvremenu promenjen. Podaci su osveženi.'
              );

              this.loadOrder(currentOrder._id);
              return;
            }

            this.toastService.error(
              this.apiErrorService.getMessage(
                error,
                'Prodavca trenutno nije moguće obavestiti.'
              )
            );
          }
      });
  }

  openReviewModal(): void {
    const currentOrder = this.order();

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
    if (this.isSubmittingReview()) {
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
    const currentOrder = this.order();
    const rating = this.reviewRating();
    const comment = this.reviewComment().trim();

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
      ...(comment ? { comment } : {})
    };

    this.reviewService
      .createReview(request)
      .subscribe({
        next: () => {
          this.isSubmittingReview.set(false);
          this.isReviewModalOpen.set(false);
          this.reviewRating.set(0);
          this.reviewComment.set('');

          this.toastService.success(
            'Hvala! Tvoja ocena prodavca je uspešno poslata.'
          );
        },

        error: error => {
          this.isSubmittingReview.set(false);
          this.handleReviewError(error);
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
    const currentOrder = this.order();
    const reason = this.reportReason();
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
        orderId: currentOrder._id,
        reason,
        description
      })
      .subscribe({
        next: () => {
          this.isSubmittingReport.set(false);
          this.isReportModalOpen.set(false);
          this.reportReason.set('');
          this.reportDescription.set('');

          this.toastService.success(
            'Prijava prodavca je poslata administratoru.'
          );
        },

        error: error => {
          this.isSubmittingReport.set(false);
          this.handleReportError(error);
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
    ].includes(order.status);
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

          this.loadError.set(
            this.apiErrorService.getMessage(
              error,
              'Porudžbinu trenutno nije moguće učitati.'
            )
          );
        }
      });
  }

  private handleReviewError(
    error: unknown
  ): void {
    const code =
      this.apiErrorService.getCode(error);

    if (
      code === 'ORDER_ALREADY_REVIEWED' ||
      code === 'ORDER_CANNOT_BE_REVIEWED'
    ) {
      this.isReviewModalOpen.set(false);
      this.reviewRating.set(0);
      this.reviewComment.set('');
    }

    this.toastService.error(
      this.apiErrorService.getMessage(
        error,
        'Ocenu trenutno nije moguće poslati.'
      )
    );
  }

  private handleReportError(
    error: unknown
  ): void {
    const code =
      this.apiErrorService.getCode(error);

    if (
      code === 'ORDER_ALREADY_REPORTED' ||
      code === 'ORDER_CANNOT_BE_REPORTED'
    ) {
      this.isReportModalOpen.set(false);
      this.reportReason.set('');
      this.reportDescription.set('');
    }

    this.toastService.error(
      this.apiErrorService.getMessage(
        error,
        'Prijavu trenutno nije moguće poslati.'
      )
    );
  }
}