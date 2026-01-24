import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { User } from '@website-next/auth/types';
import { createClient } from '@website-next/auth/supabase/client';
import { getAuthConfig } from '@/lib/auth-init';

interface UserContextType {
  currentUser: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function isSupabaseConfigured(): boolean {
  const config = getAuthConfig();
  return !!(config.supabase?.url && config.supabase?.publishableKey);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  const fetchUser = async () => {
    if (!isSupabaseConfigured()) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      const config = getAuthConfig();
      const supabase = await createClient(config);

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user as User | null);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debugger;
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    fetchUser()

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  return (
    <UserContext.Provider value={{ currentUser, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
