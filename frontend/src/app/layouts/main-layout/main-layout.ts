import {
  Component,
  effect,
  inject,
  signal
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth';
import { CartModal } from '../../features/cart/components/cart-modal/cart-modal';
import { LocationModal } from '../../features/location/components/location-modal/location-modal';
import { UserProfile } from '../../features/profile/models/profile';
import { ProfileService } from '../../features/profile/services/profile';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    Navbar,
    CartModal,
    LocationModal
  ],
  templateUrl: './main-layout.html'
})
export class MainLayout {
  private readonly authService = inject(
    AuthService
  );

  private readonly profileService = inject(
    ProfileService
  );

  private loadedProfileUserId: string | null =
    null;

  readonly isLocationModalOpen = signal(false);

  private readonly profileEffect = effect(() => {
    const authInitialized =
      this.authService.authInitialized();

    const user =
      this.authService.currentUser();

    if (!authInitialized) {
      return;
    }

    if (!user) {
      this.loadedProfileUserId = null;
      this.isLocationModalOpen.set(false);
      return;
    }

    if (user.role !== 'buyer') {
      this.loadedProfileUserId = user.id;
      this.isLocationModalOpen.set(false);
      return;
    }

    if (
      this.loadedProfileUserId === user.id
    ) {
      return;
    }

    this.loadedProfileUserId = user.id;

    this.profileService
      .getProfile()
      .subscribe({
        next: response => {
          this.authService.updateCurrentUser(
            response.user
          );

          const wasSkipped =
            sessionStorage.getItem(
              this.getLocationModalStorageKey(
                response.user.id
              )
            ) === 'true';

          this.isLocationModalOpen.set(
            !response.user.hasLocation &&
            !wasSkipped
          );
        },
        error: () => {
          this.isLocationModalOpen.set(false);
        }
      });
  });

  locationSaved(user: UserProfile): void {
    this.authService.updateCurrentUser(user);
    this.isLocationModalOpen.set(false);

    sessionStorage.removeItem(
      this.getLocationModalStorageKey(user.id)
    );
  }

  openLocationModal(): void {
      this.isLocationModalOpen.set(
        true
      );
  }

  locationDismissed(): void {
    const user =
      this.authService.currentUser();

    if (user) {
      sessionStorage.setItem(
        this.getLocationModalStorageKey(user.id),
        'true'
      );
    }

    this.isLocationModalOpen.set(false);
  }

  private getLocationModalStorageKey(
    userId: string
  ): string {
    return `kuvam-location-modal-skipped-${userId}`;
  }
}