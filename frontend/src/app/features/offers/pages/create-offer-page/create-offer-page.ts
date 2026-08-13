import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideClipboardList,
  LucideDynamicIcon,
  LucideImageUp,
  LucideSave,
  LucideTag,
  LucideUpload
} from '@lucide/angular';
import {
  debounceTime,
  Subscription
} from 'rxjs';
import { FormDraftService } from '../../../../shared/services/form-draft';
import { ToastService } from '../../../../shared/services/toast';
import { OFFER_CATEGORIES } from '../../constants/offer-categories';
import { CreateOfferRequest } from '../../models/offer';
import { OfferService } from '../../services/offer';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

interface SelectOption {
  value: string;
  label: string;
}

interface CreateOfferDraft {
  name: string;
  description: string;
  category: string;
  price: number;
  availableQuantity: number;
  unit: string;
}

@Component({
  selector: 'app-create-offer-page',
  imports: [
    LucideDynamicIcon,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './create-offer-page.html',
  styleUrl: './create-offer-page.css'
})
export class CreateOfferPage implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly offerService = inject(OfferService);
  private readonly formDraftService = inject(FormDraftService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  private readonly draftKey = 'create-offer';

  private draftSubscription: Subscription | null = null;

  readonly backIcon = LucideArrowLeft;
  readonly basicInfoIcon = LucideClipboardList;
  readonly priceIcon = LucideTag;
  readonly imageIcon = LucideImageUp;
  readonly saveIcon = LucideSave;
  readonly uploadIcon = LucideUpload;

  readonly isSubmitting = signal(false);
  readonly selectedImage = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);

  readonly categoryOptions: SelectOption[] = OFFER_CATEGORIES.map(category => ({
    value: category.id,
    label: category.name
  }));

  readonly unitOptions: SelectOption[] = [
    { value: 'porcija', label: 'Porcija' },
    { value: 'kilogram', label: 'Kilogram' },
    { value: 'komad', label: 'Komad' },
    { value: 'pakovanje', label: 'Pakovanje' },
    { value: 'tepsija', label: 'Tepsija' },
    { value: 'torta', label: 'Torta' },
    { value: 'tegla', label: 'Tegla' },
    { value: 'litar', label: 'Litar' }
  ];

  readonly offerForm = this.formBuilder.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]
    ],
    category: [
      '',
      [
        Validators.required
      ]
    ],
    price: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],
    availableQuantity: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],
    unit: [
      '',
      [
        Validators.required
      ]
    ]
  });

  ngOnInit(): void {
    this.restoreDraft();
    this.startDraftPersistence();
  }

  ngOnDestroy(): void {
    this.draftSubscription?.unsubscribe();
  }

  selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.isValidImage(file)) {
      input.value = '';

      return;
    }

    this.selectedImage.set(file);

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview.set(
        reader.result as string
      );
    };

    reader.readAsDataURL(file);
  }

  removeSelectedImage(): void {
    this.selectedImage.set(null);
    this.imagePreview.set(null);
  }

  createOffer(): void {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();

      return;
    }

    const values = this.offerForm.getRawValue();

    const request: CreateOfferRequest = {
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category,
      price: Number(values.price),
      availableQuantity: Number(values.availableQuantity),
      unit: values.unit
    };

    this.isSubmitting.set(true);

    this.offerService
      .createOffer(request)
      .subscribe({
        next: response => {
          this.formDraftService.clear(
            this.draftKey
          );

          const image = this.selectedImage();

          if (!image) {
            this.router.navigate([
              '/seller/offers'
            ]);

            return;
          }

          this.offerService
            .uploadOfferImage(
              response.offer._id,
              image
            )
            .subscribe({
              next: () => {
                this.router.navigate([
                  '/seller/offers'
                ]);
              },
              error: error => {
                this.isSubmitting.set(
                  false
                );

                this.handleImageUploadError(
                  error
                );
              }
            });
        },
        error: error => {
          this.isSubmitting.set(false);

          this.handleSubmitError(
            error
          );
        }
      });
  }

  private restoreDraft(): void {
    const draft =
      this.formDraftService.load<CreateOfferDraft>(
        this.draftKey
      );

    if (!draft) {
      return;
    }

    this.offerForm.patchValue({
      name: draft.name ?? '',
      description: draft.description ?? '',
      category: draft.category ?? '',
      price: Number(draft.price ?? 0),
      availableQuantity: Number(
        draft.availableQuantity ?? 1
      ),
      unit: draft.unit ?? ''
    });
  }

  private startDraftPersistence(): void {
    this.draftSubscription =
      this.offerForm.valueChanges
        .pipe(
          debounceTime(250)
        )
        .subscribe(() => {
          const values =
            this.offerForm.getRawValue();

          const draft: CreateOfferDraft = {
            name: values.name,
            description: values.description,
            category: values.category,
            price: Number(values.price),
            availableQuantity: Number(
              values.availableQuantity
            ),
            unit: values.unit
          };

          this.formDraftService.save(
            this.draftKey,
            draft
          );
        });
  }

  private isValidImage(file: File): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      this.toastService.error(
        'Dozvoljeni formati slike su JPG, PNG i WEBP.'
      );

      return false;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      this.toastService.error(
        'Slika može imati najviše 5 MB.'
      );

      return false;
    }

    return true;
  }

  private handleImageUploadError(
    error: HttpErrorResponse
  ): void {
    const response =
      error.error as
        | ApiErrorBody
        | undefined;

    this.toastService.error(
      response?.error?.message ??
      'Ponuda je kreirana, ali sliku trenutno nije moguće otpremiti. Možeš je dodati kroz izmenu ponude.'
    );
  }

  private handleSubmitError(
    error: HttpErrorResponse
  ): void {
    const response =
      error.error as
        | ApiErrorBody
        | undefined;

    const code =
      response?.error?.code;

    if (
      code ===
      'VALIDATION_ERROR'
    ) {
      this.toastService.error(
        'Uneti podaci nisu ispravni. Proveri sva polja.'
      );

      return;
    }

    if (
      code ===
      'SELLER_PROFILE_NOT_FOUND'
    ) {
      this.toastService.error(
        'Profil domaćina nije pronađen.'
      );

      return;
    }

    if (
      code ===
      'SELLER_NOT_APPROVED'
    ) {
      this.toastService.error(
        'Samo odobren domaćin može da kreira ponude.'
      );

      return;
    }

    this.toastService.error(
      response?.error?.message ??
      'Ponudu trenutno nije moguće kreirati.'
    );
  }
}