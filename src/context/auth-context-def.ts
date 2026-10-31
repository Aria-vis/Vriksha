import { createContext } from 'react';
import { UserProfile } from '../types/plant';

export interface AuthContextType {
  user: { id: string; phone?: string; email?: string } | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: (displayName?: string) => void;
  signOut: () => Promise<void>;
  awardPoints: (amount: number, reason?: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
