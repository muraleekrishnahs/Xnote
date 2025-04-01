'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { login, LoginCredentials, isAuthenticated } from './lib/auth';
import {
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // Keep authentication check
  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsAuth(authStatus);
    if (authStatus) {
      router.replace('/notes');
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Keep login submission logic
  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await login(data);
      if (success) {
        setIsAuth(true);
        router.push('/notes');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle demo login
  const handleDemoLogin = () => {
    if (isLoading) return;
    
    // Set form values
    setValue('username', 'admin');
    setValue('password', 'password');
    
    // Submit the form
    setTimeout(() => {
      onSubmit({ username: 'admin', password: 'password' });
    }, 300);
  };

  // Loading state
  if (isAuth === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a] text-gray-300">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Already authenticated redirect placeholder (handled by useEffect)
  if (isAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a] text-gray-300">
        <div className="animate-pulse">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-gray-300 overflow-hidden">
      {/* Abstract shapes for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-900/10 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[20%] w-[80%] h-[80%] rounded-full bg-cyan-900/10 blur-3xl"></div>
        <div className="absolute top-[10%] right-[30%] w-[10rem] h-[10rem] rounded-full border border-indigo-500/10 opacity-20"></div>
        <div className="absolute bottom-[20%] left-[25%] w-[5rem] h-[5rem] rounded-full border border-cyan-500/20 opacity-30"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative w-full max-w-md mx-auto px-6 py-10 backdrop-blur-sm bg-black/10 rounded-2xl border border-white/5 shadow-2xl z-10">
        {/* App Name with highlight accent */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center">
            <Image 
              src="/file.svg"
              width={35}
              height={35}
              alt="Xnote Logo"
              className="mr-2"
              style={{ filter: "brightness(0) saturate(100%) invert(33%) sepia(93%) saturate(1352%) hue-rotate(222deg) brightness(99%) contrast(96%)" }}
            />
            <h2 className="text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 inline-block">
              Xnote
            </h2>
          </div>
          <p className="text-base text-gray-400 mt-2 tracking-wide">
            Intelligent notes for a smarter workflow
          </p>
        </div>

        {/* Login Form with animated focus effects */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 w-full">
          <div className="relative group">
            <input
              id="username"
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300"
              placeholder="Username"
              disabled={isLoading}
            />
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300"></div>
          </div>
          
          <div className="relative group">
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300"
              placeholder="Password"
              disabled={isLoading}
            />
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300"></div>
          </div>
          
          {/* Modern login button with hover effect */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center font-medium group"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Error Message Area with icon */}
          {(errors.username || errors.password || error) && (
            <div className="flex items-center justify-center space-x-1 text-red-400 text-sm mt-2 bg-red-400/10 py-2 px-3 rounded-md">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span>{error || errors.username?.message || errors.password?.message}</span>
            </div>
          )}
        </form>

        {/* Demo Account Info with improved styling */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs mb-2">Demo account</p>
          <button
            onClick={handleDemoLogin}
            className="inline-block px-3 py-2 rounded-md bg-white/5 border border-white/10 font-mono text-sm text-gray-400 hover:bg-white/10 hover:text-gray-300 transition-all duration-200 cursor-pointer"
            disabled={isLoading}
          >
            admin / password
          </button>
        </div>
      </div>
    </div>
  );
}
