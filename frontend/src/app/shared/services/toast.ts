import { Injectable, signal } from '@angular/core';

export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly duration = 4500;

  private nextId = 1;

  private readonly timers =
    new Map<number, ReturnType<typeof setTimeout>>();

  readonly toasts = signal<Toast[]>([]);

  success(
    message: string,
    title = 'Uspešno'
  ): void {
    this.show(
      'success',
      title,
      message
    );
  }

  error(
    message: string,
    title = 'Greška'
  ): void {
    this.show(
      'error',
      title,
      message
    );
  }

  warning(
    message: string,
    title = 'Upozorenje'
  ): void {
    this.show(
      'warning',
      title,
      message
    );
  }

  info(
    message: string,
    title = 'Informacija'
  ): void {
    this.show(
      'info',
      title,
      message
    );
  }

  dismiss(id: number): void {
    const timer =
      this.timers.get(id);

    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.toasts.update(toasts =>
      toasts.filter(
        toast => toast.id !== id
      )
    );
  }

  private show(
    type: ToastType,
    title: string,
    message: string
  ): void {
    const id = this.nextId++;

    const toast: Toast = {
      id,
      type,
      title,
      message
    };

    this.toasts.update(toasts => [
      ...toasts,
      toast
    ]);

    const timer = setTimeout(() => {
      this.dismiss(id);
    }, this.duration);

    this.timers.set(
      id,
      timer
    );
  }
}