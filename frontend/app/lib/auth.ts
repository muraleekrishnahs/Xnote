import api from './api';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useCallback } from 'react';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export const login = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    console.log('Attempting login with backend URL:', process.env.NEXT_PUBLIC_API_URL);
    
    // When using the API route, we need to use FormData instead of URLSearchParams
    // This is because the API route expects FormData
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    console.log('Sending login request with credentials');
    
    // Use the Next.js API route instead of direct backend access
    const response = await fetch('/api/token', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      console.error('Login failed with status:', response.status);
      return false;
    }
    
    const data = await response.json();
    
    if (data.access_token) {
      // Store token in localStorage
      localStorage.setItem('token', data.access_token);
      console.log('Login successful, token stored');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    // Check if token is expired
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

export const useAuth = () => {
  const router = useRouter();

  const checkAuth = useCallback(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return false;
    }
    return true;
  }, [router]);

  return { isAuthenticated, login, logout, checkAuth };
}; 