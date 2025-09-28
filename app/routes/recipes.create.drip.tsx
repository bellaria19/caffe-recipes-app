import type { DripStep } from '@/lib/types';

import type { Route } from '.react-router/types/app/routes/+types/recipes.create.drip';

import { DripParameters } from '@/components/recipes/drip-parameters';
import { RecipeBasicInfo } from '@/components/recipes/recipe-basic-info';
import { RecipeOptionalInfo } from '@/components/recipes/recipe-optional-info';
import { RecipeTips } from '@/components/recipes/recipe-tips';
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
import { createDripRecipe } from '@/mutations/recipes';
import { getLoggedInUserId } from '@/queries/users';
import { dripFormSchema } from '@/schemas/recipe-schemas';
import { makeSSRClient } from '@/supa-client';
import { DropletsIcon, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Form, Link, type MetaFunction, redirect } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Drip Recipe | Moca' }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  const userId = await getLoggedInUserId(client);
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);

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

  try {
    const recipe = await createDripRecipe(client, {
      userId,
      title: data.title,
      description: data.description || undefined,
      bean: data.bean || undefined,
      tips: data.tips || undefined,
      waterTemperature: data.waterTemperature,
      coffeeAmount: data.coffeeAmount,
      dripper: data.dripper || undefined,
      otherDripper: data.otherDripper || undefined,
      grinder: data.grinder || undefined,
      otherGrinder: data.otherGrinder || undefined,
      grindSize: data.grindSize || undefined,
      grinderSetting: data.grinderSetting || undefined,
      extractionSteps: data.extractionSteps,
    });

    return redirect(`/recipes/${recipe[0].id}`);
  } catch (err) {
    console.error('Failed to create drip recipe:', err);
    return {
      formErrors: {
        title: ['레시피 저장에 실패했습니다. 다시 시도해주세요.'],
      },
    };
  }
};

const defaultExtractionSteps: DripStep[] = [
  { stepName: 'Blooming', waterAmount: 40, duration: 40 },
  { stepName: 'Pour 1st', waterAmount: 40, duration: 40 },
  { stepName: '2nd', waterAmount: 40, duration: 40 },
  { stepName: '3rd', waterAmount: 40, duration: 40 },
];

export default function CreateDrip({ actionData }: Route.ComponentProps) {
  const [extractionSteps, setExtractionSteps] = useState<DripStep[]>(
    defaultExtractionSteps
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
        <Link to='/recipes/create'>← 뒤로 가기</Link>
      </Button>
      <h1 className='mb-6 text-3xl font-bold'>드립 커피 레시피 만들기</h1>

      <Form method='post' className='space-y-6'>
        <RecipeBasicInfo />

        <DripParameters />

        <RecipeOptionalInfo
          recipeType='drip'
          description='사용하는 드리퍼와 분쇄도, 원두를 입력해주세요'
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

        <RecipeTips />

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
            <Save className='mr-2 h-4 w-4' />내 레시피 저장하기
          </Button>
        </div>
      </Form>
    </>
  );
}
