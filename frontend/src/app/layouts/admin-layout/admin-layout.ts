import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import {
  LucideBan,
  LucideCirclePause,
  LucideDynamicIcon,
  LucideFlag,
  LucideLayoutDashboard,
  LucideStore,
  LucideUsers
} from '@lucide/angular';
import { AdminNavbar } from '../../shared/components/admin-navbar/admin-navbar';

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideDynamicIcon,
    AdminNavbar
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  readonly dashboardIcon = LucideLayoutDashboard;
  readonly usersIcon = LucideUsers;
  readonly bannedIcon = LucideBan;
  readonly sellersIcon = LucideStore;
  readonly suspensionsIcon = LucideCirclePause;
  readonly reportsIcon = LucideFlag;
}