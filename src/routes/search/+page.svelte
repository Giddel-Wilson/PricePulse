<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Search, Filter, MapPin, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import Input from '$lib/components/Input.svelte';
	import Select from '$lib/components/Select.svelte';
	import Button from '$lib/components/Button.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { formatPrice, formatDateTime } from '$lib/utils';
	import type { PriceEntryWithDetails, Category, Market } from '$lib/types';

	// Data
	let prices: PriceEntryWithDetails[] = $state([]);
	let categories: Category[] = $state([]);
	let markets: Market[] = $state([]);
	let isLoading = $state(false);
	let showFilters = $state(false);

	// Pagination
	let currentPage = $state(1);
	let totalPages = $state(1);
	let totalResults = $state(0);

	// Filters
	let filters = $state({
		productName: '',
		categoryId: '',
		marketId: '',
		region: '',
		minPrice: '',
		maxPrice: ''
	});

	// Initialize from URL params
	onMount(async () => {
		// Get initial search query from URL
		const urlParams = new URLSearchParams($page.url.search);
		filters.productName = urlParams.get('q') || '';
		filters.categoryId = urlParams.get('category') || '';
		filters.marketId = urlParams.get('market') || '';
		filters.region = urlParams.get('region') || '';
		filters.minPrice = urlParams.get('minPrice') || '';
		filters.maxPrice = urlParams.get('maxPrice') || '';
		currentPage = parseInt(urlParams.get('page') || '1');

		// Load data
		await Promise.all([
			loadCategories(),
			loadMarkets(),
			searchPrices()
		]);
	});

	// Handle Enter key for search
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}

	async function loadCategories() {
		try {
			const response = await fetch('/api/categories');
			const result = await response.json();
			if (result.success) {
				categories = result.data;
			}
		} catch (error) {
			console.error('Failed to load categories:', error);
		}
	}

	async function loadMarkets() {
		try {
			const response = await fetch('/api/markets');
			const result = await response.json();
			if (result.success) {
				markets = result.data;
			}
		} catch (error) {
			console.error('Failed to load markets:', error);
		}
	}

	async function searchPrices() {
		try {
			isLoading = true;
			
			const searchParams = new URLSearchParams();
			searchParams.set('page', currentPage.toString());
			searchParams.set('limit', '12');
			
			// Only add non-empty filter values
			if (filters.productName?.trim()) searchParams.set('productName', filters.productName.trim());
			if (filters.categoryId?.trim()) searchParams.set('categoryId', filters.categoryId.trim());
			if (filters.marketId?.trim()) searchParams.set('marketId', filters.marketId.trim());
			if (filters.region?.trim()) searchParams.set('region', filters.region.trim());
			if (filters.minPrice?.trim() && !isNaN(parseFloat(filters.minPrice))) {
				searchParams.set('minPrice', parseFloat(filters.minPrice).toString());
			}
			if (filters.maxPrice?.trim() && !isNaN(parseFloat(filters.maxPrice))) {
				searchParams.set('maxPrice', parseFloat(filters.maxPrice).toString());
			}

			const response = await fetch(`/api/prices?${searchParams.toString()}`);
			const result = await response.json();

			if (result.success) {
				prices = result.data.data;
				totalPages = result.data.pagination.totalPages;
				totalResults = result.data.pagination.total;
			} else {
				console.error('Search API error:', result.error);
			}
		} catch (error) {
			console.error('Search failed:', error);
		} finally {
			isLoading = false;
		}
	}

	function handleSearch() {
		currentPage = 1;
		updateURL();
		searchPrices();
	}

	// Auto-search when filters change (with debouncing for better UX)
	let searchTimeout: number;
	function handleFilterChange() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			handleSearch();
		}, 500); // 500ms debounce
	}

	// Handle market selection - clear region filter when specific market is selected
	function handleMarketChange() {
		if (filters.marketId) {
			filters.region = ''; // Clear region when specific market is selected
		}
		handleFilterChange();
	}

	// Handle region selection - clear market filter when region is selected
	function handleRegionChange() {
		if (filters.region) {
			filters.marketId = ''; // Clear market when region is selected
		}
		handleFilterChange();
	}

	function handlePageChange(newPage: number) {
		currentPage = newPage;
		updateURL();
		searchPrices();
		// Scroll to top
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function updateURL() {
		const searchParams = new URLSearchParams();
		
		// Only add non-empty values to URL
		if (filters.productName?.trim()) searchParams.set('q', filters.productName.trim());
		if (filters.categoryId?.trim()) searchParams.set('category', filters.categoryId.trim());
		if (filters.marketId?.trim()) searchParams.set('market', filters.marketId.trim());
		if (filters.region?.trim()) searchParams.set('region', filters.region.trim());
		if (filters.minPrice?.trim() && !isNaN(parseFloat(filters.minPrice))) {
			searchParams.set('minPrice', parseFloat(filters.minPrice).toString());
		}
		if (filters.maxPrice?.trim() && !isNaN(parseFloat(filters.maxPrice))) {
			searchParams.set('maxPrice', parseFloat(filters.maxPrice).toString());
		}
		if (currentPage > 1) searchParams.set('page', currentPage.toString());

		const newUrl = searchParams.toString() ? `/search?${searchParams.toString()}` : '/search';
		goto(newUrl, { replaceState: true });
	}

	function clearFilters() {
		filters = {
			productName: '',
			categoryId: '',
			marketId: '',
			region: '',
			minPrice: '',
			maxPrice: ''
		};
		currentPage = 1;
		updateURL();
		searchPrices();
	}

	function getUniqueRegions() {
		const regions = [...new Set(markets.map(market => market.region))];
		return regions.map(region => ({ value: region, label: region }));
	}

	const categoryOptions = $derived([
		{ value: '', label: 'All Categories' },
		...categories.map(cat => ({ value: cat.id, label: cat.name }))
	]);

	const marketOptions = $derived([
		{ value: '', label: 'All Markets' },
		...markets.map(market => ({ 
			value: market.id, 
			label: `${market.name}, ${market.location}` 
		}))
	]);

	const regionOptions = $derived([
		{ value: '', label: 'All Regions' },
		...getUniqueRegions()
	]);
</script>

<svelte:head>
	<title>Search Prices - PricePulse</title>
	<meta name="description" content="Search and compare market prices for various goods across different markets and regions." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-4">Search Market Prices</h1>
			
			<!-- Main Search Bar -->
			<div class="flex gap-4 mb-4">
				<div class="flex-1">
					<Input
						bind:value={filters.productName}
						placeholder="Search for products..."
						class="text-lg"
						onkeydown={handleKeydown}
					/>
				</div>
				<Button onclick={handleSearch}>
					<Search class="w-5 h-5 mr-2" />
					Search
				</Button>
				<Button variant="outline" onclick={() => showFilters = !showFilters}>
					<Filter class="w-5 h-5 mr-2" />
					Filters
				</Button>
			</div>

			<!-- Advanced Filters -->
			{#if showFilters}
				<div class="bg-gray-50 p-4 rounded-lg border">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						<Select
							bind:value={filters.categoryId}
							options={categoryOptions}
							placeholder="Category"
							onchange={handleFilterChange}
						/>
						
						<Select
							bind:value={filters.marketId}
							options={marketOptions}
							placeholder="Market"
							onchange={handleMarketChange}
						/>
						
						<Select
							bind:value={filters.region}
							options={regionOptions}
							placeholder="Region"
							onchange={handleRegionChange}
						/>
						
						<Input
							type="number"
							bind:value={filters.minPrice}
							placeholder="Min Price"
							min="0"
							step="0.01"
							oninput={handleFilterChange}
						/>
						
						<Input
							type="number"
							bind:value={filters.maxPrice}
							placeholder="Max Price"
							min="0"
							step="0.01"
							oninput={handleFilterChange}
						/>
					</div>
					
					<div class="flex justify-between mt-4">
						<Button variant="outline" onclick={clearFilters}>
							Clear All
						</Button>
						<Button onclick={handleSearch}>
							Apply Filters
						</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Results -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if isLoading}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" text="Searching prices..." />
			</div>
		{:else}
			<!-- Results Header -->
			<div class="flex justify-between items-center mb-6">
				<div>
					<h2 class="text-xl font-semibold text-gray-900">
						{totalResults} price {totalResults === 1 ? 'entry' : 'entries'} found
					</h2>
				</div>
			</div>

			{#if prices.length === 0}
				<!-- No Results -->
				<div class="text-center py-12">
					<div class="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<Search class="w-8 h-8 text-gray-400" />
					</div>
					<h3 class="text-lg font-medium text-gray-900 mb-2">No prices found</h3>
					<p class="text-gray-600 mb-4">Try adjusting your search terms or filters.</p>
					<Button onclick={clearFilters}>
						Clear Filters
					</Button>
				</div>
			{:else}
				<!-- Price Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each prices as entry}
						<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
							<div class="flex justify-between items-start mb-4">
								<div class="flex-1">
									<h3 class="text-lg font-semibold text-gray-900 mb-1">{(entry as any).product.name}</h3>
									<div class="flex items-center text-sm text-gray-500 mb-2">
										<Tag class="w-4 h-4 mr-1" />
										<span>{(entry as any).product.category.name}</span>
									</div>
								</div>
								<div class="text-right">
									<div class="text-2xl font-bold text-blue-600">{formatPrice((entry as any).price)}</div>
									<div class="text-sm text-gray-500">per {(entry as any).unit}</div>
								</div>
							</div>
							
							<div class="space-y-2 text-sm text-gray-600">
								<div class="flex items-center">
									<MapPin class="w-4 h-4 mr-2 flex-shrink-0" />
									<span class="truncate">{(entry as any).market.name}, {(entry as any).market.location}</span>
								</div>
								<div class="flex items-center">
									<Clock class="w-4 h-4 mr-2 flex-shrink-0" />
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

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="flex justify-center items-center space-x-2 mt-8">
						<Button 
							variant="outline" 
							disabled={currentPage === 1}
							onclick={() => handlePageChange(currentPage - 1)}
						>
							<ChevronLeft class="w-4 h-4" />
						</Button>
						
						{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
							const startPage = Math.max(1, currentPage - 2);
							return startPage + i;
						}).filter(p => p <= totalPages) as pageNum}
							<Button
								variant={pageNum === currentPage ? 'primary' : 'outline'}
								onclick={() => handlePageChange(pageNum)}
							>
								{pageNum}
							</Button>
						{/each}
						
						<Button 
							variant="outline" 
							disabled={currentPage === totalPages}
							onclick={() => handlePageChange(currentPage + 1)}
						>
							<ChevronRight class="w-4 h-4" />
						</Button>
					</div>
				{/if}
			{/if}
		{/if}
	</div>
</div>
