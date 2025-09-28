export type SortType =
  | 'popularity'
  | 'popularity-daily'
  | 'popularity-weekly'
  | 'newest';

export type RecipeType = 'all' | 'drip' | 'espresso';
export type BrewType = 'drip' | 'espresso';

export interface Recipe {
  id: string;
  profile_id: string;
  author: string;
  title: string;
  description?: string;
  brewType: BrewType;
  rating: number; // 1-5 stars
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
  waterTemperature: number; // 온도 (°C)
  coffeeAmount: number; // 원두량 (g)
  extractionTime?: number; // 추출시간 단일값 (초)
  extractionTimeMin?: number; // 추출시간 최소값 (초)
  extractionTimeMax?: number; // 추출시간 최대값 (초)
  extractionAmount?: number; // 추출량 단일값 (ml)
  extractionAmountMin?: number; // 추출량 최소값 (ml)
  extractionAmountMax?: number; // 추출량 최대값 (ml)
  grindSize?: string; // 분쇄도
  grinder?: string; // 그라인더명
  grinderSetting?: string; // 그라인더 설정
}

export interface DripParams {
  coffeeAmount: number; // 원두량 (g)
  waterTemperature: number; // 온도 (°C)
  dripper?: string; // 드리퍼 종류
  grindSize?: string; // 분쇄도 설명
  grinder?: string; // 그라인더명
  grinderSetting?: string; // 그라인더 설정
  extractionSteps: DripStep[]; // 추출단계
}

export interface DripStep {
  stepName: string; // 단계명 (예: "Blooming", "Pour 1st")
  waterAmount: number; // 물의 양 (g)
  duration?: number; // 시간 (초, 선택사항)
}

export interface Review {
  id: string;
  profileId: string;
  recipeId: string;
  rating: number; // 1-5 stars
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    username: string;
    profileImageUrl?: string | null;
  };
}
