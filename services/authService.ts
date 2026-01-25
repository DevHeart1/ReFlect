import { UserProfile, DEFAULT_PROFILE } from '../utils/storage';
import { supabase } from '../utils/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Re-export specific types if needed or adapt the User interface
export interface User extends UserProfile {
    id: string;
    joinedDate: string;
}

// Helper to map Supabase user to our app's user structure
const mapSupabaseUser = (u: SupabaseUser): User => {
    return {
        id: u.id,
        name: u.user_metadata.name || 'User',
        email: u.email || '',
        avatarUrl: u.user_metadata.avatar_url || DEFAULT_PROFILE.avatarUrl,
        isPro: false, // Default or fetch from profile table later
        joinedDate: u.created_at || new Date().toISOString()
    };
};

export const authService = {
    // --- Session Management ---

    getCurrentSession: async () => {
        const { data } = await supabase.auth.getSession();
        return data.session;
    },

    getCurrentUser: async (): Promise<User | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        return mapSupabaseUser(user);
    },

    // --- Actions ---

    signup: async (name: string, email: string, password: string): Promise<User> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    avatar_url: DEFAULT_PROFILE.avatarUrl
                }
            }
        });

        if (error) throw error;
        if (!data.user) throw new Error('Signup failed');

        return mapSupabaseUser(data.user);
    },

    login: async (email: string, password: string): Promise<User> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        if (!data.user) throw new Error('Login failed');

        return mapSupabaseUser(data.user);
    },

    loginWithGoogle: async (idToken: string): Promise<User> => {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
        });

        if (error) throw error;
        if (!data.user) throw new Error('Google Login failed');

        return mapSupabaseUser(data.user);
    },

    logout: async () => {
        await supabase.auth.signOut();
        window.dispatchEvent(new Event('auth-change'));
    },

    updateProfile: async (updatedData: Partial<UserProfile>) => {
        const { error } = await supabase.auth.updateUser({
            data: updatedData
        });

        if (error) throw error;
        window.dispatchEvent(new Event('profile-updated'));
    }
};
