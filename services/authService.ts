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

    loginWithGoogle: async (idToken: string): Promise<{ user: User; isNewUser: boolean }> => {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
        });

        if (error) throw error;
        if (!data.user) throw new Error('Google Login failed');

        // Clear legacy session markers just in case
        localStorage.removeItem('reflect_session');

        // Check if user has a profile in the database
        // If no profile exists, this is a new user who needs onboarding
        let isNewUser = false;
        try {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .single();

            // If no profile exists, it's a new user
            isNewUser = !profileData;

            // Create profile for new users
            if (isNewUser) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata.name || 'User',
                    avatar_url: data.user.user_metadata.avatar_url || '',
                    is_pro: false
                });
            }
        } catch (e) {
            // If profile doesn't exist, treat as new user
            isNewUser = true;
        }

        return {
            user: mapSupabaseUser(data.user),
            isNewUser
        };
    },

    logout: async () => {
        await supabase.auth.signOut();

        // Clear legacy local storage to prevent stale data
        localStorage.removeItem('reflect_session');
        localStorage.removeItem('reflect_users');
        localStorage.removeItem('reflect_user_profile');
        localStorage.removeItem('reflect_app_settings');
        // entries and moods might be migrated, so maybe keep them or clear if we want fresh start?
        // Let's clear profile/session at least.

        window.dispatchEvent(new Event('auth-change'));
        window.location.reload(); // Force reload to clear any in-memory state
    },

    updateProfile: async (updatedData: Partial<UserProfile>) => {
        const { error } = await supabase.auth.updateUser({
            data: updatedData
        });

        if (error) throw error;
        window.dispatchEvent(new Event('profile-updated'));
    },

    deleteAccount: async () => {
        // Get current user before deleting
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        // Delete all user data from tables first
        await supabase.from('journal_entries').delete().eq('user_id', user.id);
        await supabase.from('mood_checkins').delete().eq('user_id', user.id);
        await supabase.from('user_settings').delete().eq('user_id', user.id);
        await supabase.from('profiles').delete().eq('id', user.id);

        // Call the database function to delete the user from auth.users
        // This requires the SQL function to be created in Supabase first
        const { error: rpcError } = await supabase.rpc('delete_user');

        if (rpcError) {
            console.error('Failed to delete auth user:', rpcError);
            // Even if RPC fails, we've deleted their data
        }

        // Sign out
        await supabase.auth.signOut();

        // Clear all local data
        localStorage.clear();

        window.location.href = '/';
    }
};
