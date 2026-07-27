import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LucideSalad,
  LucideArchive,
  LucideBeef,
  LucideCakeSlice,
  LucideCookingPot,
  LucideCupSoda,
  LucideDynamicIcon,
  LucideEllipsis,
  LucideLayoutGrid,
  LucideSandwich,
  LucideSoup,
  LucideWheat,
  LucideScanSearch,
  LucideShoppingBasket,
  LucideShoppingBag,
  LucideHeart,
  type LucideIcon
} from '@lucide/angular';
import { OfferCard } from '../../../offers/components/offer-card/offer-card';
import { Offer } from '../../../offers/models/offer';
import { OfferService } from '../../../offers/services/offer';

interface FoodCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  iconColor: string;
}

@Component({
  selector: 'app-home-page',
  imports: [LucideDynamicIcon, RouterLink, OfferCard],
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
      iconColor: '#2f8f46'
    },
    {
      id: 'cooked_meals',
      name: 'Kuvana jela',
      icon: LucideCookingPot,
      iconColor: '#b87333'
    },
    {
      id: 'soups_and_stews',
      name: 'Supe i čorbe',
      icon: LucideSoup,
      iconColor: '#c07b3e'
    },
    {
      id: 'grilled_and_roasted',
      name: 'Roštilj i pečenja',
      icon: LucideBeef,
      iconColor: '#a94f38'
    },
    {
      id: 'bakery_and_pies',
      name: 'Peciva i pite',
      icon: LucideWheat,
      iconColor: '#c78a3a'
    },
    {
      id: 'desserts',
      name: 'Dezerti',
      icon: LucideCakeSlice,
      iconColor: '#d06b75'
    },
    {
      id: 'salads_and_sides',
      name: 'Salate i prilozi',
      icon: LucideSalad,
      iconColor: '#4e994f'
    },
    {
      id: 'preserved_food',
      name: 'Zimnica',
      icon: LucideArchive,
      iconColor: '#db7041'
    },
    {
      id: 'breakfast_and_snacks',
      name: 'Doručak i užine',
      icon: LucideSandwich,
      iconColor: '#b47a3e'
    },
    {
      id: 'drinks',
      name: 'Pića',
      icon: LucideCupSoda,
      iconColor: '#31884a'
    },
    {
      id: 'other',
      name: 'Ostalo',
      icon: LucideEllipsis,
      iconColor: '#727871'
    }
  ];

  readonly searchIcon = LucideScanSearch;
  readonly basketIcon = LucideShoppingBasket;
  readonly bagIcon = LucideShoppingBag;
  readonly heartIcon = LucideHeart;

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

  private loadLatestOffers(): void {
    this.isLoadingOffers.set(true);
    this.offersError.set(false);

    this.offerService.getOffers().subscribe({
      next: response => {
        this.latestOffers.set(response.offers.slice(0, 6));
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