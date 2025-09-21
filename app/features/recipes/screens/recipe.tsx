import type { MetaFunction } from 'react-router';

import { Button } from '@/components/ui/button';
import { DisplayBasicInfo } from '@/features/recipes/components/display-basic-info';
import { DisplayOptionalInfo } from '@/features/recipes/components/display-optional-info';
import { DisplayParameters } from '@/features/recipes/components/display-parameters';
import { DisplayTips } from '@/features/recipes/components/display-tips';
import { mockRecipes } from '@/lib/data/recipes';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router';

export const meta: MetaFunction = ({ params }) => {
  const { id } = params;
  const recipe = mockRecipes.find((r) => r.id === id);
  return [
    {
      title: recipe ? `${recipe.title} | Moca` : 'Recipe | Moca',
    },
  ];
};

export default function Recipe() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // Get back URL from search params, default to home
  const backUrl = searchParams.get('back')
    ? decodeURIComponent(searchParams.get('back')!)
    : '/';

  // Find the recipe by ID
  const recipe = mockRecipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className='py-12 text-center'>
        <h1 className='mb-4 text-2xl font-bold'>레시피를 찾을 수 없습니다</h1>
        <p className='text-muted-foreground mb-6'>
          요청하신 레시피가 존재하지 않거나 삭제되었습니다.
        </p>
        <Button asChild>
          <Link to='/'>홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center justify-between pb-10'>
        <Button variant='ghost' asChild>
          <Link to={backUrl} className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            홈으로 돌아가기
          </Link>
        </Button>

        {/* <div className='flex gap-3'>
          <Button asChild>
            <Link to={`/recipes/edit/${id}`}>레시피 수정</Link>
          </Button>
          <Button variant='outline'>레시피 공유</Button>
        </div> */}
      </div>

      {/* Recipe Header */}
      <div className='space-y-6'>
        {/* Basic Info */}
        <DisplayBasicInfo recipe={recipe} />
        {/* Recipe Parameters */}
        <DisplayParameters recipe={recipe} />
        {/* Optional Info */}
        <DisplayOptionalInfo recipe={recipe} />
        {/* Tips */}
        {recipe.tips && <DisplayTips recipe={recipe} />}
      </div>
    </>
  );
}
