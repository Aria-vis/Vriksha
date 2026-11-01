import React, { useState, useEffect, ReactNode } from 'react';
import { supabase, isMockClient } from '../lib/supabase';
import { UserProfile } from '../types/plant';
import { AuthContext } from './auth-context-def';

const LOCAL_STORAGE_USER_KEY = 'vriksha_auth_user';
const LOCAL_STORAGE_PROFILE_KEY = 'vriksha_auth_profile';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; phone?: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        if (!isMockClient) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              phone: session.user.phone,
              email: session.user.email,
            });
            // Fetch profile
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (prof) {
              setProfile(prof as UserProfile);
            }
            setIsLoading(false);
            return;
          }
        }

        // Check local storage for mock or guest user
        const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        const storedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (storedUser && storedProfile) {
          const parsedUser = JSON.parse(storedUser);
          const parsedProf = JSON.parse(storedProfile);
          setUser(parsedUser);
          setProfile(parsedProf);
          setIsGuest(parsedProf.username?.startsWith('guest_') || false);
        } else {
          // Default guest session so user can explore seamlessly
          createGuestSession();
        }
      } catch (err) {
        console.error('Error initializing auth session:', err);
        createGuestSession();
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Listen for Supabase auth state changes if connected
    if (!isMockClient) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            phone: session.user.phone,
            email: session.user.email,
          });
          setIsGuest(false);
        } else {
          setUser(null);
          setProfile(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const createGuestSession = (displayName?: string) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const guestUser = {
      id: `guest-${Date.now()}-${randomSuffix}`,
    };
    const guestProfile: UserProfile = {
      id: guestUser.id,
      username: `guest_${randomSuffix}`,
      display_name: displayName || `Guest Contributor #${randomSuffix}`,
      role: 'user',
      points: 0,
      created_at: new Date().toISOString(),
    };
    setUser(guestUser);
    setProfile(guestProfile);
    setIsGuest(true);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestUser));
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(guestProfile));
  };

  const sendPhoneOtp = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isMockClient) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone.startsWith('+') ? phone : `+91${phone}`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      }

      // Mock behavior: simulate sending OTP
      console.log(`[Vriksha Mock Auth] Simulated OTP sent to ${phone}: 123456`);
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Failed to send OTP' };
    }
  };

  const verifyPhoneOtp = async (phone: string, token: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isMockClient) {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phone.startsWith('+') ? phone : `+91${phone}`,
          token,
          type: 'sms',
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          setUser({ id: data.user.id, phone: data.user.phone });
          setIsGuest(false);
        }
        return { success: true };
      }

      // Mock verify: accept any 6-digit number or 123456
      if (token.length !== 6) {
        return { success: false, error: 'Please enter a valid 6-digit OTP' };
      }

      const verifiedUser = {
        id: `usr-phone-${phone.slice(-4)}-${Date.now()}`,
        phone,
      };
      const isModPhone = phone.includes('9999999999') || phone.endsWith('9999');
      const verifiedProfile: UserProfile = {
        id: verifiedUser.id,
        username: isModPhone ? 'community_moderator' : `contributor_${phone.slice(-4)}`,
        display_name: isModPhone ? 'Community Moderator' : `Vriksha Contributor (+91 ${phone.slice(-4)})`,
        role: isModPhone ? 'moderator' : 'user',
        points: (profile?.points || 0) + (isModPhone ? 100 : 10),
        created_at: new Date().toISOString(),
      };

      setUser(verifiedUser);
      setProfile(verifiedProfile);
      setIsGuest(false);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(verifiedUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(verifiedProfile));

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Failed to verify OTP' };
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isMockClient) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      }

      // Mock Google sign-in
      const mockGoogleUser = {
        id: `usr-g-${Date.now()}`,
        email: 'user@example.com',
      };
      const mockGoogleProfile: UserProfile = {
        id: mockGoogleUser.id,
        username: 'green_scout',
        display_name: 'Prakriti Scout',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
        role: 'user',
        points: (profile?.points || 0) + 15,
        created_at: new Date().toISOString(),
      };

      setUser(mockGoogleUser);
      setProfile(mockGoogleProfile);
      setIsGuest(false);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockGoogleUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(mockGoogleProfile));

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Failed to sign in with Google' };
    }
  };

  const continueAsGuest = (displayName?: string) => {
    createGuestSession(displayName);
  };

  const signOut = async () => {
    if (!isMockClient) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    createGuestSession();
  };

  const awardPoints = (amount: number, reason?: string) => {
    if (!profile) return;
    const updatedProfile: UserProfile = {
      ...profile,
      points: (profile.points || 0) + amount,
    };
    setProfile(updatedProfile);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedProfile));
    if (reason) {
      console.log(`[Points Awarded] +${amount} points for "${reason}". Total: ${updatedProfile.points}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user && !isGuest,
        isLoading,
        isGuest,
        sendPhoneOtp,
        verifyPhoneOtp,
        signInWithGoogle,
        continueAsGuest,
        signOut,
        awardPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

