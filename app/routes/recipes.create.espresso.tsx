import type { Route } from '.react-router/types/app/routes/+types/recipes.create.espresso';

import { EspressoParameters } from '@/components/recipes/espresso-parameters';
import { RecipeBasicInfo } from '@/components/recipes/recipe-basic-info';
import { RecipeOptionalInfo } from '@/components/recipes/recipe-optional-info';
import { RecipeTips } from '@/components/recipes/recipe-tips';
import { Button } from '@/components/ui/button';
import { createEspressoRecipe } from '@/mutations/recipes';
import { getLoggedInUserId } from '@/queries/users';
import { espressoFormSchema } from '@/schemas/recipe-schemas';
import { makeSSRClient } from '@/supa-client';
import { ArrowLeft, Save } from 'lucide-react';
import { Form, Link, type MetaFunction, redirect } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Espresso Recipe | Moca' }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  const userId = await getLoggedInUserId(client);
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  // const username = await getUserById(client, userId);

  const formData = await request.formData();
  const { success, data, error } = espressoFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { formErrors: error.flatten().fieldErrors };
  }

  try {
    const recipe = await createEspressoRecipe(client, {
      userId,
      title: data.title,
      description: data.description || undefined,
      bean: data.bean || undefined,
      tips: data.tips || undefined,
      waterTemperature: data.waterTemperature,
      coffeeAmount: data.coffeeAmount,
      extractionTime: data.extractionTime,
      extractionTimeMin: data.extractionTimeMin,
      extractionTimeMax: data.extractionTimeMax,
      extractionAmount: data.extractionAmount,
      extractionAmountMin: data.extractionAmountMin,
      extractionAmountMax: data.extractionAmountMax,
      grinder: data.grinder || undefined,
      otherGrinder: data.otherGrinder || undefined,
      grindSize: data.grindSize || undefined,
      grinderSetting: data.grinderSetting || undefined,
    });

    return redirect(`/recipes/${recipe[0].id}`);
  } catch (err) {
    console.error('Failed to create espresso recipe:', err);
    return {
      formErrors: {
        title: ['레시피 저장에 실패했습니다. 다시 시도해주세요.'],
      },
    };
  }
};

export default function CreateEspresso({ actionData }: Route.ComponentProps) {
  return (
    <>
      <Button variant='ghost' asChild className='mb-4'>
        <Link to='/recipes/create'>
          <ArrowLeft className='h-4 w-4' />
          뒤로 가기
        </Link>
      </Button>
      <h1 className='mb-6 text-3xl font-bold'>에스프레소 레시피 만들기</h1>

      <Form method='post' className='space-y-6'>
        <RecipeBasicInfo />
        <EspressoParameters />
        <RecipeOptionalInfo
          recipeType='espresso'
          description='원두 및 분쇄도를 입력해주세요'
        />
        <RecipeTips />

        {actionData?.formErrors && (
          <div className='text-red-500'>
            {Object.entries(actionData.formErrors).map(([field, errors]) => (
              <div key={field}>
                {field}: {errors?.join(', ')}
              </div>
            ))}
          </div>
        )}

        <div className='flex'>
          <Button
            type='submit'
            variant='default'
            className='flex-1 py-3 font-semibold'
          >
            <Save className='mr-2 h-4 w-4' />내 레시피 저장하기
          </Button>
        </div>
      </Form>
    </>
  );
}
