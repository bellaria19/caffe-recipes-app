import type { Route } from '.react-router/types/app/features/recipes/screens/+types/create-espresso';

import { Button } from '@/components/ui/button';
import { EspressoParameters } from '@/features/recipes/components/espresso-parameters';
import { RecipeBasicInfo } from '@/features/recipes/components/recipe-basic-info';
import { RecipeOptionalInfo } from '@/features/recipes/components/recipe-optional-info';
import { RecipeTips } from '@/features/recipes/components/recipe-tips';
import { getLoggedInUserId } from '@/features/users/queries';
import { makeSSRClient } from '@/supa-client';
import { Save } from 'lucide-react';
import { Form, Link, type MetaFunction } from 'react-router';
import { z } from 'zod';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Espresso Recipe | Moca' }];
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

    // Espresso parameters
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

    // Extraction time (single or range)
    extractionTime: z.coerce
      .number({
        required_error: '추출 시간을 입력해주세요',
      })
      .min(0)
      .max(60)
      .optional(),
    extractionTimeMin: z.coerce.number().min(0).max(60).optional(),
    extractionTimeMax: z.coerce.number().min(0).max(60).optional(),

    // Extraction amount (single or range)
    extractionAmount: z.coerce.number().min(0).max(60).optional(),
    extractionAmountMin: z.coerce.number().min(0).max(60).optional(),
    extractionAmountMax: z.coerce.number().min(0).max(60).optional(),

    // Grind settings
    grinder: z.string().optional(),
    otherGrinder: z.string().optional(),
    grindSize: z.string().optional(),
    grinderSetting: z.string().optional(),
  })
  .refine(
    (data) => {
      // Either single extractionTime or range (min/max) must be provided
      const hasSingleTime = data.extractionTime !== undefined;
      const hasTimeRange =
        data.extractionTimeMin !== undefined &&
        data.extractionTimeMax !== undefined;
      return hasSingleTime || hasTimeRange;
    },
    {
      message: '추출시간을 입력해주세요 (단일값 또는 범위)',
      path: ['extractionTime'],
    }
  )
  .refine(
    (data) => {
      // Either single extractionAmount or range (min/max) must be provided
      const hasSingleAmount = data.extractionAmount !== undefined;
      const hasAmountRange =
        data.extractionAmountMin !== undefined &&
        data.extractionAmountMax !== undefined;
      return hasSingleAmount || hasAmountRange;
    },
    {
      message: '추출량을 입력해주세요 (단일값 또는 범위)',
      path: ['extractionAmount'],
    }
  )
  .refine(
    (data) => {
      // If range is provided, min must be less than max
      if (
        data.extractionTimeMin !== undefined &&
        data.extractionTimeMax !== undefined
      ) {
        return data.extractionTimeMin < data.extractionTimeMax;
      }
      return true;
    },
    {
      message: '최소 추출시간은 최대 추출시간보다 작아야 합니다',
      path: ['extractionTimeMin'],
    }
  )
  .refine(
    (data) => {
      // If range is provided, min must be less than max
      if (
        data.extractionAmountMin !== undefined &&
        data.extractionAmountMax !== undefined
      ) {
        return data.extractionAmountMin < data.extractionAmountMax;
      }
      return true;
    },
    {
      message: '최소 추출량은 최대 추출량보다 작아야 합니다',
      path: ['extractionAmountMin'],
    }
  )
  .refine(
    (data) => {
      // If grinder is 'other', customGrinder must be provided
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
      // If grinder is 'other', both customGrinder and grinderSetting must be provided
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
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { formErrors: error.flatten().fieldErrors };
  }

  const { ...espressoParams } = data;
  // TODO: Create espresso recipe with validated data
  console.log('Validated espresso recipe data:', espressoParams);

  return { success: true };
};

export default function CreateEspresso({ actionData }: Route.ComponentProps) {
  return (
    <>
      <Button variant='ghost' asChild className='mb-4'>
        <Link to='/recipes/create'>← 뒤로 가기</Link>
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
