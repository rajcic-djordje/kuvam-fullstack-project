import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideBadgeCheck,
  LucideClipboardCheck,
  LucideClipboardList,
  LucideDynamicIcon,
  LucideFlag,
  LucidePackagePlus,
  LucideShieldAlert,
  LucideShoppingCart,
  LucideStore,
  LucideUserPlus,
  LucideUserRoundX,
  LucideUsersRound,
  type LucideIcon
} from '@lucide/angular';
import {
  AdminActivityType,
  AdminDashboard
} from '../../models/admin-dashboard';
import { AdminDashboardService } from '../../services/admin-dashboard';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [
    DatePipe,
    RouterLink,
    LucideDynamicIcon
  ],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css'
})
export class AdminDashboardPage implements OnInit {
  private readonly adminDashboardService = inject(AdminDashboardService);

  readonly dashboard = signal<AdminDashboard | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly usersIcon: LucideIcon = LucideUsersRound;
  readonly bannedIcon: LucideIcon = LucideUserRoundX;
  readonly sellersIcon: LucideIcon = LucideStore;
  readonly reportsIcon: LucideIcon = LucideShieldAlert;
  readonly reportsPanelIcon: LucideIcon = LucideFlag;
  readonly sellersPanelIcon: LucideIcon = LucideClipboardList;
  readonly activityPanelIcon: LucideIcon = LucideClipboardCheck;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.adminDashboardService.getDashboard().subscribe({
      next: response => {
        this.dashboard.set(response.dashboard);
        this.isLoading.set(false);
      },
      error: error => {
        this.errorMessage.set(
          error.error?.error?.message ??
          'Došlo je do greške pri učitavanju dashboarda.'
        );

        this.isLoading.set(false);
      }
    });
  }

  getReportReasonLabel(reason: string): string {
    const labels: Record<string, string> = {
      no_show: 'Nedolazak',
      inappropriate_behavior: 'Neprimereno ponašanje',
      misleading_information: 'Obmanjujuće informacije',
      food_quality_or_safety: 'Kvalitet ili bezbednost hrane',
      payment_issue: 'Problem sa plaćanjem',
      other: 'Drugi razlog'
    };

    return labels[reason] ?? 'Nepoznat razlog';
  }

  getActivityIcon(type: AdminActivityType): LucideIcon {
    const icons: Record<AdminActivityType, LucideIcon> = {
      user_registered: LucideUserPlus,
      offer_created: LucidePackagePlus,
      order_created: LucideShoppingCart,
      seller_approved: LucideBadgeCheck,
      report_reviewed: LucideClipboardCheck
    };

    return icons[type];
  }

  getActivityClass(type: AdminActivityType): string {
    const classes: Record<AdminActivityType, string> = {
      user_registered: 'user-activity',
      offer_created: 'offer-activity',
      order_created: 'order-activity',
      seller_approved: 'seller-activity',
      report_reviewed: 'report-activity'
    };

    return classes[type];
  }
}