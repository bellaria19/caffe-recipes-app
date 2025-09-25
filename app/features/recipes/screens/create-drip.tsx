import type { DripStep } from '@/lib/types';

import type { Route } from '.react-router/types/app/features/recipes/screens/+types/create-drip';

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
import { createDripRecipe } from '@/features/recipes/mutations';
import { getLoggedInUserId } from '@/features/users/queries';
import { makeSSRClient } from '@/supa-client';
import { DropletsIcon, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Form, Link, redirect, type MetaFunction } from 'react-router';
import { z } from 'zod';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Drip Recipe | Moca' }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  const userId = await getLoggedInUserId(client);
};

const formSchema = z
  .object({
    // Basic recipe info
    title: z
      .string()
      .min(1, '제목을 입력해주세요')
      .max(50, '제목은 50자 이하로 입력해주세요'),
    description: z.string().optional(),
    bean: z.string().optional(),
    tips: z.string().optional(),

    // Drip parameters
    waterTemperature: z.coerce
      .number({
        required_error: '물 온도를 입력해주세요',
      })
      .min(80)
      .max(100),
    coffeeAmount: z.coerce
      .number({
        required_error: '원두 양을 입력해주세요',
      })
      .min(0)
      .max(30),
    dripType: z.enum(['hot', 'ice']),

    // Grind settings
    dripper: z.string().optional(),
    otherDripper: z.string().optional(),
    grinder: z.string().optional(),
    otherGrinder: z.string().optional(),
    grindSize: z.string().optional(),
    grinderSetting: z.string().optional(),

    extractionSteps: z.array(
      z.object({
        stepName: z.string(),
        waterAmount: z.number(),
        duration: z.number(),
      })
    ),
  })
  .refine(
    (data) => {
      // If dripper is 'other', otherDripper must be provided
      if (data.dripper === 'other') {
        return data.otherDripper && data.otherDripper.trim().length > 0;
      }
      return true;
    },
    {
      message: '커스텀 드리퍼 이름을 입력해주세요',
      path: ['otherDripper'],
    }
  )
  .refine(
    (data) => {
      // If grinder is 'other', otherGrinder must be provided
      if (data.grinder === 'other') {
        return data.otherGrinder && data.otherGrinder.trim().length > 0;
      }
      return true;
    },
    {
      message: '커스텀 그라인더 이름을 입력해주세요',
      path: ['otherGrinder'],
    }
  )
  .refine(
    (data) => {
      // If grinder is selected (not 'other'), grinderSetting must be provided
      if (data.grinder && data.grinder !== 'other') {
        return data.grinderSetting && data.grinderSetting.trim().length > 0;
      }
      return true;
    },
    {
      message: '그라인더 클릭 값을 입력해주세요',
      path: ['grinderSetting'],
    }
  )
  .refine(
    (data) => {
      // If grinder is 'other', both otherGrinder and grinderSetting must be provided
      if (data.grinder === 'other') {
        return data.grinderSetting && data.grinderSetting.trim().length > 0;
      }
      return true;
    },
    {
      message: '커스텀 그라인더의 클릭 값을 입력해주세요',
      path: ['grinderSetting'],
    }
  );

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
          extractionSteps: ['추출 단계 데이터 처리에 실패했습니다.']
        }
      };
    }
  }

  const { success, data, error } = formSchema.safeParse(formObject);

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
      dripType: data.dripType,
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
        title: ['레시피 저장에 실패했습니다. 다시 시도해주세요.']
      }
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

        <div className='flex gap-4'>
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
