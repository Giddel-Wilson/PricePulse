import { json, type RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PATCH = async ({ params, request }: RequestEvent) => {
	try {
		const { id } = params;
		const { status, adminNotes } = await request.json();

		if (!id) {
			return json({ error: 'Message ID is required' }, { status: 400 });
		}

		const updateData: any = {};
		
		if (status) {
			updateData.status = status;
			
			// Set timestamps based on status
			if (status === 'READ' || status === 'READ') {
				updateData.readAt = new Date();
			}
			if (status === 'REPLIED') {
				updateData.repliedAt = new Date();
			}
		}

		if (adminNotes !== undefined) {
			updateData.adminNotes = adminNotes;
		}

		const message = await prisma.contactMessage.update({
			where: { id },
			data: updateData
		});

		return json({ message });
	} catch (error) {
		console.error('Error updating contact message:', error);
		return json(
			{ error: 'Failed to update contact message' },
			{ status: 500 }
		);
	}
};

export const DELETE = async ({ params }: RequestEvent) => {
	try {
		const { id } = params;

		if (!id) {
			return json({ error: 'Message ID is required' }, { status: 400 });
		}

		await prisma.contactMessage.delete({
			where: { id }
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting contact message:', error);
		return json(
			{ error: 'Failed to delete contact message' },
			{ status: 500 }
		);
	}
};
