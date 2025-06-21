<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { notifications } from '$lib/stores/notifications';
	import { goto } from '$app/navigation';
	import { 
		TrendingUp, 
		Package, 
		MapPin,
		Search,
		Filter,
		Eye,
		CheckCircle,
		XCircle,
		Clock,
		Edit,
		Trash2,
		FileText,
		Calendar,
		User
	} from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Select from '$lib/components/Select.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { formatPrice, formatDateTime } from '$lib/utils';
	import type { PriceEntryWithDetails } from '$lib/types';

	let priceEntries: PriceEntryWithDetails[] = $state([]);
	let filteredEntries: PriceEntryWithDetails[] = $state([]);
	let isLoading = $state(true);
	let searchQuery = $state('');
	let statusFilter = $state('ALL');
	let categoryFilter = $state('ALL');
	let sortBy = $state('createdAt');
	let sortOrder = $state('desc');
	let currentPage = $state(1);
	let pageSize = $state(20);
	let totalEntries = $state(0);
	
	let stats = $state({
		totalEntries: 0,
		pendingEntries: 0,
		approvedEntries: 0,
		rejectedEntries: 0
	});

	let categories: any[] = $state([]);
	let markets: any[] = $state([]);

	onMount(async () => {
		// Check if user is admin
		if (!$auth.user || $auth.user.role !== 'ADMIN') {
			goto('/');
			return;
		}

		await Promise.all([
			loadPriceEntries(),
			loadCategories(),
			loadMarkets()
		]);
	});

	async function loadPriceEntries() {
		try {
			isLoading = true;
			const params = new URLSearchParams({
				limit: '1000', // Load all for filtering
				status: 'ALL'
			});

			const response = await fetch(`/api/prices?${params}`);
			const result = await response.json();

			if (result.success) {
				priceEntries = result.data.data as PriceEntryWithDetails[];
				totalEntries = priceEntries.length;
				calculateStats();
				applyFilters();
			} else {
				notifications.error(result.error || 'Failed to load price entries');
			}
		} catch (error) {
			console.error('Failed to load price entries:', error);
			notifications.error('Failed to load price entries');
		} finally {
			isLoading = false;
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

	function calculateStats() {
		stats.totalEntries = priceEntries.length;
		stats.pendingEntries = priceEntries.filter(e => e.status === 'PENDING').length;
		stats.approvedEntries = priceEntries.filter(e => e.status === 'APPROVED').length;
		stats.rejectedEntries = priceEntries.filter(e => e.status === 'REJECTED').length;
	}

	function applyFilters() {
		let filtered = priceEntries.filter(entry => {
			const matchesSearch = searchQuery === '' || 
				(entry as any).product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(entry as any).market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(entry as any).user.name.toLowerCase().includes(searchQuery.toLowerCase());
			
			const matchesStatus = statusFilter === 'ALL' || entry.status === statusFilter;
			const matchesCategory = categoryFilter === 'ALL' || (entry as any).product.categoryId === categoryFilter;

			return matchesSearch && matchesStatus && matchesCategory;
		});

		// Sort
		filtered.sort((a, b) => {
			let aVal, bVal;
			
			switch (sortBy) {
				case 'product':
					aVal = (a as any).product.name;
					bVal = (b as any).product.name;
					break;
				case 'price':
					aVal = a.price;
					bVal = b.price;
					break;
				case 'market':
					aVal = (a as any).market.name;
					bVal = (b as any).market.name;
					break;
				case 'status':
					aVal = a.status;
					bVal = b.status;
					break;
				case 'createdAt':
				default:
					aVal = new Date(a.createdAt).getTime();
					bVal = new Date(b.createdAt).getTime();
					break;
			}

			if (typeof aVal === 'string') {
				aVal = aVal.toLowerCase();
				bVal = bVal.toLowerCase();
			}

			if (sortOrder === 'asc') {
				return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
			} else {
				return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
			}
		});

		filteredEntries = filtered;
	}

	$effect(() => {
		applyFilters();
	});

	async function updateEntryStatus(entryId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', notes?: string) {
		try {
			const response = await fetch(`/api/prices/${entryId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status, notes })
			});

			const result = await response.json();

			if (result.success) {
				notifications.success(`Price entry ${status.toLowerCase()} successfully`);
				await loadPriceEntries();
			} else {
				notifications.error(result.error || 'Failed to update entry');
			}
		} catch (error) {
			console.error('Failed to update entry:', error);
			notifications.error('Failed to update entry');
		}
	}

	async function deleteEntry(entryId: string) {
		if (!confirm('Are you sure you want to delete this price entry? This action cannot be undone.')) {
			return;
		}

		try {
			const response = await fetch(`/api/prices/${entryId}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (result.success) {
				notifications.success('Price entry deleted successfully');
				await loadPriceEntries();
			} else {
				notifications.error(result.error || 'Failed to delete entry');
			}
		} catch (error) {
			console.error('Failed to delete entry:', error);
			notifications.error('Failed to delete entry');
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'APPROVED':
				return 'bg-green-100 text-green-800';
			case 'REJECTED':
				return 'bg-red-100 text-red-800';
			case 'PENDING':
			default:
				return 'bg-yellow-100 text-yellow-800';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'APPROVED':
				return CheckCircle;
			case 'REJECTED':
				return XCircle;
			case 'PENDING':
			default:
				return Clock;
		}
	}

	// Pagination
	let paginatedEntries = $derived(filteredEntries.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	));

	let totalPages = $derived(Math.ceil(filteredEntries.length / pageSize));
</script>

<svelte:head>
	<title>Manage Prices - Admin - PricePulse</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 mb-2">Manage Prices</h1>
					<p class="text-gray-600">Review, approve, and manage all price submissions</p>
				</div>
				<Button onclick={() => goto('/admin')}>
					← Back to Dashboard
				</Button>
			</div>
		</div>

		{#if isLoading}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" text="Loading price entries..." />
			</div>
		{:else}
			<!-- Stats Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-blue-100 rounded-lg">
							<TrendingUp class="w-6 h-6 text-blue-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Total Entries</p>
							<p class="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-yellow-100 rounded-lg">
							<Clock class="w-6 h-6 text-yellow-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Pending</p>
							<p class="text-2xl font-bold text-gray-900">{stats.pendingEntries}</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-green-100 rounded-lg">
							<CheckCircle class="w-6 h-6 text-green-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Approved</p>
							<p class="text-2xl font-bold text-gray-900">{stats.approvedEntries}</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-red-100 rounded-lg">
							<XCircle class="w-6 h-6 text-red-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Rejected</p>
							<p class="text-2xl font-bold text-gray-900">{stats.rejectedEntries}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Filters and Search -->
			<div class="bg-white rounded-lg shadow p-6 mb-8">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
						<div class="relative">
							<Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<Input
								type="text"
								placeholder="Search products, markets, vendors..."
								bind:value={searchQuery}
								class="pl-10"
							/>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
						<Select 
							bind:value={statusFilter}
							options={[
								{ value: 'ALL', label: 'All Status' },
								{ value: 'PENDING', label: 'Pending' },
								{ value: 'APPROVED', label: 'Approved' },
								{ value: 'REJECTED', label: 'Rejected' }
							]}
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
						<Select 
							bind:value={categoryFilter}
							options={[
								{ value: 'ALL', label: 'All Categories' },
								...categories.map(cat => ({ value: cat.id, label: cat.name }))
							]}
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
						<Select 
							bind:value={sortBy}
							options={[
								{ value: 'createdAt', label: 'Date' },
								{ value: 'product', label: 'Product' },
								{ value: 'price', label: 'Price' },
								{ value: 'market', label: 'Market' },
								{ value: 'status', label: 'Status' }
							]}
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
						<Select 
							bind:value={sortOrder}
							options={[
								{ value: 'desc', label: 'Newest First' },
								{ value: 'asc', label: 'Oldest First' }
							]}
						/>
					</div>
				</div>
			</div>

			<!-- Price Entries Table -->
			<div class="bg-white rounded-lg shadow overflow-hidden">
				<div class="px-6 py-4 border-b border-gray-200">
					<h2 class="text-xl font-semibold text-gray-900">
						Price Entries ({filteredEntries.length})
					</h2>
				</div>

				{#if filteredEntries.length === 0}
					<div class="text-center py-12">
						<Package class="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<h3 class="text-lg font-medium text-gray-900 mb-2">No price entries found</h3>
						<p class="text-gray-600">Try adjusting your search or filter criteria.</p>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each paginatedEntries as entry}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 whitespace-nowrap">
											<div>
												<div class="text-sm font-medium text-gray-900">{(entry as any).product.name}</div>
												<div class="text-sm text-gray-500">{(entry as any).product.category.name}</div>
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="text-lg font-bold text-blue-600">{formatPrice(entry.price)}</div>
											<div class="text-sm text-gray-500">per {entry.unit}</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="flex items-center">
												<MapPin class="w-4 h-4 text-gray-400 mr-1" />
												<div>
													<div class="text-sm text-gray-900">{(entry as any).market.name}</div>
													<div class="text-sm text-gray-500">{(entry as any).market.location}</div>
												</div>
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="flex items-center">
												<User class="w-4 h-4 text-gray-400 mr-1" />
												<div class="text-sm text-gray-900">{(entry as any).user.name}</div>
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(entry.status)}">
												{#if entry.status === 'APPROVED'}
													<CheckCircle class="w-3 h-3 mr-1" />
												{:else if entry.status === 'REJECTED'}
													<XCircle class="w-3 h-3 mr-1" />
												{:else}
													<Clock class="w-3 h-3 mr-1" />
												{/if}
												{entry.status.toLowerCase()}
											</span>
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<div class="flex items-center">
												<Calendar class="w-3 h-3 mr-1" />
												{formatDateTime(entry.createdAt)}
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div class="flex items-center space-x-2">
												{#if entry.status === 'PENDING'}
													<Button
														size="sm"
														variant="success"
														onclick={() => updateEntryStatus(entry.id, 'APPROVED')}
													>
														<CheckCircle class="w-3 h-3 mr-1" />
														Approve
													</Button>
													<Button
														size="sm"
														variant="danger"
														onclick={() => {
															const reason = prompt('Enter rejection reason (optional):');
															updateEntryStatus(entry.id, 'REJECTED', reason || 'Price not verified');
														}}
													>
														<XCircle class="w-3 h-3 mr-1" />
														Reject
													</Button>
												{:else}
													<Button
														size="sm"
														variant="outline"
														onclick={() => updateEntryStatus(entry.id, 'PENDING')}
													>
														<Clock class="w-3 h-3 mr-1" />
														Reset
													</Button>
												{/if}

												<Button
													size="sm"
													variant="outline"
													onclick={() => deleteEntry(entry.id)}
												>
													<Trash2 class="w-3 h-3 mr-1" />
													Delete
												</Button>
											</div>
											
											{#if entry.notes}
												<div class="mt-2 text-xs text-gray-500 p-2 bg-gray-50 rounded">
													<FileText class="w-3 h-3 inline mr-1" />
													{entry.notes}
												</div>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Pagination -->
					{#if totalPages > 1}
						<div class="px-6 py-4 border-t border-gray-200">
							<div class="flex items-center justify-between">
								<div class="text-sm text-gray-700">
									Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredEntries.length)} of {filteredEntries.length} entries
								</div>
								<div class="flex space-x-2">
									<Button
										size="sm"
										variant="outline"
										disabled={currentPage === 1}
										onclick={() => currentPage = Math.max(1, currentPage - 1)}
									>
										Previous
									</Button>
									
									{#each Array.from({length: Math.min(5, totalPages)}, (_, i) => i + Math.max(1, currentPage - 2)) as page}
										{#if page <= totalPages}
											<Button
												size="sm"
												variant={page === currentPage ? 'primary' : 'outline'}
												onclick={() => currentPage = page}
											>
												{page}
											</Button>
										{/if}
									{/each}
									
									<Button
										size="sm"
										variant="outline"
										disabled={currentPage === totalPages}
										onclick={() => currentPage = Math.min(totalPages, currentPage + 1)}
									>
										Next
									</Button>
								</div>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</div>
