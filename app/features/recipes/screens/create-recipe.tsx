import type { Route } from '.react-router/types/app/features/recipes/screens/+types/create-recipe';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getLoggedInUserId } from '@/features/users/queries';
import { makeSSRClient } from '@/supa-client';
import { Coffee, Droplets } from 'lucide-react';
import { Link, type MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Recipe | Moca' }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  const userId = await getLoggedInUserId(client);
};

export default function CreateRecipe() {
  return (
    <>
      <div>
        <h1 className='mb-6 text-3xl font-bold'>새 레시피 만들기</h1>
        <p className='text-lg font-medium'>
          추출 노하우와 팁을 레시피로 공유해보세요
        </p>
      </div>

      <div className='space-y-4'>
        <p className='text-muted-foreground mt-8'>
          어떤 종류의 커피 레시피를 만들고 싶으신가요?
        </p>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Link to='/recipes/create/espresso'>
            <Card className='hover:border-primary h-full cursor-pointer border-2 transition-shadow hover:shadow-lg'>
              <CardHeader className='text-center'>
                <Coffee className='text-primary mx-auto mb-4 h-12 w-12' />
                <CardTitle>에스프레소</CardTitle>
                <CardDescription className='pt-4'>
                  에스프레소 레시피를 만들어보세요.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to='/recipes/create/drip'>
            <Card className='hover:border-primary h-full cursor-pointer border-2 transition-shadow hover:shadow-lg'>
              <CardHeader className='text-center'>
                <Droplets className='text-primary mx-auto mb-4 h-12 w-12' />
                <CardTitle>드립 커피</CardTitle>
                <CardDescription className='pt-4'>
                  드립 커피 레시피를 만들어보세요.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
