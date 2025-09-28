import type { Review } from '@/lib/types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className='py-8 text-center'>
        <p className='text-muted-foreground'>아직 리뷰가 없습니다.</p>
        <p className='text-muted-foreground text-sm'>
          첫 번째 리뷰를 작성해보세요!
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return (
      <div className='flex items-center gap-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className='space-y-4'>
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent>
            <div className='flex items-start gap-4'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={review.author.profileImageUrl || undefined} />
                <AvatarFallback>
                  {review.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <span className='font-medium'>
                      {review.author.username}
                    </span>
                    {renderStars(review.rating)}
                  </div>
                  <span className='text-muted-foreground text-sm'>
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                {review.content && (
                  <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
                    {review.content}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
