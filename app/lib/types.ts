export type BrewType = 'drip' | 'espresso';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  brewType: BrewType;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // in minutes
  rating: number; // 1-5 stars
  author: string;
  image?: string;
  ingredients: string[];
  instructions: string[];
  createdAt: Date;
}