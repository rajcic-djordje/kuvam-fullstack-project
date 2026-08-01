import {
  Component,
  signal
} from '@angular/core';
import {
  LucideDynamicIcon,
  LucideSearch,
  LucideX,
  type LucideIcon
} from '@lucide/angular';

type OfferCategory =
  | 'all'
  | 'cooked_meals'
  | 'soups_and_stews'
  | 'grilled_and_roasted'
  | 'bakery_and_pies'
  | 'desserts'
  | 'salads_and_sides'
  | 'preserved_food'
  | 'breakfast_and_snacks'
  | 'drinks'
  | 'other';

interface CategoryOption {
  value: OfferCategory;
  label: string;
}

@Component({
  selector: 'app-offers-page',
  imports: [
    LucideDynamicIcon
  ],
  templateUrl: './offers-page.html',
  styleUrl: './offers-page.css'
})
export class OffersPage {
  readonly searchIcon: LucideIcon = LucideSearch;
  readonly clearIcon: LucideIcon = LucideX;

  readonly searchTerm = signal('');
  readonly selectedCategory = signal<OfferCategory>('all');

  readonly categories: CategoryOption[] = [
    {
      value: 'all',
      label: 'Sve'
    },
    {
      value: 'cooked_meals',
      label: 'Kuvana jela'
    },
    {
      value: 'soups_and_stews',
      label: 'Supe i čorbe'
    },
    {
      value: 'grilled_and_roasted',
      label: 'Roštilj i pečenje'
    },
    {
      value: 'bakery_and_pies',
      label: 'Peciva i pite'
    },
    {
      value: 'desserts',
      label: 'Poslastice'
    },
    {
      value: 'salads_and_sides',
      label: 'Salate i prilozi'
    },
    {
      value: 'preserved_food',
      label: 'Zimnica'
    },
    {
      value: 'breakfast_and_snacks',
      label: 'Doručak i užina'
    },
    {
      value: 'drinks',
      label: 'Pića'
    },
    {
      value: 'other',
      label: 'Ostalo'
    }
  ];

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  selectCategory(category: OfferCategory): void {
    this.selectedCategory.set(category);
  }
}