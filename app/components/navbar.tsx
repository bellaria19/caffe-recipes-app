import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, Coffee, LogIn, UserPlus } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Coffee className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Caffe Recipes</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {/* <Button asChild variant="ghost" size="sm">
            <Link to="/" className="flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </Button> */}

          <Button asChild variant="ghost" size="sm">
            <Link to="/auth/login" className="flex items-center space-x-1">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm">
            <Link to="/auth/join" className="flex items-center space-x-1">
              <UserPlus className="h-4 w-4" />
              <span>Join</span>
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
