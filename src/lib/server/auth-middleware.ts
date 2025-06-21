import { verifyToken } from './auth';
import { json } from '@sveltejs/kit';
import type { JWTPayload } from '$lib/types';
import type { Cookies } from '@sveltejs/kit';

export interface AuthResult {
	success: boolean;
	user?: JWTPayload;
	error?: string;
}

export async function verifyAuthToken(request: Request): Promise<AuthResult> {
	try {
		const authHeader = request.headers.get('Authorization');
		const cookieHeader = request.headers.get('Cookie');
		
		let token: string | null = null;

		// Check Authorization header first
		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.substring(7);
		}
		// Fallback to cookie
		else if (cookieHeader) {
			const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
				const [name, value] = cookie.trim().split('=');
				acc[name] = value;
				return acc;
			}, {} as Record<string, string>);
			
			token = cookies.auth_token;
		}

		if (!token) {
			return { success: false, error: 'No authentication token provided' };
		}

		const user = verifyToken(token);
		if (!user) {
			return { success: false, error: 'Invalid or expired token' };
		}

		return { success: true, user };
	} catch (error) {
		return { success: false, error: 'Authentication failed' };
	}
}

export async function adminAuthGuard(cookies: Cookies) {
	try {
		const token = cookies.get('auth_token');
		
		if (!token) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const user = verifyToken(token);
		if (!user) {
			return json({ error: 'Invalid or expired token' }, { status: 401 });
		}

		if (user.role !== 'ADMIN') {
			return json({ error: 'Admin access required' }, { status: 403 });
		}

		return null; // No error, auth successful
	} catch (error) {
		return json({ error: 'Authentication failed' }, { status: 401 });
	}
}
