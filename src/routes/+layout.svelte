<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import Notifications from '$lib/components/Notifications.svelte';
	import { 
		Menu, 
		X, 
		Search, 
		User, 
		TrendingUp, 
		Mail, 
		Settings, 
		Users, 
		ChevronDown,
		LogOut,
		Home,
		BarChart3
	} from 'lucide-svelte';

	let { children } = $props();
	let mobileMenuOpen = $state(false);
	let adminDropdownOpen = $state(false);
	let userDropdownOpen = $state(false);
	let lastUrl = $state('');

	// Initialize auth state
	onMount(async () => {
		await auth.initialize();
	});

	// Handle visibility change to refresh auth when user returns to the tab
	onMount(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden && $auth.user && $auth.isInitialized) {
				auth.refresh();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Close dropdowns when clicking outside
		const handleClickOutside = (event: Event) => {
			const target = event.target as HTMLElement;
			if (!target.closest('.dropdown-container')) {
				adminDropdownOpen = false;
				userDropdownOpen = false;
			}
		};

		document.addEventListener('click', handleClickOutside);

		// Cleanup
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			document.removeEventListener('click', handleClickOutside);
		};
	});

	// Refresh auth state on page navigation to ensure consistency
	$effect(() => {
		if ($page.url.pathname !== lastUrl && lastUrl !== '') {
			// Only refresh if user is logged in and this isn't the initial load
			if ($auth.user && $auth.isInitialized) {
				auth.refresh();
			}
		}
		lastUrl = $page.url.pathname;
	});

	// Main navigation items
	const mainNavItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/search', label: 'Search Prices', icon: Search }
	];

	// Admin dropdown items
	const adminDropdownItems = [
		{ href: '/admin', label: 'Dashboard', icon: BarChart3 },
		{ href: '/admin/prices', label: 'Manage Prices', icon: TrendingUp },
		{ href: '/admin/users', label: 'Manage Users', icon: Users },
		{ href: '/admin/messages', label: 'Contact Messages', icon: Mail }
	];

	// Vendor items
	const vendorNavItems = [
		{ href: '/vendor', label: 'Dashboard', icon: BarChart3 },
		{ href: '/vendor/submit', label: 'Submit Price', icon: TrendingUp }
	];

	function closeAllMenus() {
		mobileMenuOpen = false;
		adminDropdownOpen = false;
		userDropdownOpen = false;
	}

	function closeMenus() {
		mobileMenuOpen = false;
	}

	function toggleAdminDropdown(event: Event) {
		event.stopPropagation();
		adminDropdownOpen = !adminDropdownOpen;
		userDropdownOpen = false;
	}

	function toggleUserDropdown(event: Event) {
		event.stopPropagation();
		userDropdownOpen = !userDropdownOpen;
		adminDropdownOpen = false;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<!-- Logo -->
				<div class="flex items-center">
					<a href="/" class="flex items-center space-x-3">
						<TrendingUp class="h-8 w-8 text-blue-600" />
						<span class="text-xl font-bold text-gray-900">PricePulse</span>
					</a>
				</div>
				
				<!-- Desktop Navigation -->
				<div class="hidden lg:flex items-center space-x-8">
					<!-- Main Navigation -->
					{#each mainNavItems as item}
						<a 
							href={item.href} 
							class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
								{$page.url.pathname === item.href 
									? 'text-blue-600 bg-blue-50' 
									: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}"
						>
							<item.icon class="w-4 h-4" />
							<span>{item.label}</span>
						</a>
					{/each}

					<!-- Vendor Navigation -->
					{#if $auth.user?.role === 'VENDOR'}
						{#each vendorNavItems as item}
							<a 
								href={item.href} 
								class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
									{$page.url.pathname === item.href 
										? 'text-blue-600 bg-blue-50' 
										: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}"
							>
								<item.icon class="w-4 h-4" />
								<span>{item.label}</span>
							</a>
						{/each}
					{/if}

					<!-- Admin Dropdown -->
					{#if $auth.user?.role === 'ADMIN'}
						<div class="relative dropdown-container">
							<button 
								onclick={toggleAdminDropdown}
								class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
									{adminDropdownOpen || $page.url.pathname.startsWith('/admin') 
										? 'text-blue-600 bg-blue-50' 
										: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}"
							>
								<Settings class="w-4 h-4" />
								<span>Admin</span>
								<ChevronDown class="w-4 h-4 transition-transform duration-200 {adminDropdownOpen ? 'rotate-180' : ''}" />
							</button>
							
							{#if adminDropdownOpen}
								<div class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
									<div class="py-1">
										{#each adminDropdownItems as item}
											<a 
												href={item.href}
												onclick={closeAllMenus}
												class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors
													{$page.url.pathname === item.href ? 'bg-blue-50 text-blue-600' : ''}"
											>
												<item.icon class="w-4 h-4" />
												<span>{item.label}</span>
											</a>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- User Menu -->
				<div class="flex items-center space-x-4">
					{#if $auth.user}
						<div class="hidden lg:block relative dropdown-container">
							<button 
								onclick={toggleUserDropdown}
								class="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
							>
								<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
									<User class="w-4 h-4 text-blue-600" />
								</div>
								<span class="max-w-32 truncate">{$auth.user.name}</span>
								<ChevronDown class="w-4 h-4 transition-transform duration-200 {userDropdownOpen ? 'rotate-180' : ''}" />
							</button>
							
							{#if userDropdownOpen}
								<div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
									<div class="py-1">
										<div class="px-4 py-2 border-b border-gray-100">
											<p class="text-sm font-medium text-gray-900">{$auth.user.name}</p>
											<p class="text-xs text-gray-500">{$auth.user.email}</p>
											<p class="text-xs text-blue-600 capitalize">{$auth.user.role.toLowerCase()}</p>
										</div>
										<button 
											onclick={async () => { await auth.logout(); closeAllMenus(); }}
											class="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
										>
											<LogOut class="w-4 h-4" />
											<span>Logout</span>
										</button>
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<div class="hidden lg:flex items-center space-x-3">
							<a href="/login" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
								Login
							</a>
							<a href="/register" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
								Register
							</a>
						</div>
					{/if}

					<!-- Mobile menu button -->
					<button 
						onclick={() => mobileMenuOpen = !mobileMenuOpen}
						class="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
					>
						{#if mobileMenuOpen}
							<X class="h-6 w-6" />
						{:else}
							<Menu class="h-6 w-6" />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile menu -->
		{#if mobileMenuOpen}
			<div class="lg:hidden border-t border-gray-200">
				<div class="px-2 pt-2 pb-3 space-y-1">
					<!-- Main Navigation -->
					{#each mainNavItems as item}
						<a 
							href={item.href} 
							onclick={closeMenus}
							class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors
								{$page.url.pathname === item.href 
									? 'text-blue-600 bg-blue-50' 
									: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}"
						>
							<item.icon class="w-5 h-5" />
							<span>{item.label}</span>
						</a>
					{/each}

					<!-- Vendor Navigation -->
					{#if $auth.user?.role === 'VENDOR'}
						<div class="pt-4 border-t border-gray-200">
							<div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</div>
							{#each vendorNavItems as item}
								<a 
									href={item.href} 
									onclick={closeMenus}
									class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors
										{$page.url.pathname === item.href 
											? 'text-blue-600 bg-blue-50' 
											: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}"
								>
									<item.icon class="w-5 h-5" />
									<span>{item.label}</span>
								</a>
							{/each}
						</div>
					{/if}

					<!-- Admin Navigation -->
					{#if $auth.user?.role === 'ADMIN'}
						<div class="pt-4 border-t border-gray-200">
							<div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</div>
							{#each adminDropdownItems as item}
								<a 
									href={item.href} 
									onclick={closeMenus}
									class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors
										{$page.url.pathname === item.href 
											? 'text-blue-600 bg-blue-50' 
											: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}"
								>
									<item.icon class="w-5 h-5" />
									<span>{item.label}</span>
								</a>
							{/each}
						</div>
					{/if}
				</div>
				
				<!-- User section -->
				<div class="pt-4 pb-3 border-t border-gray-200">
					{#if $auth.user}
						<div class="flex items-center px-5">
							<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
								<User class="w-6 h-6 text-blue-600" />
							</div>
							<div class="ml-3">
								<div class="text-base font-medium text-gray-800">{$auth.user.name}</div>
								<div class="text-sm font-medium text-gray-500">{$auth.user.email}</div>
								<div class="text-xs text-blue-600 capitalize">{$auth.user.role.toLowerCase()}</div>
							</div>
						</div>
						<div class="mt-3 space-y-1">
							<button 
								onclick={async () => { await auth.logout(); closeMenus(); }}
								class="flex items-center space-x-3 w-full px-5 py-2 text-base font-medium text-gray-500 hover:text-red-600 hover:bg-gray-50"
							>
								<LogOut class="w-5 h-5" />
								<span>Logout</span>
							</button>
						</div>
					{:else}
						<div class="space-y-1">
							<a href="/login" onclick={closeMenus} class="block px-5 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50">
								Login
							</a>
							<a href="/register" onclick={closeMenus} class="block px-5 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50">
								Register
							</a>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</nav>

	<!-- Main content -->
	<main>
		{#if $auth.isLoading && !$auth.isInitialized}
			<div class="min-h-screen flex items-center justify-center">
				<div class="text-center">
					<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p class="mt-2 text-sm text-gray-600">Loading...</p>
				</div>
			</div>
		{:else}
			{@render children()}
		{/if}
	</main>

	<!-- Footer -->
	<footer class="bg-white border-t border-gray-200 mt-auto">
		<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div>
					<div class="flex items-center space-x-2 mb-4">
						<TrendingUp class="h-6 w-6 text-blue-600" />
						<span class="text-lg font-semibold text-gray-900">PricePulse</span>
					</div>
					<p class="text-gray-600 text-sm">
						Real-time market price information for transparent and fair trading.
					</p>
				</div>
				
				<div>
					<h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Quick Links</h3>
					<ul class="space-y-2">
						<li><a href="/search" class="text-gray-600 hover:text-gray-900 text-sm">Search Prices</a></li>
						<li><a href="/about" class="text-gray-600 hover:text-gray-900 text-sm">About</a></li>
						<li><a href="/contact" class="text-gray-600 hover:text-gray-900 text-sm">Contact</a></li>
					</ul>
				</div>
				
				<div>
					<h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
					<ul class="space-y-2">
						<li><a href="/help" class="text-gray-600 hover:text-gray-900 text-sm">Help Center</a></li>
						<li><a href="/privacy" class="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a></li>
						<li><a href="/terms" class="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a></li>
					</ul>
				</div>
			</div>
			
			<div class="mt-8 pt-8 border-t border-gray-200">
				<p class="text-center text-gray-500 text-sm">
					© 2025 PricePulse. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
</div>

<!-- Global notifications -->
<Notifications />
