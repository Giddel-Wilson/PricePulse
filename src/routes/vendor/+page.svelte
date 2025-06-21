<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { TrendingUp, Plus, Clock, CheckCircle, XCircle, Eye } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { formatPrice, formatDateTime } from '$lib/utils';
	import type { PriceEntryWithDetails } from '$lib/types';

	let userEntries: PriceEntryWithDetails[] = $state([]);
	let notifications: any[] = $state([]);
	let stats = $state({
		total: 0,
		pending: 0,
		approved: 0,
		rejected: 0
	});
	let isLoading = $state(true);
	let unreadCount = $state(0);

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

		await Promise.all([
			loadUserEntries(),
			loadNotifications()
		]);
	});

	async function loadUserEntries() {
		try {
			isLoading = true;
			
			// Get user's price entries with detailed information
			const response = await fetch('/api/prices?limit=100');
			const result = await response.json();

			if (result.success) {
				// Filter entries by current user and get recent submissions
				const allEntries = result.data.data;
				userEntries = allEntries
					.filter((entry: any) => entry.submittedBy === $auth.user?.id)
					.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				
				// Calculate stats
				stats.total = userEntries.length;
				stats.pending = userEntries.filter((e: any) => e.status === 'PENDING').length;
				stats.approved = userEntries.filter((e: any) => e.status === 'APPROVED').length;
				stats.rejected = userEntries.filter((e: any) => e.status === 'REJECTED').length;
			}
		} catch (error) {
			console.error('Failed to load user entries:', error);
		} finally {
			isLoading = false;
		}
	}

	async function loadNotifications() {
		try {
			const response = await fetch('/api/notifications?limit=10');
			const result = await response.json();

			if (result.success && result.data) {
				notifications = result.data.notifications || [];
				unreadCount = result.data.unreadCount || 0;
			}
		} catch (error) {
			console.error('Failed to load notifications:', error);
		}
	}

	async function markNotificationAsRead(notificationId: string) {
		try {
			const response = await fetch('/api/notifications', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ notificationId })
			});

			if (response.ok) {
				// Update local state
				notifications = notifications.map(n => 
					n.id === notificationId ? { ...n, read: true } : n
				);
				unreadCount = Math.max(0, unreadCount - 1);
			}
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
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

	function getStatusColor(status: string) {
		switch (status) {
			case 'APPROVED':
				return 'text-green-600 bg-green-100';
			case 'REJECTED':
				return 'text-red-600 bg-red-100';
			case 'PENDING':
			default:
				return 'text-yellow-600 bg-yellow-100';
		}
	}
</script>

<svelte:head>
	<title>Vendor Dashboard - PricePulse</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
			<p class="text-gray-600">Manage your price submissions and track their status</p>
		</div>

		{#if isLoading}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" text="Loading dashboard..." />
			</div>
		{:else}
			<!-- Stats Cards -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-blue-100 rounded-lg">
							<TrendingUp class="w-6 h-6 text-blue-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Total Submissions</p>
							<p class="text-2xl font-bold text-gray-900">{stats.total}</p>
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
							<p class="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
							<p class="text-2xl font-bold text-gray-900">{stats.approved}</p>
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
							<p class="text-2xl font-bold text-gray-900">{stats.rejected}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-4 mb-8">
				<Button>
					<a href="/vendor/submit" class="flex items-center">
						<Plus class="w-4 h-4 mr-2" />
						Submit New Price
					</a>
				</Button>
				<Button variant="outline">
					<a href="/search" class="flex items-center">
						<Eye class="w-4 h-4 mr-2" />
						View All Prices
					</a>
				</Button>
			</div>

			<!-- Recent Submissions -->
			<div class="bg-white rounded-lg shadow">
				<div class="px-6 py-4 border-b border-gray-200">
					<h2 class="text-xl font-semibold text-gray-900">Your Recent Submissions</h2>
				</div>

				{#if userEntries.length === 0}
					<div class="text-center py-12">
						<div class="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
							<TrendingUp class="w-8 h-8 text-gray-400" />
						</div>
						<h3 class="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
						<p class="text-gray-600 mb-4">Start by submitting your first price entry.</p>
						<Button>
							<a href="/vendor/submit">Submit Price</a>
						</Button>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Product
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Market
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Price
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Submitted
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Notes
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each userEntries.slice(0, 20) as entry}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 whitespace-nowrap">
											<div>
												<div class="text-sm font-medium text-gray-900">{(entry as any).product.name}</div>
												<div class="text-sm text-gray-500">{(entry as any).product.category.name}</div>
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="text-sm text-gray-900">{(entry as any).market.name}</div>
											<div class="text-sm text-gray-500">{(entry as any).market.location}</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="text-sm text-gray-900">
												{formatPrice((entry as any).price)} per {(entry as any).unit}
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor((entry as any).status)}">
												{#if (entry as any).status === 'APPROVED'}
													<CheckCircle class="w-3 h-3 mr-1" />
												{:else if (entry as any).status === 'REJECTED'}
													<XCircle class="w-3 h-3 mr-1" />
												{:else}
													<Clock class="w-3 h-3 mr-1" />
												{/if}
												{(entry as any).status.toLowerCase()}
											</span>
											{#if (entry as any).status === 'APPROVED'}
												<div class="text-xs text-green-600 mt-1">
													✓ Live on platform
												</div>
											{:else if (entry as any).status === 'REJECTED'}
												<div class="text-xs text-red-600 mt-1">
													✗ Not approved
												</div>
											{:else}
												<div class="text-xs text-yellow-600 mt-1">
													⏳ Awaiting review
												</div>
											{/if}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatDateTime((entry as any).createdAt)}
										</td>
										<td class="px-6 py-4">
											{#if (entry as any).notes}
												<div class="text-sm text-gray-900">
													{#if (entry as any).status === 'REJECTED'}
														<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700">
															<XCircle class="w-3 h-3 mr-1" />
															Rejection Reason
														</span>
														<div class="mt-1 text-sm text-gray-700 bg-red-50 p-2 rounded border-l-2 border-red-200">
															{(entry as any).notes}
														</div>
													{:else}
														<div class="text-sm text-gray-600 italic">
															{(entry as any).notes}
														</div>
													{/if}
												</div>
											{:else}
												<span class="text-xs text-gray-400">No notes</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
						
						{#if userEntries.length > 20}
							<div class="px-6 py-4 bg-gray-50 border-t">
								<p class="text-sm text-gray-600">
									Showing 20 of {userEntries.length} submissions. 
									<a href="/vendor/submissions" class="text-blue-600 hover:text-blue-500">View all</a>
								</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Notifications Section -->
			{#if notifications.length > 0}
				<div class="bg-white rounded-lg shadow mb-8">
					<div class="px-6 py-4 border-b border-gray-200">
						<div class="flex items-center justify-between">
							<h2 class="text-xl font-semibold text-gray-900">
								Recent Notifications
								{#if unreadCount > 0}
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
										{unreadCount} new
									</span>
								{/if}
							</h2>
						</div>
					</div>

					<div class="divide-y divide-gray-200">
						{#each notifications.slice(0, 5) as notification}
							<div class="p-6 {notification.read ? 'bg-white' : 'bg-blue-50'}" 
								 onclick={() => !notification.read && markNotificationAsRead(notification.id)}
								 onkeydown={(e) => e.key === 'Enter' && !notification.read && markNotificationAsRead(notification.id)}
								 role="button" 
								 tabindex="0">
								<div class="flex items-start">
									<div class="flex-shrink-0 mr-4">
										{#if notification.type === 'price_approved'}
											<div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
												<CheckCircle class="w-5 h-5 text-green-600" />
											</div>
										{:else if notification.type === 'price_rejected'}
											<div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
												<XCircle class="w-5 h-5 text-red-600" />
											</div>
										{:else}
											<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
												<Clock class="w-5 h-5 text-blue-600" />
											</div>
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<div class="flex items-center justify-between">
											<h3 class="text-sm font-medium text-gray-900">
												{notification.title}
											</h3>
											<span class="text-xs text-gray-500">
												{formatDateTime(notification.createdAt)}
											</span>
										</div>
										<p class="mt-1 text-sm text-gray-600">
											{notification.message}
										</p>
										{#if !notification.read}
											<div class="mt-2">
												<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													New
												</span>
											</div>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>

					{#if notifications.length > 5}
						<div class="px-6 py-4 bg-gray-50 border-t">
							<p class="text-sm text-gray-600">
								Showing 5 of {notifications.length} notifications.
							</p>
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>
