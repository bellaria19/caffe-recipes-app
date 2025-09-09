export type SortType = 'popularity' | 'newest';

export type BrewType = 'all' | 'drip' | 'espresso';

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  brewType: BrewType;
  rating: number; // 1-5 stars
  author: string;
  image?: string;
  tips?: string; // optional tips for other users
  createdAt: Date;
  espressoParams?: EspressoParams;
  dripParams?: DripParams;
}

export interface EspressoParams {
  waterTemperature: number; // in Celsius
  coffeeAmount: number; // in grams
  extractionTime: number; // in seconds
  extractionAmount: number; // in ml
}

export interface DripParams {
  coffeeAmount: number; // in grams
  waterTemperature: number; // in Celsius
  grindSize?: string; // grinding degree description
  brewingType?: 'hot' | 'ice'; // hot or ice brewing
  extractionSteps: DripStep[];
}

export interface DripStep {
  stepName: string; // e.g., "Blooming", "Pour 1st", "2nd", "3rd"
  waterAmount: number; // in grams
  duration?: number; // in seconds (optional for blooming time)
}
