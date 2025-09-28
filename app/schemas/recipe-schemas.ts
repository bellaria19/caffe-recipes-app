import { z } from 'zod';

export const espressoFormSchema = z
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

export const dripFormSchema = z
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