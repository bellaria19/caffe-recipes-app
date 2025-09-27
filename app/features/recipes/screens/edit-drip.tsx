import type { DripStep } from '@/lib/types';

import type { Route } from '.react-router/types/app/features/recipes/screens/+types/edit-drip';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DripParameters } from '@/features/recipes/components/drip-parameters';
import { RecipeBasicInfo } from '@/features/recipes/components/recipe-basic-info';
import { RecipeOptionalInfo } from '@/features/recipes/components/recipe-optional-info';
import { RecipeTips } from '@/features/recipes/components/recipe-tips';
import { updateDripRecipe } from '@/features/recipes/mutations';
import { getRecipeById } from '@/features/recipes/queries';
import { dripFormSchema } from '@/features/recipes/screens/create-drip';
import { getLoggedInUserId } from '@/features/users/queries';
import { makeSSRClient } from '@/supa-client';
import { ArrowLeft, DropletsIcon, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Form, Link, type MetaFunction, redirect } from 'react-router';

export const meta: MetaFunction = ({ data }) => {
  const recipe = (data as any)?.recipe;
  return [
    {
      title: recipe ? `Edit ${recipe.title} | Moca` : 'Edit Drip Recipe | Moca',
    },
  ];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const { id } = params;

  try {
    // Get the recipe
    const recipe = await getRecipeById(client, id);

    // Check if it's a drip recipe
    if (recipe.brewType !== 'drip') {
      return redirect(`/recipes/edit/espresso/${id}`);
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
      return redirect(`/recipes/${id}`);
    }

    return { recipe, currentUserId };
  } catch (error) {
    console.error('Failed to fetch recipe for editing:', error);
    throw new Response('Recipe not found', { status: 404 });
  }
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { id } = params;

  try {
    const userId = await getLoggedInUserId(client);
    const formData = await request.formData();
    const formObject = Object.fromEntries(formData);

    // Parse extractionSteps from JSON string
    if (formObject.extractionSteps) {
      try {
        formObject.extractionSteps = JSON.parse(
          formObject.extractionSteps as string
        );
      } catch (e) {
        console.error('Failed to parse extractionSteps:', e);
        return {
          formErrors: {
            extractionSteps: ['추출 단계 데이터 처리에 실패했습니다.'],
          },
        };
      }
    }

    const { success, data, error } = dripFormSchema.safeParse(formObject);

    if (!success) {
      return { formErrors: error.flatten().fieldErrors };
    }

    await updateDripRecipe(client, id, {
      userId,
      title: data.title,
      description: data.description || undefined,
      bean: data.bean || undefined,
      tips: data.tips || undefined,
      waterTemperature: data.waterTemperature,
      coffeeAmount: data.coffeeAmount,
      dripType: data.dripType,
      dripper: data.dripper || undefined,
      otherDripper: data.otherDripper || undefined,
      grinder: data.grinder || undefined,
      otherGrinder: data.otherGrinder || undefined,
      grindSize: data.grindSize || undefined,
      grinderSetting: data.grinderSetting || undefined,
      extractionSteps: data.extractionSteps,
    });

    return redirect(`/recipes/${id}`);
  } catch (error) {
    console.error('Failed to update drip recipe:', error);
    return {
      formErrors: {
        title: ['레시피 수정에 실패했습니다. 다시 시도해주세요.'],
      },
    };
  }
};

export default function EditDrip({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { recipe } = loaderData;

  // Initialize form state with existing recipe data
  const [extractionSteps, setExtractionSteps] = useState<DripStep[]>(
    recipe.dripParams?.extractionSteps || []
  );

  const addStep = () => {
    setExtractionSteps([...extractionSteps, { stepName: '', waterAmount: 0 }]);
  };

  const removeStep = (index: number) => {
    if (extractionSteps.length > 1) {
      setExtractionSteps(extractionSteps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (
    index: number,
    field: keyof DripStep,
    value: string | number | undefined
  ) => {
    const updatedSteps = [...extractionSteps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setExtractionSteps(updatedSteps);
  };

  return (
    <>
      <Button variant='ghost' asChild className='mb-4'>
        <Link to={`/recipes/${recipe.id}`} className='flex items-center gap-2'>
          <ArrowLeft className='h-4 w-4' />
          레시피로 돌아가기
        </Link>
      </Button>

      <div className='mb-8'>
        <div className='flex items-center gap-3'>
          <DropletsIcon className='text-primary h-6 w-6' />
          <h1 className='text-2xl font-bold'>드립 레시피 수정</h1>
        </div>
        <p className='text-muted-foreground mt-2'>
          드립 커피 레시피의 세부 정보를 수정하세요
        </p>
      </div>

      <Form method='post' className='space-y-6'>
        {/* Basic Recipe Info */}
        <RecipeBasicInfo
          defaultTitle={recipe.title}
          defaultDescription={recipe.description || ''}
        />

        {/* Drip Parameters */}
        <DripParameters
          defaultWaterTemperature={recipe.dripParams?.waterTemperature}
          defaultCoffeeAmount={recipe.dripParams?.coffeeAmount}
          defaultDripType={recipe.dripParams?.brewingType}
        />

        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <DropletsIcon className='h-5 w-5 text-amber-500' />
              <CardTitle>추출 단계</CardTitle>
            </div>
            <CardDescription>
              각 단계별 물의 양과 시간을 설정해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {extractionSteps.map((step, index) => (
              <div
                key={index}
                className='flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-end'
              >
                <div className='grid flex-1 gap-2'>
                  <Label htmlFor='stepName'>단계 이름</Label>
                  <Input
                    id='stepName'
                    name='stepName'
                    type='text'
                    placeholder='예: Blooming'
                    value={step.stepName}
                    onChange={(e) =>
                      updateStep(index, 'stepName', e.target.value)
                    }
                    required
                  />
                </div>

                <div className='grid flex-1 gap-2'>
                  <Label htmlFor='waterAmount'>물의 양 (g)</Label>
                  <Input
                    id='waterAmount'
                    name='waterAmount'
                    type='number'
                    min='10'
                    max='100'
                    step='5'
                    placeholder='40'
                    value={step.waterAmount}
                    onChange={(e) =>
                      updateStep(
                        index,
                        'waterAmount',
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>

                <div className='grid flex-1 gap-2'>
                  <Label htmlFor='duration'>시간 (초)</Label>
                  <Input
                    id='duration'
                    name='duration'
                    type='number'
                    min='5'
                    max='90'
                    step='5'
                    placeholder='30'
                    value={step.duration}
                    onChange={(e) =>
                      updateStep(
                        index,
                        'duration',
                        parseInt(e.target.value) || undefined
                      )
                    }
                  />
                </div>

                <div className='flex items-end justify-end md:ml-4'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => removeStep(index)}
                    disabled={extractionSteps.length === 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className='flex justify-end'>
            <Button type='button' variant='outline' size='sm' onClick={addStep}>
              <Plus className='mr-1 h-4 w-4' />
              단계 추가
            </Button>
          </CardFooter>
        </Card>

        <RecipeOptionalInfo
          recipeType='drip'
          description='사용하는 드리퍼와 분쇄도, 원두를 입력해주세요'
          defaultBean={recipe.bean || ''}
          defaultDripper={recipe.dripParams?.dripper || ''}
          defaultGrinder={recipe.dripParams?.grinder || ''}
          defaultGrindSize={recipe.dripParams?.grindSize || ''}
          defaultGrinderSetting={recipe.dripParams?.grinderSetting || ''}
        />

        <RecipeTips defaultTips={recipe.tips || ''} />

        {/* Hidden input for extraction steps */}
        <input
          type='hidden'
          name='extractionSteps'
          value={JSON.stringify(extractionSteps)}
        />

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
