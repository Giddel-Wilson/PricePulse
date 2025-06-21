import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const GET = async ({ url }: RequestEvent) => {
	try {
		const searchParams = url.searchParams;
		const search = searchParams.get('search') || undefined;
		const categoryId = searchParams.get('categoryId') || undefined;

		const where: any = {};

		if (search) {
			where.name = {
				contains: search
			};
		}

		if (categoryId) {
			where.categoryId = categoryId;
		}

		const products = await prisma.product.findMany({
			where,
			include: {
				category: true
			},
			orderBy: { name: 'asc' }
		});

		return json({
			success: true,
			data: products
		});
	} catch (error) {
		console.error('Products fetch error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
