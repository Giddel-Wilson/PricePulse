# 🛒 PricePulse - Market Price Information & Update System

**Real-time, asynchronous web application for tracking and updating market prices across multiple local markets.**

PricePulse is a lightweight, mobile-first platform that helps vendors and buyers access transparent, up-to-date price information for commodities and products, promoting fair trading and preventing market manipulation.

![PricePulse Banner](https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=PricePulse+-+Real-time+Market+Prices)

## ✨ Features

### 🟩 Public Interface
- **Real-time Price Search**: Search by product, market, category, or region
- **Advanced Filtering**: Filter by price range, date, and location
- **Mobile-first Design**: Responsive interface optimized for mobile devices
- **Async Loading**: Real-time data updates without page refreshes

### 🟩 Vendor Interface  
- **Price Submission**: Submit single or bulk price entries
- **Dashboard**: Track submission status (pending, approved, rejected)
- **Real-time Validation**: Form validation with immediate feedback
- **Submission History**: View all your price submissions

### 🟩 Admin Dashboard
- **Price Moderation**: Approve, reject, or edit price submissions
- **User Management**: Manage vendors and their access
- **Analytics**: View submission statistics and trends
- **Data Export**: Export price data to CSV/PDF

## 🛠️ Tech Stack

### Frontend
- **SvelteKit** - Reactive components and smooth routing
- **TypeScript** - Type-safe development
- **TailwindCSS** - Mobile-first styling
- **Lucide Svelte** - Clean SVG icons

### Backend
- **SvelteKit Server** - Server-side endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Scalable relational database
- **JWT Authentication** - Secure session management

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ or **Bun** (recommended)
- **PostgreSQL** database
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PricePulse
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database URL and JWT secret:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pricepulse"
   JWT_SECRET="your-super-secret-jwt-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   bun run db:generate
   
   # Push schema to database
   bun run db:push
   
   # Seed with sample data
   bun run db:seed
   ```

5. **Start development server**
   ```bash
   bun run dev
   ```

6. **Open your browser**
   Visit `http://localhost:5173`

## 🗄️ Database Schema

The application uses a well-structured PostgreSQL database with the following key entities:

```
Users (vendors, admins)
├── Categories (foodstuff, electronics, etc.)
├── Products (linked to categories)
├── Markets (with location and region)
├── PriceEntries (with approval status)
└── Attachments (optional proof files)
```

## 🔐 Demo Accounts

After seeding, you can use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@demo.com | password123 |
| **Vendor** | vendor@demo.com | password123 |
| **Vendor** | mary@demo.com | password123 |

## 📱 Usage Examples

### For Public Users:
1. Visit the homepage
2. Search for products using the search bar
3. Use filters to narrow down results by location or price range
4. View real-time prices from different markets

### For Vendors:
1. Register or login with vendor credentials
2. Navigate to "Submit Price" 
3. Select product and market
4. Enter current price and submit
5. Track submission status in your dashboard

### For Admins:
1. Login with admin credentials
2. Access the admin dashboard
3. Review pending price submissions
4. Approve, reject, or edit submissions
5. Manage users and view analytics

## 🏗️ Development

### Database Commands
```bash
# Generate Prisma client after schema changes
bun run db:generate

# Push schema changes to database
bun run db:push

# Create and run migrations
bun run db:migrate

# Seed database with sample data
bun run db:seed

# Open Prisma Studio (database GUI)
bun run db:studio
```

### Code Quality
```bash
# Run linting
bun run lint

# Format code
bun run format

# Type checking
bun run check

# Run tests
bun run test
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Price Entries
- `GET /api/prices` - Get prices with filtering
- `POST /api/prices` - Submit new price (vendors/admins)
- `PATCH /api/prices/[id]` - Update price status (admins)
- `DELETE /api/prices/[id]` - Delete price entry

### Data
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories  
- `GET /api/markets` - Get all markets

## 🎨 Design System

The application follows a clean, minimal design with:

- **Colors**: Blue primary (#3B82F6), semantic colors for status
- **Typography**: Inter font family for clarity
- **Layout**: Mobile-first responsive design
- **Components**: Reusable UI components with consistent styling

## 🚀 Deployment

### Using Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Using Netlify
```bash
# Build the project
bun run build

# Deploy to Netlify (drag and drop the build folder)
```

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
PUBLIC_APP_NAME="PricePulse"
PUBLIC_APP_URL="https://your-domain.com"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for transparent and fair market trading**
