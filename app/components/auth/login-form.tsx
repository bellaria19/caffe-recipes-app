import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiGoogle } from '@icons-pack/react-simple-icons';
import { Form, Link } from 'react-router';

export function LoginForm() {
  return (
    <Form className='grid gap-6 space-y-3' method='post'>
      <div className='grid gap-3'>
        <Label htmlFor='email'>Email</Label>
        <Input
          name='email'
          id='email'
          type='email'
          placeholder='moca@example.com'
          required
        />
      </div>

      <div className='grid gap-3'>
        <div className='flex items-center'>
          <Label htmlFor='password'>Password</Label>
          <Link
            to='#'
            className='ml-auto text-sm underline-offset-4 hover:underline'
          >
            Forgot your password?
          </Link>
        </div>
        <Input
          name='password'
          id='password'
          type='password'
          placeholder='password'
          required
        />
      </div>

      <Button type='submit' className='w-full'>
        Log in
      </Button>

      <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
        <span className='bg-background text-muted-foreground relative z-10 px-2'>
          Or continue with
        </span>
      </div>

      <Button variant='outline' className='w-full'>
        <SiGoogle size={24} />
        Login with Google
      </Button>
    </Form>
  );
}
