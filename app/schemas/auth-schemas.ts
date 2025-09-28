import { z } from 'zod';

/**
 * Authentication form schemas
 * 회원가입, 로그인 등 인증 관련 폼 검증 스키마
 */

/**
 * 회원가입 폼 스키마
 */
export const joinFormSchema = z.object({
  username: z
    .string({
      message: 'Username is required',
    })
    .min(4, {
      message: 'Username must be at least 4 characters',
    })
    .max(20, {
      message: 'Username must be less than 20 characters',
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  email: z
    .string({
      message: 'Email is required',
    })
    .email('Invalid email address'),
  password: z
    .string({
      message: 'Password is required',
    })
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .max(128, {
      message: 'Password must be less than 128 characters',
    }),
});

/**
 * 로그인 폼 스키마
 */
export const loginFormSchema = z.object({
  email: z
    .string({
      message: 'Email is required',
    })
    .email('Invalid email address'),
  password: z
    .string({
      message: 'Password is required',
    })
    .min(8, {
      message: 'Password must be at least 8 characters',
    }),
});

/**
 * 소셜 로그인 provider 파라미터 스키마
 */
export const socialProviderParamSchema = z.object({
  provider: z.enum(['google', 'kakao'], {
    message: 'Invalid social provider',
  }),
});

/**
 * TypeScript 타입 정의
 */
export type JoinFormData = z.infer<typeof joinFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SocialProvider = z.infer<typeof socialProviderParamSchema>['provider'];