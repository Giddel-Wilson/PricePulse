import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';
import { adminAuthGuard } from '$lib/server/auth-middleware';

export const GET: RequestHandler = async ({ request, cookies }) => {
	// Check admin authentication
	const authResult = await adminAuthGuard(cookies);
	if (authResult) {
		return authResult;
	}

	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				status: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						priceEntries: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		const stats = {
			totalUsers: users.length,
			activeUsers: users.filter(u => u.status === 'ACTIVE').length,
			vendors: users.filter(u => u.role === 'VENDOR').length,
			admins: users.filter(u => u.role === 'ADMIN').length,
			suspendedUsers: users.filter(u => u.status === 'SUSPENDED' || u.status === 'BANNED').length
		};

		return json({ 
			success: true,
			data: users,
			stats 
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		return json({ error: 'Failed to fetch users' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	// Check admin authentication
	const authResult = await adminAuthGuard(cookies);
	if (authResult) {
		return authResult;
	}

	try {
		const { userId, status, role } = await request.json();

		if (!userId) {
			return json({ 
				success: false, 
				error: 'Missing user ID' 
			}, { status: 400 });
		}

		let updateData: any = {};

		if (status) {
			if (!['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
				return json({ 
					success: false, 
					error: 'Invalid status' 
				}, { status: 400 });
			}
			updateData.status = status;
		}

		if (role) {
			if (!['USER', 'VENDOR', 'ADMIN'].includes(role)) {
				return json({ 
					success: false, 
					error: 'Invalid role' 
				}, { status: 400 });
			}
			updateData.role = role;
		}

		if (Object.keys(updateData).length === 0) {
			return json({ 
				success: false, 
				error: 'No update data provided' 
			}, { status: 400 });
		}

		updateData.updatedAt = new Date();

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: updateData,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				status: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						priceEntries: true
					}
				}
			}
		});

		return json({ 
			success: true, 
			data: updatedUser 
		});
	} catch (error) {
		console.error('Error updating user:', error);
		return json({ 
			success: false, 
			error: 'Failed to update user' 
		}, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	// Check admin authentication
	const authResult = await adminAuthGuard(cookies);
	if (authResult) {
		return authResult;
	}

	try {
		const { userId } = await request.json();

		if (!userId) {
			return json({ 
				success: false, 
				error: 'Missing user ID' 
			}, { status: 400 });
		}

		// Delete user (this will cascade delete related records due to Prisma schema)
		await prisma.user.delete({
			where: { id: userId }
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting user:', error);
		return json({ 
			success: false, 
			error: 'Failed to delete user' 
		}, { status: 500 });
	}
};
