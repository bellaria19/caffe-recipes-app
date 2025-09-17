export type SortType = 'popularity' | 'popularity-daily' | 'popularity-weekly' | 'newest';

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
  likesCount?: number;
  reviewsCount?: number;
  bean?: string;
  brewingTool?: string;
  grindValue?: string;
  profileImageUrl?: string;
}

export interface EspressoParams {
  waterTemperature: number; // in Celsius
  coffeeAmount: number; // in grams
  extractionTime?: number; // in seconds (single value)
  extractionTimeMin?: number; // in seconds (range min)
  extractionTimeMax?: number; // in seconds (range max)
  extractionAmount?: number; // in ml (single value)
  extractionAmountMin?: number; // in ml (range min)
  extractionAmountMax?: number; // in ml (range max)
}

export interface DripParams {
  coffeeAmount: number; // in grams
  waterTemperature: number; // in Celsius
  brewingType?: 'hot' | 'ice'; // hot or ice brewing
  dripper?: string; // dripper type
  grindSize?: string; // grinding degree description (used when no grinder specified)
  grinder?: string; // grinder name (when grinder is specified)
  grinderSetting?: string; // grinder setting (when grinder is specified)
  extractionSteps: DripStep[];
}

export interface DripStep {
  stepName: string; // e.g., "Blooming", "Pour 1st", "2nd", "3rd"
  waterAmount: number; // in grams
  duration?: number; // in seconds (optional for blooming time)
}
