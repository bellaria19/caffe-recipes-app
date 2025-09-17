import type { Recipe } from '../types';
import { mockRecipes } from './recipes';

export type PopularPeriod = 'all' | 'daily' | 'weekly';

/**
 * 구간별 인기순 레시피 조회 (현재는 Mock 데이터 사용)
 * 실제 구현 시 Supabase에서 데이터를 가져올 예정
 * @param period - 'all' | 'daily' | 'weekly'
 * @param limit - 조회할 레시피 수 (기본값: 20)
 * @param offset - 페이지네이션을 위한 오프셋 (기본값: 0)
 */
export async function getPopularRecipes(
  period: PopularPeriod = 'all',
  limit: number = 20,
  offset: number = 0
): Promise<Recipe[]> {
  // 현재는 Mock 데이터를 기반으로 시뮬레이션
  try {
    let results = [...mockRecipes];

    // 구간별로 다른 정렬 방식 적용 (시뮬레이션)
    switch (period) {
      case 'daily':
        // 일간: 어제(1일) 생성된 레시피 중 높은 평점 순
        results = results
          .filter(recipe => {
            const daysDiff = (new Date().getTime() - recipe.createdAt.getTime()) / (1000 * 60 * 60 * 24);
            return daysDiff >= 1 && daysDiff <= 2; // 1-2일 전 (어제)
          })
          .sort((a, b) => b.rating - a.rating);
        break;
      case 'weekly':
        // 주간: 지난주(7일) 내 높은 평점 순
        results = results
          .filter(recipe => {
            const daysDiff = (new Date().getTime() - recipe.createdAt.getTime()) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7; // 최근 7일 이내
          })
          .sort((a, b) => b.rating - a.rating);
        break;
      case 'all':
      default:
        // 전체: 평점 순
        results = results.sort((a, b) => b.rating - a.rating);
        break;
    }

    // 페이지네이션 적용
    const startIndex = offset;
    const endIndex = offset + limit;

    return results.slice(startIndex, endIndex);
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    return [];
  }
}

/**
 * 인기순 기간 옵션 목록
 */
export const popularPeriodOptions = [
  { value: 'all', label: '전체' },
  { value: 'daily', label: '일간' },
  { value: 'weekly', label: '주간' },
] as const;