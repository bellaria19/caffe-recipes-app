import { useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { useAuth } from "@/lib/hooks/use-auth";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(username, email, password);
      navigate("/"); // Redirect to home after signup
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign up to your account</h1>
      </div>
      <div className="grid gap-6 space-y-3">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            type="text" 
            placeholder="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="moca@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "가입 중..." : "Sign up"}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <Button variant="outline" className="w-full">
          <SiGoogle size={24} />
          Sign up with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
