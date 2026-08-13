import {
  LucideArchive,
  LucideBeef,
  LucideCakeSlice,
  LucideCookingPot,
  LucideCupSoda,
  LucideEllipsis,
  LucideLayoutGrid,
  LucideSalad,
  LucideSandwich,
  LucideSoup,
  LucideWheat,
  type LucideIcon
} from '@lucide/angular';
import {
  OfferCategory,
  OfferCategoryFilter
} from '../models/seller';

export interface OfferCategoryConfig {
  id: OfferCategory;
  name: string;
  icon: LucideIcon;
  iconColor: string;
  softColor: string;
}

export interface OfferCategoryFilterConfig {
  id: OfferCategoryFilter;
  name: string;
  icon: LucideIcon;
  iconColor: string;
  softColor: string;
}

export const OTHER_OFFER_CATEGORY: OfferCategoryConfig = {
  id: 'other',
  name: 'Ostalo',
  icon: LucideEllipsis,
  iconColor: '#727871',
  softColor: '#f0f1ef'
};

export const OFFER_CATEGORIES: readonly OfferCategoryConfig[] = [
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
  OTHER_OFFER_CATEGORY
];

export const OFFER_CATEGORY_FILTERS: readonly OfferCategoryFilterConfig[] = [
  {
    id: 'all',
    name: 'Sva hrana',
    icon: LucideLayoutGrid,
    iconColor: '#2f8f46',
    softColor: '#eef6ef'
  },
  ...OFFER_CATEGORIES
];

const OFFER_CATEGORY_MAP = new Map(
  OFFER_CATEGORIES.map(category => [
    category.id,
    category
  ])
);

export const getOfferCategoryConfig = (
  category: string
): OfferCategoryConfig => {
  return OFFER_CATEGORY_MAP.get(
    category as OfferCategory
  ) ?? OTHER_OFFER_CATEGORY;
};