export type SortType = "popularity" | "newest";

export type BrewType = "all" | "drip" | "espresso";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  brewType: BrewType;
  rating: number; // 1-5 stars
  author: string;
  image?: string;
  ingredients: string[];
  instructions: string[];
  createdAt: Date;
}
