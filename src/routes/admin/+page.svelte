<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { notifications } from '$lib/stores/notifications';
	import { goto } from '$app/navigation';
	import { 
		TrendingUp, 
		Users, 
		Clock, 
		CheckCircle, 
		XCircle
	} from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { formatPrice, formatDateTime } from '$lib/utils';
	import type { PriceEntryWithDetails, VendorRequest } from '$lib/types';

	let pendingEntries: PriceEntryWithDetails[] = $state([]);
	let vendorRequests: VendorRequest[] = $state([]);
	let stats = $state({
		totalEntries: 0,
		pendingEntries: 0,
		approvedEntries: 0,
		rejectedEntries: 0
	});
	let isLoading = $state(true);

	onMount(async () => {
		// Check if user is admin
		if (!$auth.user || $auth.user.role !== 'ADMIN') {
			goto('/');
			return;
		}

		await Promise.all([
			loadStats(),
			loadPendingEntries(),
			loadVendorRequests()
		]);
	});

	async function loadStats() {
		try {
			const response = await fetch('/api/prices');
			const result = await response.json();
			
			if (result.success && result.data) {
				const entries = result.data.data || [];
				stats.totalEntries = entries.length;
				stats.pendingEntries = entries.filter((e: any) => e.status === 'PENDING').length;
				stats.approvedEntries = entries.filter((e: any) => e.status === 'APPROVED').length;
				stats.rejectedEntries = entries.filter((e: any) => e.status === 'REJECTED').length;
			}
		} catch (error) {
			console.error('Failed to load stats:', error);
		}
	}

	async function loadPendingEntries() {
		try {
			const response = await fetch('/api/prices?status=PENDING');
			const result = await response.json();
			
			if (result.success && result.data) {
				pendingEntries = result.data.data as PriceEntryWithDetails[];
			}
		} catch (error) {
			console.error('Failed to load pending entries:', error);
		} finally {
			isLoading = false;
		}
	}

	async function loadVendorRequests() {
		try {
			const response = await fetch('/api/admin/vendor-requests');
			const result = await response.json();
			
			if (result.success) {
				vendorRequests = result.data as VendorRequest[];
			}
		} catch (error) {
			console.error('Failed to load vendor requests:', error);
		}
	}

	async function handleVendorRequest(requestId: string, status: 'APPROVED' | 'REJECTED', adminNotes?: string) {
		try {
			const response = await fetch('/api/admin/vendor-requests', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					id: requestId, 
					status, 
					adminNotes 
				})
			});

			const result = await response.json();

			if (result.success) {
				notifications.success(`Vendor request ${status.toLowerCase()} successfully`);
				await loadVendorRequests();
			} else {
				notifications.error(result.error || 'Failed to update vendor request');
			}
		} catch (error) {
			console.error('Failed to update vendor request:', error);
			notifications.error('Failed to update vendor request');
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
	<title>Admin Dashboard - PricePulse</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
			<p class="text-gray-600">Manage price submissions, vendor requests, and system statistics</p>
		</div>

		{#if isLoading}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" text="Loading dashboard..." />
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
							<p class="text-sm font-medium text-gray-600">Pending Review</p>
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

			<!-- Vendor Requests Section -->
			<div class="bg-white rounded-lg shadow mb-8">
				<div class="px-6 py-4 border-b border-gray-200">
					<h2 class="text-xl font-semibold text-gray-900">
						Vendor Requests ({vendorRequests.filter(r => r.status === 'PENDING').length} pending)
					</h2>
				</div>

				{#if vendorRequests.length === 0}
					<div class="text-center py-8">
						<Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<h3 class="text-lg font-medium text-gray-900 mb-2">No vendor requests</h3>
						<p class="text-gray-600">No vendor access requests have been submitted yet.</p>
					</div>
				{:else}
					<div class="divide-y divide-gray-200">
						{#each vendorRequests as request}
							<div class="p-6">
								<div class="flex justify-between items-start mb-4">
									<div class="flex-1">
										<div class="flex items-center mb-2">
											<h3 class="text-lg font-medium text-gray-900 mr-3">{request.email}</h3>
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(request.status)}">
												{#if request.status === 'APPROVED'}
													<CheckCircle class="w-3 h-3 mr-1" />
												{:else if request.status === 'REJECTED'}
													<XCircle class="w-3 h-3 mr-1" />
												{:else}
													<Clock class="w-3 h-3 mr-1" />
												{/if}
												{request.status.toLowerCase()}
											</span>
										</div>
										{#if request.message}
											<p class="text-sm text-gray-600 mb-2">{request.message}</p>
										{/if}
										<p class="text-xs text-gray-400">
											Submitted {formatDateTime(request.createdAt)}
										</p>
										{#if request.reviewedAt}
											<p class="text-xs text-gray-400">
												Reviewed {formatDateTime(request.reviewedAt)}
											</p>
										{/if}
										{#if request.adminNotes}
											<p class="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
												<strong>Admin Notes:</strong> {request.adminNotes}
											</p>
										{/if}
									</div>
									{#if request.status === 'PENDING'}
										<div class="flex space-x-2 ml-4">
											<Button
												variant="success"
												size="sm"
												onclick={() => handleVendorRequest(request.id, 'APPROVED')}
											>
												Approve
											</Button>
											<Button
												variant="danger"
												size="sm"
												onclick={() => {
													const reason = prompt('Enter rejection reason (optional):');
													const notes = reason || 'Your request has been reviewed by Admin and unfortunately was rejected. Maybe try again later, thank you.';
													handleVendorRequest(request.id, 'REJECTED', notes);
												}}
											>
												Reject
											</Button>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
