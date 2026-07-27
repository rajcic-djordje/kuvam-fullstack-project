import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Offer } from '../../models/offer';

const categoryLabels: Record<string, string> = {
  cooked_meals: 'Kuvana jela',
  soups_and_stews: 'Supe i čorbe',
  grilled_and_roasted: 'Roštilj i pečenja',
  bakery_and_pies: 'Peciva i pite',
  desserts: 'Dezerti',
  salads_and_sides: 'Salate i prilozi',
  preserved_food: 'Zimnica',
  breakfast_and_snacks: 'Doručak i užine',
  drinks: 'Pića',
  other: 'Ostalo'
};

@Component({
  selector: 'app-offer-card',
  imports: [RouterLink],
  templateUrl: './offer-card.html',
  styleUrl: './offer-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferCard {
  @Input({ required: true }) offer!: Offer;

  get categoryLabel(): string {
    return categoryLabels[this.offer.category] ?? this.offer.category.split('_').join(' ');
  }

  get sellerInitial(): string {
    return this.offer.seller.businessName.trim().charAt(0).toUpperCase();
  }
}