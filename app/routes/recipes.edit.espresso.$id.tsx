import type { Route } from '.react-router/types/app/routes/+types/recipes.edit.espresso.$id';

import { EspressoParameters } from '@/components/recipes/espresso-parameters';
import { RecipeBasicInfo } from '@/components/recipes/recipe-basic-info';
import { RecipeOptionalInfo } from '@/components/recipes/recipe-optional-info';
import { RecipeTips } from '@/components/recipes/recipe-tips';
import { Button } from '@/components/ui/button';
import { updateEspressoRecipe } from '@/mutations/recipes';
import { getRecipeById } from '@/queries/recipes';
import { getLoggedInUserId } from '@/queries/users';
import { espressoFormSchema } from '@/schemas/recipe-schemas';
import { makeSSRClient } from '@/supa-client';
import { ArrowLeft, Coffee, Save } from 'lucide-react';
import { Form, Link, type MetaFunction, redirect } from 'react-router';

export const meta: MetaFunction = ({ data }) => {
  const recipe = (data as any)?.recipe;
  return [
    {
      title: recipe
        ? `Edit ${recipe.title} | Moca`
        : 'Edit Espresso Recipe | Moca',
    },
  ];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const { id: recipeId } = params;

  try {
    // Get the recipe
    const recipe = await getRecipeById(client, recipeId);

    // Check if it's an espresso recipe
    if (recipe.brewType !== 'espresso') {
      return redirect(`/recipes/edit/drip/${recipeId}`);
    }

    // Check if user is logged in and is the owner
    let currentUserId: string | null = null;
    try {
      currentUserId = await getLoggedInUserId(client);
    } catch (error) {
      // User is not logged in, redirect to login
      return redirect('/auth/login');
    }

    // Check if user owns this recipe
    if (!currentUserId || recipe.profile_id !== currentUserId) {
      // User doesn't own this recipe, redirect to recipe page
      return redirect(`/recipes/${recipeId}`);
    }

    return { recipe, currentUserId };
  } catch (error) {
    console.error('Failed to fetch recipe for editing:', error);
    throw new Response('Recipe not found', { status: 404 });
  }
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { id: recipeId } = params;

  try {
    const userId = await getLoggedInUserId(client);

    const formData = await request.formData();
    const { success, data, error } = espressoFormSchema.safeParse(
      Object.fromEntries(formData)
    );

    if (!success) {
      return { formErrors: error.flatten().fieldErrors };
    }

    await updateEspressoRecipe(client, recipeId, {
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

    return redirect(`/recipes/${recipeId}`);
  } catch (error) {
    console.error('Failed to update espresso recipe:', error);
    return {
      formErrors: {
        title: ['레시피 수정에 실패했습니다. 다시 시도해주세요.'],
      },
    };
  }
};

export default function EditEspresso({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { recipe } = loaderData;

  return (
    <>
      <Button variant='ghost' asChild className='mb-4'>
        <Link to={`/recipes/${recipe.id}`}>
          <ArrowLeft className='h-4 w-4' />
          레시피로 돌아가기
        </Link>
      </Button>

      <div className='mb-8'>
        <div className='flex items-center gap-3'>
          <Coffee className='text-primary h-6 w-6' />
          <h1 className='text-2xl font-bold'>에스프레소 레시피 수정</h1>
        </div>
        <p className='text-muted-foreground mt-2'>
          에스프레소 레시피의 세부 정보를 수정하세요
        </p>
      </div>

      <Form method='post' className='space-y-6'>
        {/* Basic Recipe Info */}
        <RecipeBasicInfo
          defaultTitle={recipe.title}
          defaultDescription={recipe.description || ''}
        />

        {/* Espresso Parameters */}
        <EspressoParameters
          defaultWaterTemperature={recipe.espressoParams?.waterTemperature}
          defaultCoffeeAmount={recipe.espressoParams?.coffeeAmount}
          defaultExtractionTime={recipe.espressoParams?.extractionTime}
          defaultExtractionTimeMin={recipe.espressoParams?.extractionTimeMin}
          defaultExtractionTimeMax={recipe.espressoParams?.extractionTimeMax}
          defaultExtractionAmount={recipe.espressoParams?.extractionAmount}
          defaultExtractionAmountMin={
            recipe.espressoParams?.extractionAmountMin
          }
          defaultExtractionAmountMax={
            recipe.espressoParams?.extractionAmountMax
          }
        />

        <RecipeOptionalInfo
          recipeType='espresso'
          description='원두 및 분쇄도를 입력해주세요'
          defaultBean={recipe.bean || ''}
          defaultGrinder={recipe.espressoParams?.grinder || ''}
          defaultGrindSize={recipe.espressoParams?.grindSize || ''}
          defaultGrinderSetting={recipe.espressoParams?.grinderSetting || ''}
        />

        <RecipeTips defaultTips={recipe.tips || ''} />

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
            <Save className='mr-2 h-4 w-4' />
            레시피 수정
          </Button>
        </div>
      </Form>
    </>
  );
}
