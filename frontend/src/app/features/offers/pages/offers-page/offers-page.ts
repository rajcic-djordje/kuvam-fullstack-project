import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  LucideArchive,
  LucideBadgeCheck,
  LucideBeef,
  LucideCakeSlice,
  LucideChevronRight,
  LucideCookingPot,
  LucideCupSoda,
  LucideDynamicIcon,
  LucideEllipsis,
  LucideLayoutGrid,
  LucideMapPin,
  LucidePackageOpen,
  LucideSalad,
  LucideSandwich,
  LucideScanSearch,
  LucideSoup,
  LucideStore,
  LucideWheat,
  LucideX,
  LucideClock,
  type LucideIcon
} from '@lucide/angular';
import {
  OfferCategory,
  OfferCategoryFilter,
  PublicSeller
} from '../../models/seller';
import { SellerService } from '../../services/seller';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

interface FoodCategory {
  id: OfferCategoryFilter;
  name: string;
  icon: LucideIcon;
  iconColor: string;
  softColor: string;
}

@Component({
  selector: 'app-offers-page',
  imports: [LucideDynamicIcon],
  templateUrl: './offers-page.html',
  styleUrl: './offers-page.css'
})
export class OffersPage implements OnInit {
  private readonly sellerService = inject(SellerService);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly searchIcon = LucideScanSearch;
  readonly clearIcon = LucideX;
  readonly mapPinIcon = LucideMapPin;
  readonly storeIcon = LucideStore;
  readonly verifiedIcon = LucideBadgeCheck;
  readonly offersIcon = LucidePackageOpen;
  readonly arrowIcon = LucideChevronRight;
  readonly clockIcon = LucideClock;

  readonly searchTerm = signal('');
  readonly selectedCategory = signal<OfferCategoryFilter>('all');

  readonly sellers = signal<PublicSeller[]>([]);
  readonly isLoading = signal(true);
  readonly loadError = signal('');

  readonly categories: FoodCategory[] = [
    {
      id: 'all',
      name: 'Sva hrana',
      icon: LucideLayoutGrid,
      iconColor: '#2f8f46',
      softColor: '#eef6ef'
    },
    {
      id: 'cooked_meals',
      name: 'Kuvana jela',
      icon: LucideCookingPot,
      iconColor: '#b87333',
      softColor: '#f8efe5'
    },
    {
      id: 'soups_and_stews',
      name: 'Supe i čorbe',
      icon: LucideSoup,
      iconColor: '#c07b3e',
      softColor: '#faf1e7'
    },
    {
      id: 'grilled_and_roasted',
      name: 'Roštilj i pečenja',
      icon: LucideBeef,
      iconColor: '#a94f38',
      softColor: '#f8eae6'
    },
    {
      id: 'bakery_and_pies',
      name: 'Peciva i pite',
      icon: LucideWheat,
      iconColor: '#c78a3a',
      softColor: '#faf2e4'
    },
    {
      id: 'desserts',
      name: 'Dezerti',
      icon: LucideCakeSlice,
      iconColor: '#d06b75',
      softColor: '#faecef'
    },
    {
      id: 'salads_and_sides',
      name: 'Salate i prilozi',
      icon: LucideSalad,
      iconColor: '#4e994f',
      softColor: '#edf6ed'
    },
    {
      id: 'preserved_food',
      name: 'Zimnica',
      icon: LucideArchive,
      iconColor: '#db7041',
      softColor: '#fbece5'
    },
    {
      id: 'breakfast_and_snacks',
      name: 'Doručak i užine',
      icon: LucideSandwich,
      iconColor: '#b47a3e',
      softColor: '#f8f0e6'
    },
    {
      id: 'drinks',
      name: 'Pića',
      icon: LucideCupSoda,
      iconColor: '#31884a',
      softColor: '#eaf5ed'
    },
    {
      id: 'other',
      name: 'Ostalo',
      icon: LucideEllipsis,
      iconColor: '#727871',
      softColor: '#f0f1ef'
    }
  ];

  ngOnInit(): void {
    const search = this.activatedRoute.snapshot.queryParamMap.get('search');
    const category = this.activatedRoute.snapshot.queryParamMap.get('category');

    if (search) {
      this.searchTerm.set(search);
    }

    if (category && this.isValidCategory(category)) {
      this.selectedCategory.set(category);
    }

    this.loadSellers();
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  search(): void {
    this.loadSellers();
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.loadSellers();
  }

  selectCategory(category: OfferCategoryFilter): void {
    if (this.selectedCategory() === category) {
      return;
    }

    this.selectedCategory.set(category);
    this.loadSellers();
  }

  retry(): void {
    this.loadSellers();
  }

  categoryIcon(category: OfferCategory): LucideIcon {
    return this.getCategory(category)?.icon ?? LucidePackageOpen;
  }

  categoryColor(category: OfferCategory): string {
    return this.getCategory(category)?.iconColor ?? '#2f8f46';
  }

  categorySoftColor(category: OfferCategory): string {
    return this.getCategory(category)?.softColor ?? '#eef6ef';
  }

  sellerInitials(businessName: string): string {
    const words = businessName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) {
      return '?';
    }

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  private getCategory(category: OfferCategory): FoodCategory | undefined {
    return this.categories.find(option => option.id === category);
  }

  private loadSellers(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    const category = this.selectedCategory();

    this.sellerService.getSellers({
      search: this.searchTerm().trim() || undefined,
      category: category === 'all' ? undefined : category
    }).subscribe({
      next: response => {
        this.sellers.set(response.sellers);
        this.isLoading.set(false);
      },
      error: error => {
        this.sellers.set([]);
        this.isLoading.set(false);
        this.handleLoadError(error);
      }
    });
  }

  private isValidCategory(category: string): category is OfferCategory {
    return this.categories.some(option => {
      return option.id !== 'all' && option.id === category;
    });
  }

  private handleLoadError(error: HttpErrorResponse): void {
    const response = error.error as ApiErrorBody | undefined;

    if (response?.error?.code === 'INVALID_OFFER_CATEGORY') {
      this.loadError.set('Izabrana kategorija nije dostupna.');
      return;
    }

    this.loadError.set(
      response?.error?.message ??
      'Prodavci trenutno nisu dostupni.'
    );
  }
}