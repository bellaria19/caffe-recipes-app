import type { Review } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Form, useNavigate } from 'react-router';

interface ReviewFormProps {
  recipeId: string;
  existingReview?: Review | null;
  onSuccess?: () => void;
}

export function ReviewForm({ recipeId, existingReview, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const navigate = useNavigate();
  const isEditing = !!existingReview;

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredRating(starValue);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? '리뷰 수정' : '리뷰 작성'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          method="post"
          action={`/recipes/${recipeId}/reviews`}
          onSubmit={() => {
            setTimeout(() => {
              onSuccess?.();
              navigate(`/recipes/${recipeId}`, { replace: true });
            }, 100);
          }}
        >
          <div className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                평점 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-colors"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating > 0 && `${rating}점`}
                </span>
              </div>
              <input type="hidden" name="rating" value={rating} />
            </div>

            {/* Review Content */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                리뷰 내용
              </label>
              <Textarea
                name="content"
                placeholder="이 레시피에 대한 경험이나 의견을 공유해주세요..."
                className="min-h-24"
                defaultValue={existingReview?.content || ''}
              />
            </div>

            <input type="hidden" name="recipeId" value={recipeId} />
            {isEditing && <input type="hidden" name="reviewId" value={existingReview.id} />}
            <input type="hidden" name="isEdit" value={isEditing ? 'true' : 'false'} />

            <div className="flex gap-2">
              <Button type="submit" disabled={rating === 0}>
                {isEditing ? '리뷰 수정' : '리뷰 등록'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onSuccess?.()}
              >
                취소
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}