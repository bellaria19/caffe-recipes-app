import type { Review } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Plus, Star } from 'lucide-react';
import { useState } from 'react';

import { ReviewForm } from './review-form';
import { ReviewList } from './review-list';

interface RecipeReviewsSectionProps {
  recipeId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  canReview: boolean; // 사용자가 리뷰를 작성할 수 있는지 (로그인 상태 && 본인 레시피가 아닌 경우)
  userReview?: Review | null; // 사용자의 기존 리뷰
}

export function RecipeReviewsSection({
  recipeId,
  reviews,
  averageRating,
  totalReviews,
  canReview,
  userReview,
}: RecipeReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-500" />
              <CardTitle>리뷰 ({totalReviews})</CardTitle>
            </div>

            {canReview && !showReviewForm && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {userReview ? '리뷰 수정' : '리뷰 작성'}
              </Button>
            )}
          </div>
        </CardHeader>

        {totalReviews > 0 && (
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(averageRating)}
                <span className="text-lg font-semibold">{averageRating}</span>
                <span className="text-muted-foreground text-sm">
                  ({totalReviews}개의 리뷰)
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          recipeId={recipeId}
          existingReview={userReview}
          onSuccess={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      <ReviewList reviews={reviews} />
    </div>
  );
}