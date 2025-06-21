import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import { verifyAuthToken } from '$lib/server/auth-middleware';

export const GET = async ({ request }: RequestEvent) => {
	const authResult = await verifyAuthToken(request);
	if (!authResult.success || !authResult.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	if (authResult.user.role !== 'ADMIN') {
		return json({ success: false, error: 'Forbidden' }, { status: 403 });
	}

	try {
		const requests = await prisma.vendorRequest.findMany({
			orderBy: { createdAt: 'desc' }
		});

		return json({
			success: true,
			data: requests
		});
	} catch (error) {
		console.error('Admin vendor requests fetch error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export const PATCH = async ({ request }: RequestEvent) => {
	const authResult = await verifyAuthToken(request);
	if (!authResult.success || !authResult.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	if (authResult.user.role !== 'ADMIN') {
		return json({ success: false, error: 'Forbidden' }, { status: 403 });
	}

	try {
		const { id, status, adminNotes } = await request.json();

		if (!id || !status) {
			return json(
				{ success: false, error: 'ID and status are required' },
				{ status: 400 }
			);
		}

		const updatedRequest = await prisma.vendorRequest.update({
			where: { id },
			data: {
				status,
				adminNotes,
				reviewedAt: new Date(),
				reviewedBy: authResult.user.userId,
				// If rejected, set cooldown period (24 hours from now)
				canRequestAgainAt: status === 'REJECTED' 
					? new Date(Date.now() + 24 * 60 * 60 * 1000) 
					: undefined
			}
		});

		// If approved, update user role to VENDOR
		if (status === 'APPROVED') {
			await prisma.user.updateMany({
				where: { email: updatedRequest.email },
				data: { role: 'VENDOR' }
			});
		}

		return json({
			success: true,
			data: updatedRequest
		});
	} catch (error) {
		console.error('Admin vendor request update error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
