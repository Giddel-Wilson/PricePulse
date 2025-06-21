// Database types - manually defined from Prisma schema
export enum UserRole {
	ADMIN = 'ADMIN',
	VENDOR = 'VENDOR',
	USER = 'USER'
}

export enum UserStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	SUSPENDED = 'SUSPENDED'
}

export enum EntryStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED'
}

export enum RequestStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED'
}

export interface User {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	role: UserRole;
	status: UserStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface Category {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Product {
	id: string;
	name: string;
	categoryId: string;
	unit: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Market {
	id: string;
	name: string;
	location: string;
	region: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface PriceEntry {
	id: string;
	productId: string;
	marketId: string;
	userId: string;
	price: number;
	unit: string;
	notes?: string;
	status: EntryStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface Attachment {
	id: string;
	filename: string;
	originalName: string;
	mimeType: string;
	size: number;
	url: string;
	priceEntryId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface VendorRequest {
	id: string;
	email: string;
	message?: string;
	status: RequestStatus;
	adminNotes?: string;
	createdAt: Date;
	updatedAt: Date;
	reviewedAt?: Date;
	reviewedBy?: string;
	canRequestAgainAt?: Date;
}

// Extended types with relations
export interface UserWithEntries extends User {
	priceEntries: PriceEntry[];
}

export interface ProductWithCategory extends Product {
	category: Category;
}

export interface PriceEntryWithDetails extends PriceEntry {
	product: ProductWithCategory;
	market: Market;
	user: Pick<User, 'id' | 'name' | 'email'>;
	attachments: Attachment[];
}

export interface MarketWithEntries extends Market {
	priceEntries: PriceEntryWithDetails[];
}

// Form types
export interface LoginForm {
	email: string;
	password: string;
}

export interface RegisterForm {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface PriceSubmissionForm {
	productId: string;
	marketId: string;
	price: number;
	unit: string;
	notes?: string;
}

export interface ProductForm {
	name: string;
	categoryId: string;
	unit: string;
}

export interface MarketForm {
	name: string;
	location: string;
	region: string;
}

export interface CategoryForm {
	name: string;
}

// Search and filter types
export interface PriceSearchFilters {
	productName?: string;
	categoryId?: string;
	marketId?: string;
	region?: string;
	minPrice?: number;
	maxPrice?: number;
	dateFrom?: string;
	dateTo?: string;
}

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: PaginationInfo;
}

// API Response types
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Authentication types
export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	status: UserStatus;
}

export interface JWTPayload {
	userId: string;
	email: string;
	role: UserRole;
	iat: number;
	exp: number;
}

// Dashboard statistics
export interface DashboardStats {
	totalPriceEntries: number;
	pendingEntries: number;
	approvedEntries: number;
	rejectedEntries: number;
	totalVendors: number;
	totalProducts: number;
	totalMarkets: number;
	recentEntries: PriceEntryWithDetails[];
}

// Price history
export interface PriceHistory {
	date: string;
	price: number;
	market: string;
}

export interface ProductPriceHistory {
	product: ProductWithCategory;
	history: PriceHistory[];
	averagePrice: number;
	minPrice: number;
	maxPrice: number;
}

// Notification types
export interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	autoHide?: boolean;
	duration?: number;
}
