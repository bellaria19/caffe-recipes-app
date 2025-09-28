import { NavbarButton } from '@/components/common/navbar-button';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Coffee,
  LogIn,
  LogOut,
  Settings,
  User,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router';

export function Navbar({
  isLoggedIn,
  username,
  profileImageUrl,
}: {
  isLoggedIn: boolean;
  username?: string;
  profileImageUrl?: string | null;
}) {
  return (
    <nav className='bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur'>
      <div className='container mx-auto flex h-14 items-center justify-between px-4'>
        <div className='flex items-center space-x-6'>
          <Link
            to='/'
            className='flex items-center space-x-2 transition-opacity hover:opacity-80'
          >
            <Coffee className='text-primary h-6 w-6' />
            <span className='text-lg font-semibold'>Moca</span>
          </Link>
        </div>

        <div className='flex items-center space-x-2'>
          {isLoggedIn ? (
            /* Show username dropdown and logout when authenticated */
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='flex items-center space-x-2'
                  >
                    <Avatar className='h-6 w-6'>
                      <AvatarImage src={profileImageUrl || undefined} />
                      <AvatarFallback className='text-xs'>
                        {username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {username && <span className='text-sm'>{username}님</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/users/${username}/my-recipes`}
                      className='flex items-center gap-2'
                    >
                      <User className='h-4 w-4' />내 레시피
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to='/profile/edit'
                      className='flex items-center gap-2'
                    >
                      <Settings className='h-4 w-4' />
                      프로필 수정
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to='/auth/logout' className='flex items-center gap-2'>
                      <LogOut className='h-4 w-4' />
                      로그아웃
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Show login/signup when not authenticated */
            <>
              <NavbarButton
                to='/auth/login'
                icon={<LogIn className='h-4 w-4' />}
              >
                로그인
              </NavbarButton>

              <NavbarButton
                to='/auth/join'
                variant='outline'
                icon={<UserPlus className='h-4 w-4' />}
              >
                가입
              </NavbarButton>
            </>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
