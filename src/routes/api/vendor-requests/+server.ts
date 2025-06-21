import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { VendorRequest } from '$lib/types';

export const POST = async ({ request }: RequestEvent) => {
	try {
		const { email, message } = await request.json();

		if (!email) {
			return json(
				{ success: false, error: 'Email is required' },
				{ status: 400 }
			);
		}

		// Check if user already has a pending request
		const existingRequest = await prisma.vendorRequest.findUnique({
			where: { email }
		});

		if (existingRequest) {
			if (existingRequest.status === 'PENDING') {
				return json({
					success: false,
					error: 'You already have a pending vendor request'
				});
			} else if (existingRequest.status === 'APPROVED') {
				return json({
					success: false,
					error: 'Your vendor request has already been approved'
				});
			} else if (existingRequest.status === 'REJECTED' && existingRequest.canRequestAgainAt) {
				const now = new Date();
				if (now < existingRequest.canRequestAgainAt) {
					const timeRemaining = Math.ceil((existingRequest.canRequestAgainAt.getTime() - now.getTime()) / (1000 * 60 * 60)); // hours
					return json({
						success: false,
						error: `Your previous request was rejected. You can request again in ${timeRemaining} hours.`,
						canRequestAgainAt: existingRequest.canRequestAgainAt
					});
				}
			}
		}

		// Create or update the request
		const vendorRequest = await prisma.vendorRequest.upsert({
			where: { email },
			update: {
				message,
				status: 'PENDING',
				adminNotes: null,
				reviewedAt: null,
				reviewedBy: null,
				canRequestAgainAt: null
			},
			create: {
				email,
				message
			}
		});

		return json({
			success: true,
			data: vendorRequest
		});
	} catch (error) {
		console.error('Vendor request error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export const GET = async ({ url }: RequestEvent) => {
	try {
		const email = url.searchParams.get('email');

		if (!email) {
			return json(
				{ success: false, error: 'Email is required' },
				{ status: 400 }
			);
		}

		const vendorRequest = await prisma.vendorRequest.findUnique({
			where: { email }
		});

		let canRequest = true;
		let timeRemaining = 0;

		if (vendorRequest?.status === 'REJECTED' && vendorRequest.canRequestAgainAt) {
			const now = new Date();
			if (now < vendorRequest.canRequestAgainAt) {
				canRequest = false;
				timeRemaining = Math.ceil((vendorRequest.canRequestAgainAt.getTime() - now.getTime()) / 1000); // seconds
			}
		}

		return json({
			success: true,
			data: vendorRequest,
			canRequest,
			timeRemaining
		});
	} catch (error) {
		console.error('Vendor request check error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
