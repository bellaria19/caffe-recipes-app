import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiGoogle } from '@icons-pack/react-simple-icons';
import { Form } from 'react-router';

export function SignupForm() {
  return (
    <Form className='grid gap-6 space-y-3'>
      <div className='grid gap-3'>
        <Label htmlFor='username'>Username</Label>
        <Input
          name='username'
          id='username'
          type='text'
          placeholder='Enter your username'
          required
        />
      </div>

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
        <Label htmlFor='password'>Password</Label>
        <Input
          name='password'
          id='password'
          type='password'
          placeholder='password'
          required
        />
      </div>

      <Button type='submit' className='w-full'>
        Sign up
      </Button>

      <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
        <span className='bg-background text-muted-foreground relative z-10 px-2'>
          Or continue with
        </span>
      </div>

      <Button variant='outline' className='w-full'>
        <SiGoogle size={24} />
        Sign up with Google
      </Button>
    </Form>
  );
}
