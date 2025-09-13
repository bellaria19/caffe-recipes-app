import { Button } from '@/components/ui/button';
import { SiGoogle, SiKakao } from '@icons-pack/react-simple-icons';
import { Link } from 'react-router';

export function SocialAuthButtons() {
  return (
    <>
      <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
        <span className='bg-background text-muted-foreground relative z-10 px-2'>
          Or continue with
        </span>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <Button variant='outline' className='w-full' asChild>
          <Link to='/auth/social/google/login'>
            <SiGoogle size={24} />
            Google
          </Link>
        </Button>

        <Button variant='outline' className='w-full' asChild>
          <Link to='/auth/social/kakao/login'>
            <SiKakao size={24} />
            Kakao
          </Link>
        </Button>
      </div>
    </>
  );
}
