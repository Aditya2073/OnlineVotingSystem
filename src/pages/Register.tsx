
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !voterId || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Simple voter ID validation (in a real app, this would be more sophisticated)
    if (voterId.length < 6) {
      toast.error('Voter ID must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, voterId, password);
      navigate('/');
    } catch (error) {
      // Error is already handled in the register function
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Register to participate in the democratic process"
      footer={
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indian-blue hover:text-indian-blue/80">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="voterId">Voter ID</Label>
          <Input
            id="voterId"
            type="text"
            placeholder="Enter your official voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="glass-input"
            required
          />
          <p className="text-xs text-gray-500">
            Your official voter ID issued by the Election Commission of India
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="glass-input"
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 rounded border-gray-300 text-indian-blue focus:ring-indian-blue/80"
            required
          />
          <Label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-indian-blue hover:text-indian-blue/80">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indian-blue hover:text-indian-blue/80">
              Privacy Policy
            </a>
          </Label>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-indian-blue hover:bg-indian-blue/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50" type="button">
            <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Register with Google
          </Button>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          By creating an account, you confirm that the information provided is accurate
          and matches your official voter registration details.
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
