import type { Route } from '.react-router/types/app/routes/+types/profile.edit';

import { ImageUpload } from '@/components/profile/image-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '@/mutations/users';
import { getLoggedInUserId, getUserById } from '@/queries/users';
import { makeSSRClient } from '@/supa-client';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useState } from 'react';
import { Form, Link, type MetaFunction, redirect } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: '프로필 수정 | Moca' }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  try {
    const userId = await getLoggedInUserId(client);
    const profile = await getUserById(client, userId);

    if (!profile) {
      throw new Response('Profile not found', { status: 404 });
    }

    return { profile };
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw new Response('Profile not found', { status: 404 });
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);

  try {
    // Get current user
    const userId = await getLoggedInUserId(client);

    // Parse form data
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const profileImageUrl = formData.get('profileImageUrl') as string;

    // Validate required fields
    if (!username) {
      throw new Error('Username is required');
    }

    // Update profile
    await updateProfile(client, {
      userId,
      username: username.trim(),
      profileImageUrl: profileImageUrl?.trim() || null,
    });

    // Redirect to home page
    return redirect('/');
  } catch (error) {
    console.error('Failed to update profile:', error);

    // If user is not authenticated, redirect to login
    if (error instanceof Response && error.status === 302) {
      return error; // This is the redirect from getLoggedInUserId
    }

    // For other errors, stay on the page (could be enhanced with error messages)
    return { error: 'Failed to update profile' };
  }
};

export default function ProfileEdit({ loaderData }: Route.ComponentProps) {
  const { profile } = loaderData;
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    profile.profile_image_url
  );

  return (
    <div className='container mx-auto max-w-2xl p-4 py-10'>
      <div className='mb-6'>
        <Button variant='ghost' asChild>
          <Link to='/' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            홈으로 돌아가기
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <User className='h-6 w-6 text-blue-500' />
            <CardTitle>프로필 수정</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Profile Image Upload */}
            <ImageUpload
              currentImageUrl={profileImageUrl}
              onImageChange={setProfileImageUrl}
              username={profile.username}
            />

            <Form method='post' className='space-y-6'>
              {/* Username */}
              <div className='space-y-2'>
                <Label htmlFor='username'>
                  사용자명 <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='username'
                  name='username'
                  type='text'
                  defaultValue={profile.username}
                  placeholder='사용자명을 입력하세요'
                  required
                />
                <p className='text-muted-foreground text-sm'>
                  다른 사용자들에게 표시되는 이름입니다.
                </p>
              </div>

              {/* Hidden field for profile image URL */}
              <input
                type='hidden'
                name='profileImageUrl'
                value={profileImageUrl || ''}
              />

              {/* Submit Button */}
              <div className='flex gap-3'>
                <Button type='submit' className='flex items-center gap-2'>
                  <Save className='h-4 w-4' />
                  변경사항 저장
                </Button>
                <Button type='button' variant='outline' asChild>
                  <Link to='/'>취소</Link>
                </Button>
              </div>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
