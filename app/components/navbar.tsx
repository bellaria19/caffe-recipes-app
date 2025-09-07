import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavbarButton } from "@/components/navbar-button";
import { useAuth } from "@/lib/hooks/use-auth";
import { Home, Coffee, LogIn, UserPlus, LogOut } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Coffee className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Moca</span>
          </Link>
          
          {/* Show "내 레시피" only when user is logged in */}
          {isAuthenticated && (
            <NavbarButton 
              to="/my-recipes" 
              icon={<Home className="h-4 w-4" />}
            >
              내 레시피
            </NavbarButton>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            /* Show logout when authenticated */
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>로그아웃</span>
            </Button>
          ) : (
            /* Show login/signup when not authenticated */
            <>
              <NavbarButton 
                to="/auth/login" 
                icon={<LogIn className="h-4 w-4" />}
              >
                로그인
              </NavbarButton>

              <NavbarButton 
                to="/auth/join" 
                variant="outline"
                icon={<UserPlus className="h-4 w-4" />}
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
