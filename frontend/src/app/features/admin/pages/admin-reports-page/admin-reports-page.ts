import { DatePipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import {
  LucideArrowRight,
  LucideCalendarDays,
  LucideCircleCheck,
  LucideCircleX,
  LucideClock3,
  LucideDynamicIcon,
  LucideEye,
  LucideFileWarning,
  LucideScanSearch,
  LucideStore,
  LucideUserRound,
  LucideX,
  type LucideIcon
} from '@lucide/angular';
import {
  AdminReport,
  AdminReportReason,
  AdminReportStatus,
  AdminReportsSort,
  AdminReportsStatusFilter,
  AdminReportUserRole
} from '../../models/admin-report';
import { AdminReportService } from '../../services/admin-report';

@Component({
  selector: 'app-admin-reports-page',
  imports: [
    DatePipe,
    LucideDynamicIcon
  ],
  templateUrl: './admin-reports-page.html',
  styleUrl: './admin-reports-page.css'
})
export class AdminReportsPage implements OnInit, OnDestroy {
  private readonly adminReportService =
    inject(AdminReportService);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  readonly reports = signal<AdminReport[]>([]);
  readonly selectedReport = signal<AdminReport | null>(null);

  readonly isLoading = signal(true);
  readonly isProcessing = signal(false);

  readonly errorMessage = signal('');
  readonly actionErrorMessage = signal('');
  readonly successMessage = signal('');

  readonly searchTerm = signal('');
  readonly selectedStatus =
    signal<AdminReportsStatusFilter>('all');
  readonly selectedSort =
    signal<AdminReportsSort>('newest');
  readonly adminNote = signal('');

  readonly reportsIcon: LucideIcon =
    LucideFileWarning;

  readonly searchIcon: LucideIcon =
    LucideScanSearch;

  readonly arrowIcon: LucideIcon =
    LucideArrowRight;

  readonly calendarIcon: LucideIcon =
    LucideCalendarDays;

  readonly viewIcon: LucideIcon =
    LucideEye;

  readonly closeIcon: LucideIcon =
    LucideX;

  readonly pendingIcon: LucideIcon =
    LucideClock3;

  readonly approvedIcon: LucideIcon =
    LucideCircleCheck;

  readonly rejectedIcon: LucideIcon =
    LucideCircleX;

  readonly buyerIcon: LucideIcon =
    LucideUserRound;

  readonly sellerIcon: LucideIcon =
    LucideStore;

  ngOnInit(): void {
    this.loadReports();
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.loadReports();
    }, 350);
  }

  onStatusChange(value: string): void {
    const status: AdminReportsStatusFilter =
      value === 'pending' ||
      value === 'approved' ||
      value === 'rejected'
        ? value
        : 'all';

    this.selectedStatus.set(status);
    this.loadReports();
  }

  onSortChange(value: string): void {
    const sort: AdminReportsSort =
      value === 'oldest'
        ? 'oldest'
        : 'newest';

    this.selectedSort.set(sort);
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.adminReportService.getReports(
      this.searchTerm(),
      this.selectedStatus(),
      this.selectedSort()
    ).subscribe({
      next: response => {
        this.reports.set(response.reports ?? []);
        this.isLoading.set(false);
      },
      error: error => {
        this.reports.set([]);

        this.errorMessage.set(
          error.error?.error?.message ??
          error.error?.message ??
          'Došlo je do greške pri učitavanju prijava.'
        );

        this.isLoading.set(false);
      }
    });
  }

  openReport(report: AdminReport): void {
    this.selectedReport.set(report);
    this.adminNote.set(report.adminNote ?? '');
    this.actionErrorMessage.set('');
    this.successMessage.set('');
  }

  closeReport(): void {
    if (this.isProcessing()) {
      return;
    }

    this.selectedReport.set(null);
    this.adminNote.set('');
    this.actionErrorMessage.set('');
  }

  onAdminNoteChange(value: string): void {
    this.adminNote.set(value);
    this.actionErrorMessage.set('');
  }

  approveSelectedReport(): void {
    const report = this.selectedReport();

    if (!report || report.status !== 'pending') {
      return;
    }

    this.isProcessing.set(true);
    this.actionErrorMessage.set('');

    this.adminReportService.approveReport(
      report._id,
      this.adminNote()
    ).subscribe({
      next: response => {
        const wasBanned =
          response.reportedUser?.status === 'banned';

        this.successMessage.set(
          wasBanned
            ? 'Prijava je odobrena, a korisnik je automatski banovan.'
            : 'Prijava je uspešno odobrena.'
        );

        this.isProcessing.set(false);
        this.selectedReport.set(null);
        this.adminNote.set('');
        this.loadReports();
      },
      error: error => {
        this.handleActionError(error);
      }
    });
  }

  rejectSelectedReport(): void {
    const report = this.selectedReport();
    const note = this.adminNote().trim();

    if (!report || report.status !== 'pending') {
      return;
    }

    if (note.length < 2) {
      this.actionErrorMessage.set(
        'Unesi razlog odbijanja prijave.'
      );
      return;
    }

    this.isProcessing.set(true);
    this.actionErrorMessage.set('');

    this.adminReportService.rejectReport(
      report._id,
      note
    ).subscribe({
      next: () => {
        this.successMessage.set(
          'Prijava je uspešno odbijena.'
        );

        this.isProcessing.set(false);
        this.selectedReport.set(null);
        this.adminNote.set('');
        this.loadReports();
      },
      error: error => {
        this.handleActionError(error);
      }
    });
  }

  getFullName(
  user: {
    firstName: string;
    lastName: string;
  }
): string {
  return `${user.firstName} ${user.lastName}`;
}

  getInitials(
    user: AdminReport['reporter']
  ): string {
    return (
      user.firstName.charAt(0) +
      user.lastName.charAt(0)
    ).toUpperCase();
  }

  getRoleLabel(role: AdminReportUserRole): string {
    return role === 'seller'
      ? 'Prodavac'
      : 'Kupac';
  }

  getRoleIcon(role: AdminReportUserRole): LucideIcon {
    return role === 'seller'
      ? this.sellerIcon
      : this.buyerIcon;
  }

  getReasonLabel(reason: AdminReportReason): string {
    const labels: Record<AdminReportReason, string> = {
      no_show: 'Nedolazak',
      inappropriate_behavior: 'Neprimereno ponašanje',
      misleading_information: 'Obmanjujuće informacije',
      food_quality_or_safety: 'Kvalitet ili bezbednost hrane',
      payment_issue: 'Problem sa plaćanjem',
      other: 'Drugi razlog'
    };

    return labels[reason];
  }

  getStatusLabel(status: AdminReportStatus): string {
    const labels: Record<AdminReportStatus, string> = {
      pending: 'Na čekanju',
      approved: 'Odobrena',
      rejected: 'Odbijena'
    };

    return labels[status];
  }

  getStatusIcon(status: AdminReportStatus): LucideIcon {
    if (status === 'approved') {
      return this.approvedIcon;
    }

    if (status === 'rejected') {
      return this.rejectedIcon;
    }

    return this.pendingIcon;
  }

  private handleActionError(error: any): void {
    const code = error.error?.error?.code;

    if (code === 'REPORT_ALREADY_REVIEWED') {
      this.actionErrorMessage.set(
        'Ovu prijavu je u međuvremenu već obradio drugi administrator.'
      );
    } else {
      this.actionErrorMessage.set(
        error.error?.error?.message ??
        error.error?.message ??
        'Došlo je do greške pri obradi prijave.'
      );
    }

    this.isProcessing.set(false);
  }
}