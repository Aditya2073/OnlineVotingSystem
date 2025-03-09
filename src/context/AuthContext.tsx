import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { loginUser, registerUser } from '@/api/auth';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  voterId: string;
  isAdmin: boolean;
  hasVoted: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, voterId: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (updatedUser: User) => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to restore session');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Update user function
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loggedInUser = await loginUser(email, password);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      // Update state
      setUser(loggedInUser);
      toast.success('Login successful!');
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      toast.error(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, voterId: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await registerUser(name, email, voterId, password);
      
      // Update state
      setUser(newUser);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success('Registration successful!');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      toast.error(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
