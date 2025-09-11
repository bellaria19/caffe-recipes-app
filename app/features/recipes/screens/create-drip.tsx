import { DripRecipeForm } from '@/components/recipe/drip-recipe-form';
import { Button } from '@/components/ui/button';
import { Link, type MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Drip Recipe | Moca' }];
};

export default function CreateDrip() {
  return (
    <>
      <Button variant='ghost' asChild className='mb-4'>
        <Link to='/recipes/create'>← 뒤로 가기</Link>
      </Button>
      <h1 className='mb-6 text-3xl font-bold'>드립 커피 레시피 만들기</h1>
      <DripRecipeForm />
    </>
  );
}
