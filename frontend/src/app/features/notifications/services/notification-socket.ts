import {inject, Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {SOCKET_URL} from '../../../core/constants/api.constants';
import {AuthService} from '../../auth/services/auth';
import {Notification} from '../models/notification';
import {NotificationService} from './notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  private socket: Socket | null = null;

  connect(): void {
    const accessToken = this.authService.getAccessToken();

    if(!accessToken || this.socket?.connected)
      return

    if(this.socket) {
      this.socket.auth = {
        token: accessToken
      }

      this.socket.connect()
      return
    }

    this.socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: [
        'websocket',
        'polling'
      ],
      withCredentials: true,
      auth: {
        token: accessToken
      }
    })

    this.socket.on(
      'notification:new',
      (notification: Notification) => {
        this.notificationService.receiveNotification(
          notification
        )
      }
    )

    this.socket.io.on('reconnect_attempt', () => {
      const currentAccessToken =
        this.authService.getAccessToken()

      this.socket!.auth = {
        token: currentAccessToken
      }
    })

    this.socket.on('connect_error', error => {
      console.error(
        'Notification socket connection failed:',
        error.message
      )
    })

    this.socket.connect()
  }

  disconnect(): void {
    if(!this.socket)
      return

    this.socket.removeAllListeners()
    this.socket.io.removeAllListeners()
    this.socket.disconnect()
    this.socket = null
  }
}