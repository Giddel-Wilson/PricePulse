<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, TrendingUp, Clock, MapPin, Tag, ArrowRight } from 'lucide-svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import VendorRequestModal from '$lib/components/VendorRequestModal.svelte';
	import { formatPrice, formatDateTime } from '$lib/utils';
	import { auth } from '$lib/stores/auth';
	import { notifications } from '$lib/stores/notifications';
	import type { PriceEntryWithDetails, PaginatedResponse, ApiResponse, VendorRequest } from '$lib/types';

	let recentPrices: PriceEntryWithDetails[] = $state([]);
	let isLoading = $state(true);
	let searchQuery = $state('');
	let showVendorModal = $state(false);
	let vendorRequest: VendorRequest | null = $state(null);
	let checkingRequest = $state(false);

	onMount(async () => {
		await loadRecentPrices();
		if ($auth.user) {
			await checkVendorRequest();
		}
	});

	async function loadRecentPrices() {
		try {
			isLoading = true;
			const response = await fetch('/api/prices?limit=6');
			const result: ApiResponse<PaginatedResponse<PriceEntryWithDetails>> = await response.json();
			
			if (result.success && result.data) {
				recentPrices = result.data.data as PriceEntryWithDetails[];
			}
		} catch (error) {
			console.error('Failed to load recent prices:', error);
		} finally {
			isLoading = false;
		}
	}

	async function checkVendorRequest() {
		if (!$auth.user?.email) return;

		try {
			checkingRequest = true;
			const response = await fetch(`/api/vendor-requests?email=${encodeURIComponent($auth.user.email)}`);
			const result = await response.json();
			
			if (result.success) {
				vendorRequest = result.data;
			}
		} catch (error) {
			console.error('Failed to check vendor request:', error);
		} finally {
			checkingRequest = false;
		}
	}

	function handleVendorRequest() {
		if (!$auth.user) {
			window.location.href = '/login';
			return;
		}

		if ($auth.user.role === 'VENDOR' || $auth.user.role === 'ADMIN') {
			notifications.info('You already have vendor access');
			return;
		}

		if (vendorRequest?.status === 'PENDING') {
			notifications.info('Your vendor request is pending approval');
			return;
		}

		if (vendorRequest?.status === 'APPROVED') {
			notifications.info('Your vendor request has been approved');
			return;
		}

		showVendorModal = true;
	}

	function handleVendorRequestSuccess() {
		checkVendorRequest();
	}

	function handleSearch() {
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	}
</script>

<svelte:head>
	<title>PricePulse - Real-time Market Prices</title>
	<meta name="description" content="Track real-time market prices for various goods across multiple local markets. Get transparent, up-to-date price information." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
		<div class="text-center">
			<h1 class="text-4xl lg:text-6xl font-bold mb-6">
				Real-time Market <span class="text-blue-200">Prices</span>
			</h1>
			<p class="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
				Get transparent, up-to-date price information for goods across local markets. 
				Help fight price manipulation and promote fair trading.
			</p>
			
			<!-- Search Bar -->
			<div class="max-w-2xl mx-auto">
				<form onsubmit={handleSearch} class="flex gap-2">
					<Input
						bind:value={searchQuery}
						placeholder="Search for products, markets, or categories..."
						class="flex-1 text-gray-900"
					/>
					<Button type="submit" size="lg">
						<Search class="w-5 h-5 mr-2" />
						Search
					</Button>
				</form>
			</div>
		</div>
	</div>
</section>

<!-- Key Features -->
<section class="py-16 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose PricePulse?</h2>
			<p class="text-xl text-gray-600">Transparent, real-time, and community-driven price information</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="text-center p-6">
				<div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<TrendingUp class="w-8 h-8 text-blue-600" />
				</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
				<p class="text-gray-600">Get the latest price information as soon as vendors submit updates.</p>
			</div>
			
			<div class="text-center p-6">
				<div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<MapPin class="w-8 h-8 text-green-600" />
				</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Multiple Markets</h3>
				<p class="text-gray-600">Compare prices across different markets and regions to find the best deals.</p>
			</div>
			
			<div class="text-center p-6">
				<div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<Tag class="w-8 h-8 text-purple-600" />
				</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Verified Prices</h3>
				<p class="text-gray-600">All price submissions are moderated to ensure accuracy and reliability.</p>
			</div>
		</div>
	</div>
</section>

<!-- Recent Prices -->
<section class="py-16 bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h2 class="text-3xl font-bold text-gray-900 mb-2">Recent Price Updates</h2>
				<p class="text-gray-600">Latest verified prices from vendors across different markets</p>
			</div>
			<Button variant="outline">
				<a href="/search" class="flex items-center">
					View All
					<ArrowRight class="w-4 h-4 ml-2" />
				</a>
			</Button>
		</div>

		{#if isLoading}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" text="Loading recent prices..." />
			</div>
		{:else if recentPrices.length === 0}
			<div class="text-center py-12">
				<div class="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<TrendingUp class="w-8 h-8 text-gray-400" />
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">No prices available yet</h3>
				<p class="text-gray-600 mb-4">Be the first to submit price information!</p>
				<Button>
					<a href="/vendor/submit">Submit Price</a>
				</Button>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each recentPrices as entry}
					<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
						<div class="flex justify-between items-start mb-4">
							<div>
								<h3 class="text-lg font-semibold text-gray-900">{(entry as any).product.name}</h3>
								<p class="text-sm text-gray-500">{(entry as any).product.category.name}</p>
							</div>
							<div class="text-right">
								<div class="text-2xl font-bold text-blue-600">{formatPrice((entry as any).price)}</div>
								<div class="text-sm text-gray-500">per {(entry as any).unit}</div>
							</div>
						</div>
						
						<div class="space-y-2 text-sm text-gray-600">
							<div class="flex items-center">
								<MapPin class="w-4 h-4 mr-2" />
								<span>{(entry as any).market.name}, {(entry as any).market.location}</span>
							</div>
							<div class="flex items-center">
								<Clock class="w-4 h-4 mr-2" />
								<span>{formatDateTime((entry as any).createdAt)}</span>
							</div>
						</div>
						
						{#if (entry as any).notes}
							<div class="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
								{(entry as any).notes}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Call to Action -->
<section class="py-16 bg-blue-600 text-white">
	<div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
		<h2 class="text-3xl font-bold mb-4">Join Our Community</h2>
		<p class="text-xl text-blue-100 mb-8">
			Help create a more transparent marketplace by sharing price information from your local market.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<Button 
				variant="secondary" 
				size="lg"
				onclick={handleVendorRequest}
				loading={checkingRequest}
			>
				{#if vendorRequest?.status === 'PENDING'}
					Request Pending
				{:else if vendorRequest?.status === 'APPROVED'}
					Vendor Access Approved
				{:else if $auth.user?.role === 'VENDOR' || $auth.user?.role === 'ADMIN'}
					Already a Vendor
				{:else}
					Register as Vendor
				{/if}
			</Button>
			<Button size="lg" class="border border-white text-white hover:text-blue-600 hover:bg-white">
				<a href="/search">
					Browse Prices
				</a>
			</Button>
		</div>
	</div>
</section>

<VendorRequestModal 
	isOpen={showVendorModal}
	userEmail={$auth.user?.email || ''}
	onclose={() => showVendorModal = false}
	onsuccess={handleVendorRequestSuccess}
/>
