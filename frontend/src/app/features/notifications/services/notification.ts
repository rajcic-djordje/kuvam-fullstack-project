import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {API_BASE_URL} from '../../../core/constants/api.constants';
import {
  Notification,
  NotificationActionResponse,
  NotificationsResponse,
  ReadAllNotificationsResponse,
  UnreadNotificationsCountResponse
} from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly notificationsUrl = `${API_BASE_URL}/notifications`;

  private readonly notificationsSignal = signal<Notification[]>([]);
  private readonly unreadCountSignal = signal(0);
  private readonly isLoadingSignal = signal(false);

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly unreadCount = this.unreadCountSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();

  loadNotifications(): void {
    if(this.isLoadingSignal())
      return

    this.isLoadingSignal.set(true)

    this.http
      .get<NotificationsResponse>(this.notificationsUrl)
      .subscribe({
        next: response => {
          this.notificationsSignal.set(
            this.removeDuplicates(response.notifications)
          )

          this.recalculateUnreadCount()
          this.isLoadingSignal.set(false)
        },
        error: () => {
          this.isLoadingSignal.set(false)
        }
      })
  }

  loadUnreadCount(): void {
    this.http
      .get<UnreadNotificationsCountResponse>(
        `${this.notificationsUrl}/unread-count`
      )
      .subscribe({
        next: response => {
          this.unreadCountSignal.set(response.unreadCount)
        }
      })
  }

  receiveNotification(notification: Notification): void {
    this.notificationsSignal.update(notifications => {
      const exists = notifications.some(
        currentNotification =>
          currentNotification._id === notification._id
      )

      if(exists) {
        return notifications.map(currentNotification =>
          currentNotification._id === notification._id
            ? notification
            : currentNotification
        )
      }

      return [
        notification,
        ...notifications
      ].slice(0, 100)
    })

    this.recalculateUnreadCount()
  }

  markAsRead(
    notificationId: string
  ): Observable<NotificationActionResponse> {
    return this.http
      .patch<NotificationActionResponse>(
        `${this.notificationsUrl}/${notificationId}/read`,
        {}
      )
      .pipe(
        tap(response => {
          this.notificationsSignal.update(notifications =>
            notifications.map(notification =>
              notification._id === notificationId
                ? response.notification
                : notification
            )
          )

          this.recalculateUnreadCount()
        })
      )
  }

  markAllAsRead(): Observable<ReadAllNotificationsResponse> {
    return this.http
      .patch<ReadAllNotificationsResponse>(
        `${this.notificationsUrl}/read-all`,
        {}
      )
      .pipe(
        tap(() => {
          this.notificationsSignal.update(notifications =>
            notifications.map(notification => ({
              ...notification,
              isRead: true
            }))
          )

          this.unreadCountSignal.set(0)
        })
      )
  }

  clear(): void {
    this.notificationsSignal.set([])
    this.unreadCountSignal.set(0)
    this.isLoadingSignal.set(false)
  }

  private recalculateUnreadCount(): void {
    this.unreadCountSignal.set(
      this.notificationsSignal().filter(
        notification => !notification.isRead
      ).length
    )
  }

  private removeDuplicates(
    notifications: Notification[]
  ): Notification[] {
    const uniqueNotifications = new Map<string, Notification>()

    for(const notification of notifications)
      uniqueNotifications.set(
        notification._id,
        notification
      )

    return Array.from(uniqueNotifications.values())
  }
}