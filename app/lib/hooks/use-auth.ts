import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

// Simple demo auth hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing auth state
    const checkAuth = () => {
      const savedUser = localStorage.getItem('demo_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('demo_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (email: string, password: string) => {
    // Demo login - normally this would be an API call
    const demoUser: User = {
      id: '1',
      name: 'John Coffee Lover',
      email: email
    };
    
    setUser(demoUser);
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    return Promise.resolve(demoUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  const signup = (name: string, email: string, password: string) => {
    // Demo signup - normally this would be an API call
    const demoUser: User = {
      id: '1',
      name: name,
      email: email
    };
    
    setUser(demoUser);
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    return Promise.resolve(demoUser);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup
  };
}