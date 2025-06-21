import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

async function seed() {
	console.log('🌱 Starting database seeding...');

	try {
		// Clear existing data
		console.log('🧹 Cleaning existing data...');
		await prisma.attachment.deleteMany();
		await prisma.priceEntry.deleteMany();
		await prisma.product.deleteMany();
		await prisma.category.deleteMany();
		await prisma.market.deleteMany();
		await prisma.user.deleteMany();

		// Create categories
		console.log('📂 Creating categories...');
		const categories = await Promise.all([
			prisma.category.create({
				data: { name: 'Foodstuffs' }
			}),
			prisma.category.create({
				data: { name: 'Grains & Cereals' }
			}),
			prisma.category.create({
				data: { name: 'Vegetables' }
			}),
			prisma.category.create({
				data: { name: 'Fruits' }
			}),
			prisma.category.create({
				data: { name: 'Protein' }
			}),
			prisma.category.create({
				data: { name: 'Building Materials' }
			}),
			prisma.category.create({
				data: { name: 'Electronics' }
			})
		]);

		// Create markets
		console.log('🏪 Creating markets...');
		const markets = await Promise.all([
			prisma.market.create({
				data: {
					name: 'Mile 12 Market',
					location: 'Ketu, Lagos',
					region: 'Lagos State'
				}
			}),
			prisma.market.create({
				data: {
					name: 'Bodija Market',
					location: 'Ibadan',
					region: 'Oyo State'
				}
			}),
			prisma.market.create({
				data: {
					name: 'Kurmi Market',
					location: 'Kano',
					region: 'Kano State'
				}
			}),
			prisma.market.create({
				data: {
					name: 'New Benin Market',
					location: 'Benin City',
					region: 'Edo State'
				}
			}),
			prisma.market.create({
				data: {
					name: 'Ariaria Market',
					location: 'Aba',
					region: 'Abia State'
				}
			}),
			prisma.market.create({
				data: {
					name: 'Wuse Market',
					location: 'Abuja',
					region: 'FCT'
				}
			})
		]);

		// Create products
		console.log('🛍️ Creating products...');
		const products = await Promise.all([
			// Grains & Cereals
			prisma.product.create({
				data: {
					name: 'Rice (Local)',
					categoryId: categories[1].id,
					unit: 'per bag (50kg)'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Rice (Foreign)',
					categoryId: categories[1].id,
					unit: 'per bag (50kg)'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Beans (Brown)',
					categoryId: categories[1].id,
					unit: 'per bag (100kg)'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Maize',
					categoryId: categories[1].id,
					unit: 'per bag (100kg)'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Wheat',
					categoryId: categories[1].id,
					unit: 'per bag (100kg)'
				}
			}),

			// Vegetables
			prisma.product.create({
				data: {
					name: 'Tomatoes',
					categoryId: categories[2].id,
					unit: 'per basket'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Onions',
					categoryId: categories[2].id,
					unit: 'per bag (100kg)'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Pepper (Red)',
					categoryId: categories[2].id,
					unit: 'per basket'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Yam',
					categoryId: categories[2].id,
					unit: 'per tuber'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Sweet Potato',
					categoryId: categories[2].id,
					unit: 'per bag (100kg)'
				}
			}),

			// Fruits
			prisma.product.create({
				data: {
					name: 'Plantain',
					categoryId: categories[3].id,
					unit: 'per bunch'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Banana',
					categoryId: categories[3].id,
					unit: 'per bunch'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Orange',
					categoryId: categories[3].id,
					unit: 'per basket'
				}
			}),

			// Protein
			prisma.product.create({
				data: {
					name: 'Beef',
					categoryId: categories[4].id,
					unit: 'per kg'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Chicken',
					categoryId: categories[4].id,
					unit: 'per kg'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Fish (Catfish)',
					categoryId: categories[4].id,
					unit: 'per kg'
				}
			}),

			// Building Materials
			prisma.product.create({
				data: {
					name: 'Cement',
					categoryId: categories[5].id,
					unit: 'per bag (50kg)'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Iron Rods (12mm)',
					categoryId: categories[5].id,
					unit: 'per length'
				}
			}),
			prisma.product.create({
				data: {
					name: 'Blocks (6 inch)',
					categoryId: categories[5].id,
					unit: 'per piece'
				}
			})
		]);

		// Create users
		console.log('👥 Creating users...');
		const adminPassword = await hashPassword('password123');
		const vendorPassword = await hashPassword('password123');
		const userPassword = await hashPassword('password123');

		const admin = await prisma.user.create({
			data: {
				name: 'Admin User',
				email: 'admin@demo.com',
				passwordHash: adminPassword,
				role: 'ADMIN'
			}
		});

		const vendors = await Promise.all([
			prisma.user.create({
				data: {
					name: 'John Vendor',
					email: 'vendor@demo.com',
					passwordHash: vendorPassword,
					role: 'VENDOR'
				}
			}),
			prisma.user.create({
				data: {
					name: 'Mary Trader',
					email: 'mary@demo.com',
					passwordHash: vendorPassword,
					role: 'VENDOR'
				}
			}),
			prisma.user.create({
				data: {
					name: 'Ahmed Seller',
					email: 'ahmed@demo.com',
					passwordHash: vendorPassword,
					role: 'VENDOR'
				}
			})
		]);

		// Create regular users
		const users = await Promise.all([
			prisma.user.create({
				data: {
					name: 'Sarah Customer',
					email: 'user@demo.com',
					passwordHash: userPassword,
					role: 'USER' as any
				}
			}),
			prisma.user.create({
				data: {
					name: 'Michael Brown',
					email: 'michael@demo.com',
					passwordHash: userPassword,
					role: 'USER' as any
				}
			}),
			prisma.user.create({
				data: {
					name: 'Jennifer Wilson',
					email: 'jennifer@demo.com',
					passwordHash: userPassword,
					role: 'USER' as any
				}
			})
		]);

		// Create sample price entries
		console.log('💰 Creating price entries...');
		const samplePrices = [
			// Rice prices across markets
			{ productName: 'Rice (Local)', marketName: 'Mile 12 Market', price: 45000, unit: 'per bag (50kg)', vendorIndex: 0, status: 'APPROVED' },
			{ productName: 'Rice (Local)', marketName: 'Bodija Market', price: 42000, unit: 'per bag (50kg)', vendorIndex: 1, status: 'APPROVED' },
			{ productName: 'Rice (Local)', marketName: 'Kurmi Market', price: 40000, unit: 'per bag (50kg)', vendorIndex: 2, status: 'APPROVED' },
			
			{ productName: 'Rice (Foreign)', marketName: 'Mile 12 Market', price: 52000, unit: 'per bag (50kg)', vendorIndex: 0, status: 'APPROVED' },
			{ productName: 'Rice (Foreign)', marketName: 'Wuse Market', price: 51000, unit: 'per bag (50kg)', vendorIndex: 1, status: 'APPROVED' },
			
			// Beans
			{ productName: 'Beans (Brown)', marketName: 'Mile 12 Market', price: 95000, unit: 'per bag (100kg)', vendorIndex: 0, status: 'APPROVED' },
			{ productName: 'Beans (Brown)', marketName: 'Bodija Market', price: 92000, unit: 'per bag (100kg)', vendorIndex: 1, status: 'APPROVED' },
			{ productName: 'Beans (Brown)', marketName: 'Kurmi Market', price: 88000, unit: 'per bag (100kg)', vendorIndex: 2, status: 'PENDING' },
			
			// Vegetables
			{ productName: 'Tomatoes', marketName: 'Mile 12 Market', price: 8000, unit: 'per basket', vendorIndex: 0, status: 'APPROVED' },
			{ productName: 'Tomatoes', marketName: 'New Benin Market', price: 7500, unit: 'per basket', vendorIndex: 1, status: 'APPROVED' },
			{ productName: 'Tomatoes', marketName: 'Ariaria Market', price: 7200, unit: 'per basket', vendorIndex: 2, status: 'APPROVED' },
			
			{ productName: 'Onions', marketName: 'Kurmi Market', price: 35000, unit: 'per bag (100kg)', vendorIndex: 2, status: 'APPROVED' },
			{ productName: 'Onions', marketName: 'Mile 12 Market', price: 38000, unit: 'per bag (100kg)', vendorIndex: 0, status: 'APPROVED' },
			
			{ productName: 'Yam', marketName: 'Bodija Market', price: 1500, unit: 'per tuber', vendorIndex: 1, status: 'APPROVED' },
			{ productName: 'Yam', marketName: 'New Benin Market', price: 1200, unit: 'per tuber', vendorIndex: 1, status: 'APPROVED' },
			
			// Fruits
			{ productName: 'Plantain', marketName: 'Mile 12 Market', price: 2500, unit: 'per bunch', vendorIndex: 0, status: 'APPROVED' },
			{ productName: 'Plantain', marketName: 'Ariaria Market', price: 2200, unit: 'per bunch', vendorIndex: 2, status: 'APPROVED' },
			
			// Protein
			{ productName: 'Beef', marketName: 'Mile 12 Market', price: 3500, unit: 'per kg', vendorIndex: 0, status: 'APPROVED' },
			{ productName: 'Beef', marketName: 'Wuse Market', price: 3800, unit: 'per kg', vendorIndex: 1, status: 'APPROVED' },
			
			{ productName: 'Chicken', marketName: 'Mile 12 Market', price: 2800, unit: 'per kg', vendorIndex: 0, status: 'APPROVED' },
			{ productName: 'Chicken', marketName: 'Bodija Market', price: 2600, unit: 'per kg', vendorIndex: 1, status: 'PENDING' },
			
			// Building Materials
			{ productName: 'Cement', marketName: 'Mile 12 Market', price: 5200, unit: 'per bag (50kg)', vendorIndex: 0, status: 'APPROVED' },
			{ productName: 'Cement', marketName: 'Ariaria Market', price: 4800, unit: 'per bag (50kg)', vendorIndex: 2, status: 'APPROVED' },
			
			{ productName: 'Iron Rods (12mm)', marketName: 'Ariaria Market', price: 4500, unit: 'per length', vendorIndex: 2, status: 'APPROVED' },
			{ productName: 'Blocks (6 inch)', marketName: 'New Benin Market', price: 180, unit: 'per piece', vendorIndex: 1, status: 'APPROVED' }
		];

		for (const priceData of samplePrices) {
			const product = products.find(p => p.name === priceData.productName);
			const market = markets.find(m => m.name === priceData.marketName);
			const vendor = vendors[priceData.vendorIndex];

			if (product && market && vendor) {
				await prisma.priceEntry.create({
					data: {
						productId: product.id,
						marketId: market.id,
						price: priceData.price,
						unit: priceData.unit,
						submittedBy: vendor.id,
						status: priceData.status as any,
						notes: priceData.status === 'PENDING' ? 'Awaiting admin review' : 'Current market price',
						createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time within last week
					}
				});
			}
		}

		console.log('✅ Database seeding completed successfully!');
		console.log('\n📊 Created:');
		console.log(`- ${categories.length} categories`);
		console.log(`- ${products.length} products`);
		console.log(`- ${markets.length} markets`);
		console.log(`- ${vendors.length + users.length + 1} users (${vendors.length} vendors + ${users.length} regular users + 1 admin)`);
		console.log(`- ${samplePrices.length} price entries`);
		
		console.log('\n🔐 Demo accounts:');
		console.log('Admin: admin@demo.com / password123');
		console.log('Vendor: vendor@demo.com / password123');
		console.log('Other vendors: mary@demo.com, ahmed@demo.com / password123');
		console.log('Regular users: user@demo.com, michael@demo.com, jennifer@demo.com / password123');

	} catch (error) {
		console.error('❌ Seeding failed:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

seed();
