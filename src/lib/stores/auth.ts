import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { AuthUser } from '$lib/types';

interface AuthStore {
	user: AuthUser | null;
	isLoading: boolean;
	isInitialized: boolean;
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable<AuthStore>({
		user: null,
		isLoading: true,
		isInitialized: false
	});

	let currentStore: AuthStore = { user: null, isLoading: true, isInitialized: false };
	subscribe(store => currentStore = store);

	return {
		subscribe,
		
		setUser: (user: AuthUser | null) => {
			update(store => ({ 
				...store, 
				user, 
				isLoading: false, 
				isInitialized: true 
			}));
		},

		setLoading: (isLoading: boolean) => {
			update(store => ({ ...store, isLoading }));
		},

		logout: async () => {
			if (browser) {
				try {
					// Clear token from cookies via API call
					await fetch('/api/auth/logout', { method: 'POST' });
				} catch (error) {
					console.error('Logout error:', error);
				}
			}
			set({ user: null, isLoading: false, isInitialized: true });
		},

		// Initialize auth state
		initialize: async () => {
			if (!browser || currentStore.isInitialized) return;
			
			update(store => ({ ...store, isLoading: true }));
			
			try {
				const response = await fetch('/api/auth/me');
				if (response.ok) {
					const result = await response.json();
					if (result.success && result.data) {
						update(store => ({ 
							...store, 
							user: result.data, 
							isLoading: false, 
							isInitialized: true 
						}));
						return;
					}
				}
			} catch (error) {
				console.error('Auth initialization error:', error);
			}
			
			// If we get here, authentication failed
			update(store => ({ 
				...store, 
				user: null, 
				isLoading: false, 
				isInitialized: true 
			}));
		},

		// Refresh user data
		refresh: async () => {
			if (!browser) return;
			
			try {
				const response = await fetch('/api/auth/me');
				if (response.ok) {
					const result = await response.json();
					if (result.success && result.data) {
						update(store => ({ 
							...store, 
							user: result.data 
						}));
					} else {
						update(store => ({ 
							...store, 
							user: null 
						}));
					}
				}
			} catch (error) {
				console.error('Auth refresh error:', error);
			}
		},

		isLoggedIn: () => {
			return currentStore.user !== null;
		},

		hasRole: (role: 'VENDOR' | 'ADMIN') => {
			return currentStore.user?.role === role;
		},

		isAdmin: () => {
			return currentStore.user?.role === 'ADMIN';
		}
	};
};

export const auth = createAuthStore();
