import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import { verifyToken } from '$lib/server/auth';

export const POST = async ({ request }: RequestEvent) => {
	try {
		const { email, type, message } = await request.json();

		if (!email || !type || !message) {
			return json(
				{ success: false, error: 'Email, type, and message are required' },
				{ status: 400 }
			);
		}

		// For now, we'll just return success since we're using frontend notifications
		// In a real app, you might store notifications in the database or send emails
		
		return json({
			success: true,
			message: 'Notification sent successfully'
		});
	} catch (error) {
		console.error('Notification error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export const GET = async ({ url, cookies }: RequestEvent) => {
	try {
		const token = cookies.get('auth_token');
		const email = url.searchParams.get('email');

		// If user is authenticated, get their notifications
		if (token) {
			const payload = verifyToken(token);
			if (payload) {
				const limit = parseInt(url.searchParams.get('limit') || '50');

				// Get user notifications (cast to any to work around type issues)
				const notifications = await (prisma as any).notification.findMany({
					where: { userId: payload.userId },
					orderBy: { createdAt: 'desc' },
					take: limit
				});

				// Get unread count
				const unreadCount = await (prisma as any).notification.count({
					where: { 
						userId: payload.userId,
						read: false 
					}
				});

				return json({
					success: true,
					data: {
						notifications,
						unreadCount
					}
				});
			}
		}

		// Fallback to email-based vendor request notification check
		if (!email) {
			return json(
				{ success: false, error: 'Email is required' },
				{ status: 400 }
			);
		}

		// Check if user has any rejected vendor requests
		const rejectedRequest = await prisma.vendorRequest.findFirst({
			where: {
				email,
				status: 'REJECTED',
				canRequestAgainAt: {
					gt: new Date()
				}
			}
		});

		return json({
			success: true,
			hasRejectionNotification: !!rejectedRequest,
			data: rejectedRequest
		});
	} catch (error) {
		console.error('Notification check error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export const PATCH = async ({ request, cookies }: RequestEvent) => {
	try {
		const token = cookies.get('auth_token');
		const payload = verifyToken(token || '');

		if (!payload) {
			return json(
				{ success: false, error: 'Authentication required' },
				{ status: 401 }
			);
		}

		const { notificationId, markAllAsRead } = await request.json();

		if (markAllAsRead) {
			// Mark all notifications as read for the user
			await (prisma as any).notification.updateMany({
				where: { userId: payload.userId },
				data: { read: true }
			});
		} else if (notificationId) {
			// Mark specific notification as read
			await (prisma as any).notification.updateMany({
				where: { 
					id: notificationId,
					userId: payload.userId // Ensure user can only mark their own notifications
				},
				data: { read: true }
			});
		}

		return json({
			success: true,
			message: 'Notifications updated successfully'
		});
	} catch (error) {
		console.error('Notification update error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
