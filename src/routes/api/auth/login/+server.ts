import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import { verifyPassword, createAuthUser, generateToken } from '$lib/server/auth';

export const POST = async ({ request, cookies }: RequestEvent) => {
	try {
		const { email, password } = await request.json();

		// Validation
		if (!email || !password) {
			return json(
				{ success: false, error: 'Email and password are required' },
				{ status: 400 }
			);
		}

		// Find user
		const user = await prisma.user.findUnique({
			where: { email }
		});

		if (!user) {
			return json(
				{ success: false, error: 'Invalid email or password' },
				{ status: 401 }
			);
		}

		// Check if user is active
		if (user.status !== 'ACTIVE') {
			return json(
				{ success: false, error: 'Account is suspended. Please contact support.' },
				{ status: 403 }
			);
		}

		// Verify password
		const isValidPassword = await verifyPassword(password, user.passwordHash);
		if (!isValidPassword) {
			return json(
				{ success: false, error: 'Invalid email or password' },
				{ status: 401 }
			);
		}

		// Generate token and set cookie
		const token = generateToken(user);
		cookies.set('auth_token', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		return json({
			success: true,
			data: createAuthUser(user),
			message: 'Login successful'
		});
	} catch (error) {
		console.error('Login error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
