import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import { verifyToken } from '$lib/server/auth';
import { calculatePagination, createPaginatedResponse } from '$lib/utils';

export const GET = async ({ url, cookies }: RequestEvent) => {
	try {
		const token = cookies.get('auth_token');
		const payload = token ? verifyToken(token) : null;

		// Get search parameters
		const searchParams = url.searchParams;
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');
		const productName = searchParams.get('productName')?.trim() || undefined;
		const categoryId = searchParams.get('categoryId')?.trim() || undefined;
		const marketId = searchParams.get('marketId')?.trim() || undefined;
		const region = searchParams.get('region')?.trim() || undefined;
		const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
		const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
		const status = searchParams.get('status') || undefined;

		// Build where clause with proper nested filtering
		const where: any = {};

		// Handle status filtering
		if (payload?.role === 'ADMIN') {
			// Admin can see all statuses or filter by specific status
			if (status && status !== 'ALL') {
				where.status = status;
			}
			// If status is 'ALL' or not provided for admin, don't filter by status
		} else if (payload?.role === 'VENDOR' && payload?.userId) {
			// Vendors can see:
			// 1. All APPROVED entries (public)
			// 2. Their own entries regardless of status
			where.OR = [
				{ status: 'APPROVED' },
				{ submittedBy: payload.userId }
			];
		} else {
			// Non-authenticated users and regular users only see approved entries
			where.status = 'APPROVED';
		}

		// Product name and category filtering
		if (productName || categoryId) {
			where.product = {};
			
			if (productName) {
				where.product.name = {
					contains: productName
				};
			}
			
			if (categoryId) {
				where.product.categoryId = categoryId;
			}
		}

		// Market filtering
		if (marketId) {
			where.marketId = marketId;
		} else if (region) {
			// Only filter by region if no specific market is selected
			where.market = {
				region: {
					contains: region
				}
			};
		}

		// Price range filtering
		if (minPrice !== undefined || maxPrice !== undefined) {
			where.price = {};
			if (minPrice !== undefined) where.price.gte = minPrice;
			if (maxPrice !== undefined) where.price.lte = maxPrice;
		}

		// Calculate pagination
		const { skip, take } = calculatePagination(page, limit);

		// Get total count
		const total = await prisma.priceEntry.count({ where });

		// Get entries with relations
		const entries = await prisma.priceEntry.findMany({
			where,
			skip,
			take,
			orderBy: { createdAt: 'desc' },
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

		return json({
			success: true,
			data: createPaginatedResponse(entries, page, limit, total)
		});
	} catch (error) {
		console.error('Price entries fetch error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export const POST = async ({ request, cookies }: RequestEvent) => {
	try {
		const token = cookies.get('auth_token');
		const payload = verifyToken(token || '');

		if (!payload) {
			return json(
				{ success: false, error: 'Authentication required' },
				{ status: 401 }
			);
		}

		// Check current user role from database (not from JWT token which might be outdated)
		const currentUser = await prisma.user.findUnique({
			where: { id: payload.userId },
			select: { role: true, status: true }
		});

		if (!currentUser || currentUser.status !== 'ACTIVE') {
			return json(
				{ success: false, error: 'User not found or inactive' },
				{ status: 401 }
			);
		}

		// Only vendors and admins can submit prices
		const userRole = String(currentUser.role);
		if (userRole !== 'VENDOR' && userRole !== 'ADMIN') {
			console.log('🚫 Role check failed:', {
				actualRole: userRole,
				userId: payload.userId,
				email: payload.email,
				jwtRole: String(payload.role)
			});
			return json(
				{ success: false, error: `Only vendors can submit prices. Your current role: ${userRole}` },
				{ status: 403 }
			);
		}

		console.log('✅ Role check passed:', {
			userRole,
			userId: payload.userId,
			email: payload.email,
			jwtRole: String(payload.role)
		});

		const body = await request.json();
		const { productId, marketId, price, unit, notes, customProduct, customMarket, isUpdate, originalEntryId } = body;

		// Validation
		if ((!productId && !customProduct) || (!marketId && !customMarket) || !price || !unit) {
			return json(
				{ success: false, error: 'Product, market, price, and unit are required' },
				{ status: 400 }
			);
		}

		if (price <= 0) {
			return json(
				{ success: false, error: 'Price must be greater than 0' },
				{ status: 400 }
			);
		}

		// If this is an update from vendor, verify they own the original entry
		if (isUpdate && originalEntryId) {
			const originalEntry = await prisma.priceEntry.findUnique({
				where: { id: originalEntryId },
				select: { submittedBy: true, status: true }
			});

			if (!originalEntry) {
				return json(
					{ success: false, error: 'Original entry not found' },
					{ status: 404 }
				);
			}

			if (originalEntry.submittedBy !== payload.userId) {
				return json(
					{ success: false, error: 'You can only update your own entries' },
					{ status: 403 }
				);
			}

			if (originalEntry.status !== 'APPROVED') {
				return json(
					{ success: false, error: 'You can only update approved entries' },
					{ status: 400 }
				);
			}
		}

		let finalProductId = productId;
		let finalMarketId = marketId;

		// Handle custom product creation
		if (customProduct && !productId) {
			if (!customProduct.name || !customProduct.categoryId || !customProduct.unit) {
				return json(
					{ success: false, error: 'Custom product requires name, category, and unit' },
					{ status: 400 }
				);
			}

			// Check if category exists
			const category = await prisma.category.findUnique({
				where: { id: customProduct.categoryId }
			});

			if (!category) {
				return json(
					{ success: false, error: 'Category not found' },
					{ status: 404 }
				);
			}

			// Create new product
			const newProduct = await prisma.product.create({
				data: {
					name: customProduct.name.trim(),
					categoryId: customProduct.categoryId,
					unit: customProduct.unit.trim()
				}
			});

			finalProductId = newProduct.id;
		}

		// Handle custom market creation
		if (customMarket && !marketId) {
			if (!customMarket.name || !customMarket.location || !customMarket.region) {
				return json(
					{ success: false, error: 'Custom market requires name, location, and region' },
					{ status: 400 }
				);
			}

			// Create new market
			const newMarket = await prisma.market.create({
				data: {
					name: customMarket.name.trim(),
					location: customMarket.location.trim(),
					region: customMarket.region.trim()
				}
			});

			finalMarketId = newMarket.id;
		}

		// Check if product and market exist (for existing ones)
		const [product, market] = await Promise.all([
			finalProductId ? prisma.product.findUnique({ where: { id: finalProductId } }) : null,
			finalMarketId ? prisma.market.findUnique({ where: { id: finalMarketId } }) : null
		]);

		if (!product) {
			return json(
				{ success: false, error: 'Product not found' },
				{ status: 404 }
			);
		}

		if (!market) {
			return json(
				{ success: false, error: 'Market not found' },
				{ status: 404 }
			);
		}

		// Create price entry
		let finalNotes = notes;
		
		// If this is an update, enhance the notes
		if (isUpdate && originalEntryId) {
			finalNotes = notes ? 
				`Price update: ${notes}` : 
				'Price update submitted by vendor';
		}

		const entry = await prisma.priceEntry.create({
			data: {
				productId: finalProductId,
				marketId: finalMarketId,
				price,
				unit,
				notes: finalNotes,
				submittedBy: payload.userId,
				status: currentUser.role === 'ADMIN' ? 'APPROVED' : 'PENDING'
			},
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

		// If this is an update, create a notification for admins
		if (isUpdate && originalEntryId) {
			try {
				const admins = await prisma.user.findMany({
					where: { role: 'ADMIN' },
					select: { id: true }
				});

				for (const admin of admins) {
					await prisma.notification.create({
						data: {
							userId: admin.id,
							type: 'vendor_price_update',
							title: 'Vendor Price Update',
							message: `${entry.user.name} submitted an update for ${entry.product.name} at ${entry.market.name} (₦${entry.price.toLocaleString()})`,
							read: false
						}
					});
				}
			} catch (notificationError) {
				console.error('Failed to create admin notifications:', notificationError);
				// Don't fail the entire request if notifications fail
			}
		}

		return json({
			success: true,
			data: entry,
			message: isUpdate ? 'Price update submitted successfully' : 'Price entry submitted successfully'
		});
	} catch (error) {
		console.error('Price entry creation error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
