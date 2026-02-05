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
        // 1. Try to get verified user from server
        let { data: { user }, error } = await supabase.auth.getUser();

        // 2. Fallback to session if network error or checking local state
        if (error || !user) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                user = session.user;
            }
        }

        if (!user) return null;

        const mappedUser = mapSupabaseUser(user);

        // Sync with local storage for faster initial loads elsewhere
        try {
            const { saveUserProfile, getUserProfile } = await import('../utils/storage');

            // Optimization: Only write if different to save IO and avoid quota errors if full
            const currentLocal = getUserProfile();
            const hasChanged = JSON.stringify(currentLocal) !== JSON.stringify(mappedUser);

            if (hasChanged) {
                saveUserProfile(mappedUser);
            }
        } catch (e) {
            // Ignore quota errors here as this is just a cache
            console.warn('Failed to sync user to local storage', e);
        }

        return mappedUser;
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
        const updates: any = {
            data: {}
        };

        if (updatedData.name) updates.data.name = updatedData.name;
        if (updatedData.avatarUrl) updates.data.avatar_url = updatedData.avatarUrl;

        // If email is being updated, it needs to be handled separately in Supabase usually, 
        // but for now let's focus on metadata
        // if (updatedData.email) updates.email = updatedData.email;

        const { error, data } = await supabase.auth.updateUser(updates);

        if (error) throw error;

        // Also update the 'profiles' table which we use for querying other users potentially
        if (data.user) {
            await supabase.from('profiles').update({
                name: updatedData.name || data.user.user_metadata.name,
                avatar_url: updatedData.avatarUrl || data.user.user_metadata.avatar_url
            }).eq('id', data.user.id);
        }

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
