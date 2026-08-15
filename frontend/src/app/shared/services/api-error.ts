import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiErrorService {
  private readonly messages: Record<string, string> = {
    INVALID_CREDENTIALS: 'Email adresa ili lozinka nisu ispravni.',
    WRONG_PASSWORD: 'Email adresa ili lozinka nisu ispravni.',
    USER_NOT_FOUND: 'Email adresa ili lozinka nisu ispravni.',
    ACCOUNT_DEACTIVATED: 'Ovaj nalog trenutno nije aktivan.',
    ACCOUNT_DISABLED: 'Ovaj nalog trenutno nije aktivan.',
    USER_INACTIVE: 'Ovaj nalog trenutno nije aktivan.',
    VALIDATION_ERROR: 'Proveri unete podatke i pokušaj ponovo.',

    EMAIL_ALREADY_IN_USE: 'Nalog sa ovom email adresom već postoji.',
    EMAIL_TAKEN: 'Nalog sa ovom email adresom već postoji.',

    ADMIN_ACCESS_REQUIRED: 'Ovaj nalog nema administratorske privilegije.',

    CITY_NOT_FOUND: 'Izabrani grad više nije dostupan.',
    ADDRESS_NOT_FOUND: 'Uneta adresa nije pronađena. Proveri grad, ulicu i broj.',
    GEOCODING_SERVICE_UNAVAILABLE: 'Servis za pronalaženje adrese trenutno nije dostupan. Pokušaj ponovo kasnije.',
    INVALID_GEOCODING_RESPONSE: 'Koordinate za unetu adresu trenutno nije moguće odrediti.',

    INSUFFICIENT_OFFER_QUANTITY: 'Dostupna količina neke od stavki se u međuvremenu promenila. Korpa je osvežena — proveri količine i pokušaj ponovo.',
    OFFER_NOT_AVAILABLE: 'Jedna od ponuda više nije dostupna. Korpa je osvežena — proveri stavke pre ponovnog slanja.',
    OFFER_NOT_FOUND: 'Jedna od ponuda više ne postoji. Proveri sadržaj korpe.',
    MULTIPLE_SELLERS_NOT_ALLOWED: 'Sve stavke u jednoj porudžbini moraju pripadati istom domaćinu.',
    OWN_OFFER_ORDER_NOT_ALLOWED: 'Ne možeš poručiti sopstvenu ponudu.'
  };

  getMessage(error: unknown, fallback: string): string {
    const code = this.getCode(error);
    const backendMessage = this.getBackendMessage(error);

    if (code === 'ACCOUNT_SUSPENDED') {
      const reason = this.extractReason(backendMessage);

      return reason
        ? `Nalog je suspendovan. Razlog: ${reason}`
        : 'Nalog je suspendovan.';
    }

    if (code === 'ACCOUNT_BANNED') {
      const reason = this.extractReason(backendMessage);

      return reason
        ? `Nalog je banovan. Razlog: ${reason}`
        : 'Nalog je banovan.';
    }

    if (code && this.messages[code]) {
      return this.messages[code];
    }

    return fallback;
  }

  getCode(error: unknown): string | null {
    if (!(error instanceof HttpErrorResponse)) {
      return null;
    }

    const response = error.error as ApiErrorBody | undefined;

    return response?.error?.code ?? null;
  }

  isBlockedAccountError(error: unknown): boolean {
    const code = this.getCode(error);

    return (
      code === 'ACCOUNT_SUSPENDED' ||
      code === 'ACCOUNT_BANNED' ||
      code === 'ACCOUNT_DEACTIVATED'
    );
  }

  private getBackendMessage(error: unknown): string | undefined {
    if (!(error instanceof HttpErrorResponse)) {
      return undefined;
    }

    const response = error.error as ApiErrorBody | undefined;

    return response?.error?.message;
  }

  private extractReason(message?: string): string | null {
    if (!message) {
      return null;
    }

    const marker = 'Reason:';
    const markerIndex = message.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const reason = message.slice(markerIndex + marker.length).trim();

    return reason || null;
  }
}