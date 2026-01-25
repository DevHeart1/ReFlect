import { UserProfile, DEFAULT_PROFILE } from '../utils/storage';
import { jwtDecode } from 'jwt-decode';

const USERS_KEY = 'reflect_users';
const SESSION_KEY = 'reflect_session';

export interface User extends UserProfile {
    id: string;
    passwordHash: string;
    joinedDate: string;
}

// Simple hash function (for local-only security simulation)
const hashPassword = async (password: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const authService = {
    // --- Session Management ---

    getCurrentSession: (): string | null => {
        return localStorage.getItem(SESSION_KEY);
    },

    getCurrentUser: (): User | null => {
        const sessionId = localStorage.getItem(SESSION_KEY);
        if (!sessionId) return null;

        const users = authService.getUsers();
        return users.find(u => u.id === sessionId) || null;
    },

    getUsers: (): User[] => {
        try {
            const data = localStorage.getItem(USERS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    // --- Actions ---

    signup: async (name: string, email: string, password: string): Promise<User> => {
        const users = authService.getUsers();
        if (users.some(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const passwordHash = await hashPassword(password);
        const newUser: User = {
            id: crypto.randomUUID(),
            name,
            email,
            passwordHash,
            avatarUrl: DEFAULT_PROFILE.avatarUrl,
            isPro: false,
            joinedDate: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Auto login
        localStorage.setItem(SESSION_KEY, newUser.id);
        return newUser;
    },

    login: async (email: string, password: string): Promise<User> => {
        const users = authService.getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const passwordHash = await hashPassword(password);
        if (user.passwordHash !== passwordHash) {
            throw new Error('Invalid credentials');
        }

        localStorage.setItem(SESSION_KEY, user.id);
        return user;
    },

    loginWithGoogle: async (token: string): Promise<User> => {
        try {
            const decoded: any = jwtDecode(token);

            const email = decoded.email;
            const name = decoded.name;
            const avatarUrl = decoded.picture;

            // Check if user exists
            const users = authService.getUsers();
            let user = users.find(u => u.email === email);

            if (!user) {
                // Create new user automatically from Google data
                user = {
                    id: crypto.randomUUID(),
                    name,
                    email,
                    passwordHash: '', // No password for Google users
                    avatarUrl: avatarUrl || DEFAULT_PROFILE.avatarUrl,
                    isPro: false,
                    joinedDate: new Date().toISOString()
                };
                users.push(user);
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
            } else {
                // Update avatar if changed (optional)
                if (avatarUrl && user.avatarUrl !== avatarUrl) {
                    user.avatarUrl = avatarUrl;
                    localStorage.setItem(USERS_KEY, JSON.stringify(users));
                }
            }

            localStorage.setItem(SESSION_KEY, user.id);
            return user;
        } catch (e) {
            console.error('Google login error', e);
            throw new Error('Failed to login with Google');
        }
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    updateProfile: (updatedData: Partial<UserProfile>) => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return;

        const users = authService.getUsers();
        const index = users.findIndex(u => u.id === currentUser.id);

        if (index !== -1) {
            users[index] = { ...users[index], ...updatedData };
            localStorage.setItem(USERS_KEY, JSON.stringify(users));

            // Also update session triggered events if needed
            window.dispatchEvent(new Event('profile-updated'));
        }
    }
};
