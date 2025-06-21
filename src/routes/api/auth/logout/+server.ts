import { json, type RequestEvent } from '@sveltejs/kit';

export const POST = async ({ cookies }: RequestEvent) => {
	try {
		// Clear the auth token cookie
		cookies.delete('auth_token', { path: '/' });
		
		return json({
			success: true,
			message: 'Logged out successfully'
		});
	} catch (error) {
		console.error('Logout error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
