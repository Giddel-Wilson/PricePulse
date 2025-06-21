import { prisma } from '$lib/server/db';

export interface NotificationData {
	priceEntryId: string;
	productName: string;
	marketName: string;
	price: number;
	adminNotes?: string;
}

export async function createPriceStatusNotification(
	userId: string,
	status: 'APPROVED' | 'REJECTED',
	data: NotificationData
) {
	const title = status === 'APPROVED' 
		? '✅ Price Entry Approved' 
		: '❌ Price Entry Rejected';
	
	const message = status === 'APPROVED'
		? `Your price entry for ${data.productName} at ${data.marketName} (₦${data.price.toLocaleString()}) has been approved and is now live on the platform.`
		: `Your price entry for ${data.productName} at ${data.marketName} (₦${data.price.toLocaleString()}) has been rejected. ${data.adminNotes ? `Reason: ${data.adminNotes}` : ''}`;

	try {
		const notification = await prisma.notification.create({
			data: {
				userId,
				type: status === 'APPROVED' ? 'price_approved' : 'price_rejected',
				title,
				message,
				data: {
					priceEntryId: data.priceEntryId,
					productName: data.productName,
					marketName: data.marketName,
					price: data.price,
					adminNotes: data.adminNotes,
					status
				}
			}
		});

		return notification;
	} catch (error) {
		console.error('Failed to create notification:', error);
		throw error;
	}
}

export async function getUserNotifications(userId: string, limit = 50) {
	try {
		const notifications = await prisma.notification.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			take: limit
		});

		return notifications;
	} catch (error) {
		console.error('Failed to get user notifications:', error);
		throw error;
	}
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
	try {
		const notification = await prisma.notification.updateMany({
			where: { 
				id: notificationId,
				userId // Ensure user can only mark their own notifications as read
			},
			data: { read: true }
		});

		return notification;
	} catch (error) {
		console.error('Failed to mark notification as read:', error);
		throw error;
	}
}

export async function getUnreadNotificationCount(userId: string) {
	try {
		const count = await prisma.notification.count({
			where: { 
				userId,
				read: false 
			}
		});

		return count;
	} catch (error) {
		console.error('Failed to get unread notification count:', error);
		throw error;
	}
}
