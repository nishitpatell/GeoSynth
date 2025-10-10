/**
 * Auth Context
 * Provides authentication state to the entire app
 */

import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/core/api/client/supabaseClient';
import { logger } from '@/core/logger/logger';
import { authService } from '../services/authService';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const session = await authService.getCurrentSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        logger.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.debug('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signOut: authService.signOut.bind(authService),
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
