import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LucideArchive,
  LucideBeef,
  LucideCakeSlice,
  LucideChevronRight,
  LucideCookingPot,
  LucideCupSoda,
  LucideDynamicIcon,
  LucideEllipsis,
  LucideHeart,
  LucideLayoutGrid,
  LucidePackageOpen,
  LucideSalad,
  LucideSandwich,
  LucideScanSearch,
  LucideShoppingBag,
  LucideShoppingBasket,
  LucideSoup,
  LucideWheat,
  type LucideIcon
} from '@lucide/angular';
import { Offer } from '../../../offers/models/offer';
import { OfferService } from '../../../offers/services/offer';

interface FoodCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  iconColor: string;
  softColor: string;
}

@Component({
  selector: 'app-home-page',
  imports: [LucideDynamicIcon, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  private readonly offerService = inject(OfferService);
  private readonly router = inject(Router);

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
      softColor: '#f7eee4'
    },
    {
      id: 'soups_and_stews',
      name: 'Supe i čorbe',
      icon: LucideSoup,
      iconColor: '#c07b3e',
      softColor: '#f8efe5'
    },
    {
      id: 'grilled_and_roasted',
      name: 'Roštilj i pečenja',
      icon: LucideBeef,
      iconColor: '#a94f38',
      softColor: '#f6e9e6'
    },
    {
      id: 'bakery_and_pies',
      name: 'Peciva i pite',
      icon: LucideWheat,
      iconColor: '#c78a3a',
      softColor: '#f9f0df'
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
      softColor: '#faece5'
    },
    {
      id: 'breakfast_and_snacks',
      name: 'Doručak i užine',
      icon: LucideSandwich,
      iconColor: '#b47a3e',
      softColor: '#f7eee4'
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

  readonly searchIcon = LucideScanSearch;
  readonly basketIcon = LucideShoppingBasket;
  readonly bagIcon = LucideShoppingBag;
  readonly heartIcon = LucideHeart;
  readonly offerIcon = LucidePackageOpen;
  readonly arrowIcon = LucideChevronRight;

  readonly latestOffers = signal<Offer[]>([]);
  readonly isLoadingOffers = signal(true);
  readonly offersError = signal(false);

  ngOnInit(): void {
    this.loadLatestOffers();
  }

  searchOffers(search: string): void {
    const searchTerm = search.trim();

    this.router.navigate(['/offers'], {
      queryParams: searchTerm ? { search: searchTerm } : {}
    });
  }

  categoryIcon(categoryId: string): LucideIcon {
    return this.categories.find(category => category.id === categoryId)?.icon ?? LucideEllipsis;
  }

  categoryColor(categoryId: string): string {
    return this.categories.find(category => category.id === categoryId)?.iconColor ?? '#727871';
  }

  categorySoftColor(categoryId: string): string {
    return this.categories.find(category => category.id === categoryId)?.softColor ?? '#f0f1ef';
  }

  categoryName(categoryId: string): string {
    return this.categories.find(category => category.id === categoryId)?.name ?? 'Ostalo';
  }

  truncateText(value: string, maxLength: number): string {
    const trimmedValue = value.trim();

    if (trimmedValue.length <= maxLength) {
      return trimmedValue;
    }

    return `${trimmedValue.slice(0, maxLength).trimEnd()}…`;
  }

  private loadLatestOffers(): void {
    this.isLoadingOffers.set(true);
    this.offersError.set(false);

    this.offerService.getOffers().subscribe({
      next: response => {
        this.latestOffers.set(response.offers.slice(0, 8));
        this.isLoadingOffers.set(false);
      },
      error: () => {
        this.latestOffers.set([]);
        this.offersError.set(true);
        this.isLoadingOffers.set(false);
      }
    });
  }
}