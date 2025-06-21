import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import { verifyToken } from '$lib/server/auth';

export const PATCH = async ({ params, request, cookies }: RequestEvent) => {
	try {
		const token = cookies.get('auth_token');
		const payload = verifyToken(token || '');

		if (!payload) {
			return json(
				{ success: false, error: 'Authentication required' },
				{ status: 401 }
			);
		}

		const { id } = params;
		const { status, notes, price, unit } = await request.json();

		// Only admins can approve/reject prices, or vendors can edit their own pending submissions
		const entry = await prisma.priceEntry.findUnique({
			where: { id },
			include: { user: true }
		});

		if (!entry) {
			return json(
				{ success: false, error: 'Price entry not found' },
				{ status: 404 }
			);
		}

		// Check permissions
		const isAdmin = payload.role === 'ADMIN';
		const isOwner = entry.submittedBy === payload.userId;
		const canEdit = isAdmin || (isOwner && entry.status === 'PENDING');

		if (!canEdit) {
			return json(
				{ success: false, error: 'Permission denied' },
				{ status: 403 }
			);
		}

		// Update entry
		const updateData: any = {};
		
		// Admin updates (status and notes)
		if (isAdmin && status) {
			updateData.status = status;
		}
		if (notes !== undefined) {
			updateData.notes = notes;
		}
		
		// Vendor updates (price and unit for PENDING entries)
		if (isOwner && entry.status === 'PENDING') {
			if (price !== undefined) {
				updateData.price = price;
			}
			if (unit !== undefined) {
				updateData.unit = unit;
			}
			// Reset to PENDING when vendor updates (in case admin had made changes)
			updateData.status = 'PENDING';
			updateData.updatedAt = new Date();
		}

		if (Object.keys(updateData).length === 0) {
			return json(
				{ success: false, error: 'No valid updates provided' },
				{ status: 400 }
			);
		}

		const updatedEntry = await prisma.priceEntry.update({
			where: { id },
			data: updateData,
			include: {
				product: {
					include: {
						category: true
					}
				},
				market: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true
					}
				}
			}
		});

		// Send notification to vendor when status changes to APPROVED or REJECTED
		if (status && (status === 'APPROVED' || status === 'REJECTED') && isAdmin) {
			try {
				const notificationData = {
					priceEntryId: updatedEntry.id,
					productName: updatedEntry.product.name,
					marketName: updatedEntry.market.name,
					price: updatedEntry.price,
					adminNotes: notes
				};

				const title = status === 'APPROVED' 
					? '✅ Price Entry Approved' 
					: '❌ Price Entry Rejected';
				
				const message = status === 'APPROVED'
					? `Your price entry for ${notificationData.productName} at ${notificationData.marketName} (₦${notificationData.price.toLocaleString()}) has been approved and is now live on the platform.`
					: `Your price entry for ${notificationData.productName} at ${notificationData.marketName} (₦${notificationData.price.toLocaleString()}) has been rejected. ${notificationData.adminNotes ? `Reason: ${notificationData.adminNotes}` : ''}`;

				// Create notification (cast to any to work around type issues)
				await (prisma as any).notification.create({
					data: {
						userId: updatedEntry.submittedBy,
						type: status === 'APPROVED' ? 'price_approved' : 'price_rejected',
						title,
						message,
						data: notificationData
					}
				});
			} catch (notificationError) {
				console.error('Failed to create notification:', notificationError);
				// Don't fail the main operation if notification fails
			}
		}

		// Send notification to admins when vendor updates their entry
		if (isOwner && (price !== undefined || unit !== undefined)) {
			try {
				// Get all admin users
				const admins = await prisma.user.findMany({
					where: { role: 'ADMIN' },
					select: { id: true }
				});

				const notificationData = {
					priceEntryId: updatedEntry.id,
					productName: updatedEntry.product.name,
					marketName: updatedEntry.market.name,
					price: updatedEntry.price,
					unit: updatedEntry.unit,
					vendorName: updatedEntry.user?.name || 'Unknown'
				};

				const title = '📝 Price Entry Updated';
				const message = `${notificationData.vendorName} has updated their price entry for ${notificationData.productName} at ${notificationData.marketName}. New price: ₦${notificationData.price.toLocaleString()} per ${notificationData.unit}. Please review.`;

				// Create notifications for all admins
				for (const admin of admins) {
					await (prisma as any).notification.create({
						data: {
							userId: admin.id,
							type: 'price_updated',
							title,
							message,
							data: notificationData
						}
					});
				}
			} catch (notificationError) {
				console.error('Failed to create admin notification:', notificationError);
				// Don't fail the main operation if notification fails
			}
		}

		return json({
			success: true,
			data: updatedEntry,
			message: 'Price entry updated successfully'
		});
	} catch (error) {
		console.error('Price entry update error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export const DELETE = async ({ params, cookies }: RequestEvent) => {
	try {
		const token = cookies.get('auth_token');
		const payload = verifyToken(token || '');

		if (!payload) {
			return json(
				{ success: false, error: 'Authentication required' },
				{ status: 401 }
			);
		}

		const { id } = params;

		// Find the entry
		const entry = await prisma.priceEntry.findUnique({
			where: { id }
		});

		if (!entry) {
			return json(
				{ success: false, error: 'Price entry not found' },
				{ status: 404 }
			);
		}

		// Check permissions (admin or owner can delete)
		const isAdmin = payload.role === 'ADMIN';
		const isOwner = entry.submittedBy === payload.userId;

		if (!isAdmin && !isOwner) {
			return json(
				{ success: false, error: 'Permission denied' },
				{ status: 403 }
			);
		}

		// Delete entry (cascades to attachments)
		await prisma.priceEntry.delete({
			where: { id }
		});

		return json({
			success: true,
			message: 'Price entry deleted successfully'
		});
	} catch (error) {
		console.error('Price entry deletion error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
