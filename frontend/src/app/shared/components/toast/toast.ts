import {
  Component,
  inject
} from '@angular/core';
import {
  LucideDynamicIcon,
  LucideX,
  type LucideIcon
} from '@lucide/angular';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  imports: [
    LucideDynamicIcon
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {
  readonly toastService =
    inject(ToastService);

  readonly closeIcon: LucideIcon =
    LucideX;
}