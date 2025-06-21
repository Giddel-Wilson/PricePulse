import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import { verifyToken, createAuthUser } from '$lib/server/auth';

export const GET = async ({ cookies }: RequestEvent) => {
	try {
		const token = cookies.get('auth_token');
		
		if (!token) {
			return json(
				{ success: false, error: 'No token provided' },
				{ status: 401 }
			);
		}

		// Verify token
		const payload = verifyToken(token);
		if (!payload) {
			return json(
				{ success: false, error: 'Invalid token' },
				{ status: 401 }
			);
		}

		// Find user
		const user = await prisma.user.findUnique({
			where: { id: payload.userId }
		});

		if (!user || user.status !== 'ACTIVE') {
			return json(
				{ success: false, error: 'User not found or inactive' },
				{ status: 401 }
			);
		}

		return json({
			success: true,
			data: createAuthUser(user)
		});
	} catch (error) {
		console.error('Me endpoint error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
