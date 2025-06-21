<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { notifications } from '$lib/stores/notifications';
	import Input from '$lib/components/Input.svelte';
	import Select from '$lib/components/Select.svelte';
	import Button from '$lib/components/Button.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { Plus, ArrowLeft } from 'lucide-svelte';
	import type { ProductWithCategory, Category, Market } from '$lib/types';

	let products: ProductWithCategory[] = $state([]);
	let categories: Category[] = $state([]);
	let markets: Market[] = $state([]);
	let isLoading = $state(false);
	let isSubmitting = $state(false);

	let form = $state({
		productId: '',
		marketId: '',
		price: '',
		unit: '',
		notes: ''
	});

	// Custom product/market fields
	let showCustomProduct = $state(false);
	let showCustomMarket = $state(false);
	let customProduct = $state({
		name: '',
		categoryId: '',
		unit: ''
	});
	let customMarket = $state({
		name: '',
		location: '',
		region: ''
	});

	let errors: Record<string, string> = $state({});
	let selectedProduct: ProductWithCategory | null = $state(null);

	onMount(async () => {
		// Check authentication
		if (!$auth.user) {
			goto('/login');
			return;
		}

		// Check if user is vendor or admin
		if ($auth.user.role !== 'VENDOR' && $auth.user.role !== 'ADMIN') {
			goto('/');
			return;
		}

		await loadData();
	});

	async function loadData() {
		try {
			isLoading = true;
			
			const [productsRes, categoriesRes, marketsRes] = await Promise.all([
				fetch('/api/products'),
				fetch('/api/categories'),
				fetch('/api/markets')
			]);

			const [productsResult, categoriesResult, marketsResult] = await Promise.all([
				productsRes.json(),
				categoriesRes.json(),
				marketsRes.json()
			]);

			if (productsResult.success) products = productsResult.data;
			if (categoriesResult.success) categories = categoriesResult.data;
			if (marketsResult.success) markets = marketsResult.data;
		} catch (error) {
			console.error('Failed to load data:', error);
			notifications.error('Failed to load form data');
		} finally {
			isLoading = false;
		}
	}

	function handleProductChange(productId: string) {
		if (productId === 'other') {
			showCustomProduct = true;
			selectedProduct = null;
			form.unit = '';
		} else {
			showCustomProduct = false;
			selectedProduct = products.find(p => p.id === productId) || null;
			if (selectedProduct) {
				form.unit = selectedProduct.unit;
			}
		}
	}

	function handleMarketChange(marketId: string) {
		if (marketId === 'other') {
			showCustomMarket = true;
		} else {
			showCustomMarket = false;
		}
	}

	// Update form unit when custom product unit changes
	function handleCustomProductUnitChange() {
		if (showCustomProduct && customProduct.unit) {
			form.unit = customProduct.unit;
		}
	}

	function validateForm() {
		errors = {};

		// Product validation
		if (!form.productId) {
			errors.productId = 'Please select a product';
		} else if (form.productId === 'other') {
			if (!customProduct.name.trim()) {
				errors.customProductName = 'Product name is required';
			}
			if (!customProduct.categoryId) {
				errors.customProductCategory = 'Please select a category';
			}
			if (!customProduct.unit.trim()) {
				errors.customProductUnit = 'Unit is required';
			}
		}

		// Market validation
		if (!form.marketId) {
			errors.marketId = 'Please select a market';
		} else if (form.marketId === 'other') {
			if (!customMarket.name.trim()) {
				errors.customMarketName = 'Market name is required';
			}
			if (!customMarket.location.trim()) {
				errors.customMarketLocation = 'Market location is required';
			}
			if (!customMarket.region.trim()) {
				errors.customMarketRegion = 'Market region is required';
			}
		}

		if (!form.price) {
			errors.price = 'Price is required';
		} else {
			const price = parseFloat(form.price);
			if (isNaN(price) || price <= 0) {
				errors.price = 'Please enter a valid price greater than 0';
			}
		}

		if (!form.unit.trim()) {
			errors.unit = 'Unit is required';
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!validateForm()) {
			return;
		}

		try {
			isSubmitting = true;

			const submissionData: any = {
				price: parseFloat(form.price),
				unit: form.unit,
				notes: form.notes
			};

			// Handle custom product
			if (form.productId === 'other') {
				submissionData.customProduct = customProduct;
			} else {
				submissionData.productId = form.productId;
			}

			// Handle custom market
			if (form.marketId === 'other') {
				submissionData.customMarket = customMarket;
			} else {
				submissionData.marketId = form.marketId;
			}

			const response = await fetch('/api/prices', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(submissionData)
			});

			const result = await response.json();

			if (result.success) {
				notifications.success('Price submitted successfully! It will be reviewed by an admin.');
				goto('/vendor');
			} else {
				notifications.error(result.error || 'Failed to submit price');
			}
		} catch (error) {
			console.error('Submission error:', error);
			notifications.error('Network error. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		form = {
			productId: '',
			marketId: '',
			price: '',
			unit: '',
			notes: ''
		};
		customProduct = {
			name: '',
			categoryId: '',
			unit: ''
		};
		customMarket = {
			name: '',
			location: '',
			region: ''
		};
		selectedProduct = null;
		showCustomProduct = false;
		showCustomMarket = false;
		errors = {};
	}

	const productOptions = $derived([
		{ value: '', label: 'Select a product' },
		...products.map(product => ({
			value: product.id,
			label: `${product.name} (${product.category.name})`
		})),
		{ value: 'other', label: 'Other (Add new product)' }
	]);

	const marketOptions = $derived([
		{ value: '', label: 'Select a market' },
		...markets.map(market => ({
			value: market.id,
			label: `${market.name}, ${market.location} (${market.region})`
		})),
		{ value: 'other', label: 'Other (Add new market)' }
	]);

	const categoryOptions = $derived([
		{ value: '', label: 'Select a category' },
		...categories.map(category => ({
			value: category.id,
			label: category.name
		}))
	]);
</script>

<svelte:head>
	<title>Submit Price - PricePulse</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<Button variant="outline" class="mb-4">
				<a href="/vendor" class="flex items-center">
					<ArrowLeft class="w-4 h-4 mr-2" />
					Back to Dashboard
				</a>
			</Button>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Submit New Price</h1>
			<p class="text-gray-600">Add current price information for a product in your market</p>
		</div>

		{#if isLoading}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" text="Loading form..." />
			</div>
		{:else}
			<div class="bg-white rounded-lg shadow-md p-6">
				<form onsubmit={handleSubmit} class="space-y-6">
					<!-- Product Selection -->
					<Select
						label="Product"
						bind:value={form.productId}
						options={productOptions}
						error={errors.productId}
						required
						onchange={handleProductChange}
					/>

					<!-- Custom Product Fields -->
					{#if showCustomProduct}
						<div class="bg-blue-50 p-4 rounded-lg space-y-4">
							<h3 class="text-sm font-medium text-blue-900 mb-3">Add New Product</h3>
							
							<Input
								type="text"
								label="Product Name"
								bind:value={customProduct.name}
								placeholder="e.g., Premium White Rice"
								error={errors.customProductName}
								required
							/>
							
							<Select
								label="Category"
								bind:value={customProduct.categoryId}
								options={categoryOptions}
								error={errors.customProductCategory}
								required
							/>
							
							<Input
								type="text"
								label="Default Unit"
								bind:value={customProduct.unit}
								placeholder="e.g., per bag (50kg), per kg"
								error={errors.customProductUnit}
								required
								hint="This will be used as the default unit for this product"
								oninput={handleCustomProductUnitChange}
							/>
						</div>
					{/if}

					<!-- Market Selection -->
					<Select
						label="Market"
						bind:value={form.marketId}
						options={marketOptions}
						error={errors.marketId}
						required
						onchange={handleMarketChange}
					/>

					<!-- Custom Market Fields -->
					{#if showCustomMarket}
						<div class="bg-green-50 p-4 rounded-lg space-y-4">
							<h3 class="text-sm font-medium text-green-900 mb-3">Add New Market</h3>
							
							<Input
								type="text"
								label="Market Name"
								bind:value={customMarket.name}
								placeholder="e.g., Central Market"
								error={errors.customMarketName}
								required
							/>
							
							<Input
								type="text"
								label="Location"
								bind:value={customMarket.location}
								placeholder="e.g., Ikeja, Lagos"
								error={errors.customMarketLocation}
								required
							/>
							
							<Input
								type="text"
								label="Region/State"
								bind:value={customMarket.region}
								placeholder="e.g., Lagos State"
								error={errors.customMarketRegion}
								required
							/>
						</div>
					{/if}

					<!-- Price and Unit -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							type="number"
							label="Price (₦)"
							bind:value={form.price}
							placeholder="0.00"
							error={errors.price}
							required
							min="0"
							step="0.01"
						/>

						<Input
							type="text"
							label="Unit"
							bind:value={form.unit}
							placeholder="e.g., per bag, per kg"
							error={errors.unit}
							required
							hint={selectedProduct ? `Default: ${selectedProduct.unit}` : showCustomProduct ? `From custom product: ${customProduct.unit}` : ''}
						/>
					</div>

					<!-- Notes -->
					<div>
						<label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
							Additional Notes (Optional)
						</label>
						<textarea
							id="notes"
							bind:value={form.notes}
							rows="3"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Any additional information about the price, quality, or market conditions..."
						></textarea>
					</div>

					<!-- Submit Buttons -->
					<div class="flex gap-4 pt-4">
						<Button
							type="submit"
							loading={isSubmitting}
							class="flex-1"
						>
							<Plus class="w-4 h-4 mr-2" />
							Submit Price
						</Button>
						
						<Button
							type="button"
							variant="outline"
							onclick={resetForm}
							disabled={isSubmitting}
						>
							Reset Form
						</Button>
					</div>
				</form>

				<!-- Help Text -->
				<div class="mt-6 p-4 bg-blue-50 rounded-lg">
					<h3 class="text-sm font-medium text-blue-900 mb-2">Submission Guidelines</h3>
					<ul class="text-sm text-blue-700 space-y-1">
						<li>• Ensure prices are current and accurate</li>
						<li>• Double-check the market and product selection</li>
						<li>• Include relevant notes about quality or market conditions</li>
						<li>• Submissions will be reviewed by admins before publication</li>
					</ul>
				</div>
			</div>
		{/if}
	</div>
</div>
