<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { notifications } from '$lib/stores/notifications';
	import { goto } from '$app/navigation';
	import { 
		Users, 
		UserCheck, 
		UserX, 
		Mail,
		Calendar,
		Search,
		Filter,
		MoreVertical,
		Edit,
		Ban,
		CheckCircle,
		XCircle,
		Clock
	} from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Select from '$lib/components/Select.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { formatDateTime } from '$lib/utils';
	import type { User } from '$lib/types';

	let users: User[] = $state([]);
	let filteredUsers: User[] = $state([]);
	let isLoading = $state(true);
	let searchQuery = $state('');
	let roleFilter = $state('ALL');
	let statusFilter = $state('ALL');
	let stats = $state({
		totalUsers: 0,
		activeUsers: 0,
		vendors: 0,
		admins: 0,
		suspendedUsers: 0
	});

	onMount(async () => {
		// Check if user is admin
		if (!$auth.user || $auth.user.role !== 'ADMIN') {
			goto('/');
			return;
		}

		await loadUsers();
	});

	async function loadUsers() {
		try {
			isLoading = true;
			const response = await fetch('/api/admin/users');
			const result = await response.json();

			if (result.success) {
				users = result.data as User[];
				calculateStats();
				applyFilters();
			} else {
				notifications.error(result.error || 'Failed to load users');
			}
		} catch (error) {
			console.error('Failed to load users:', error);
			notifications.error('Failed to load users');
		} finally {
			isLoading = false;
		}
	}

	function calculateStats() {
		stats.totalUsers = users.length;
		stats.activeUsers = users.filter(u => u.status === 'ACTIVE').length;
		stats.vendors = users.filter(u => u.role === 'VENDOR').length;
		stats.admins = users.filter(u => u.role === 'ADMIN').length;
		stats.suspendedUsers = users.filter(u => u.status === 'SUSPENDED').length;
	}

	function applyFilters() {
		filteredUsers = users.filter(user => {
			const matchesSearch = searchQuery === '' || 
				user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.email.toLowerCase().includes(searchQuery.toLowerCase());
			
			const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
			const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

			return matchesSearch && matchesRole && matchesStatus;
		});
	}

	$effect(() => {
		applyFilters();
	});

	async function updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'BANNED') {
		try {
			const response = await fetch('/api/admin/users', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					userId, 
					status 
				})
			});

			const result = await response.json();

			if (result.success) {
				notifications.success(`User status updated to ${status.toLowerCase()}`);
				await loadUsers();
			} else {
				notifications.error(result.error || 'Failed to update user status');
			}
		} catch (error) {
			console.error('Failed to update user status:', error);
			notifications.error('Failed to update user status');
		}
	}

	async function updateUserRole(userId: string, role: 'USER' | 'VENDOR' | 'ADMIN') {
		try {
			const response = await fetch('/api/admin/users', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					userId, 
					role 
				})
			});

			const result = await response.json();

			if (result.success) {
				notifications.success(`User role updated to ${role.toLowerCase()}`);
				await loadUsers();
			} else {
				notifications.error(result.error || 'Failed to update user role');
			}
		} catch (error) {
			console.error('Failed to update user role:', error);
			notifications.error('Failed to update user role');
		}
	}

	function getRoleColor(role: string) {
		switch (role) {
			case 'ADMIN':
				return 'bg-purple-100 text-purple-800';
			case 'VENDOR':
				return 'bg-blue-100 text-blue-800';
			case 'USER':
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'ACTIVE':
				return 'bg-green-100 text-green-800';
			case 'SUSPENDED':
				return 'bg-yellow-100 text-yellow-800';
			case 'BANNED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'ACTIVE':
				return CheckCircle;
			case 'SUSPENDED':
				return Clock;
			case 'BANNED':
				return XCircle;
			default:
				return XCircle;
		}
	}
</script>

<svelte:head>
	<title>Manage Users - Admin - PricePulse</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
					<p class="text-gray-600">View and manage user accounts, roles, and permissions</p>
				</div>
				<Button onclick={() => goto('/admin')}>
					← Back to Dashboard
				</Button>
			</div>
		</div>

		{#if isLoading}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" text="Loading users..." />
			</div>
		{:else}
			<!-- Stats Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-blue-100 rounded-lg">
							<Users class="w-6 h-6 text-blue-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Total Users</p>
							<p class="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-green-100 rounded-lg">
							<UserCheck class="w-6 h-6 text-green-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Active</p>
							<p class="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-purple-100 rounded-lg">
							<UserCheck class="w-6 h-6 text-purple-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Admins</p>
							<p class="text-2xl font-bold text-gray-900">{stats.admins}</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-blue-100 rounded-lg">
							<Users class="w-6 h-6 text-blue-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Vendors</p>
							<p class="text-2xl font-bold text-gray-900">{stats.vendors}</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center">
						<div class="p-2 bg-yellow-100 rounded-lg">
							<UserX class="w-6 h-6 text-yellow-600" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">Suspended</p>
							<p class="text-2xl font-bold text-gray-900">{stats.suspendedUsers}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Filters -->
			<div class="bg-white rounded-lg shadow p-6 mb-8">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
						<div class="relative">
							<Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<Input
								type="text"
								placeholder="Search by name or email..."
								bind:value={searchQuery}
								class="pl-10"
							/>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
						<Select 
							bind:value={roleFilter}
							options={[
								{ value: 'ALL', label: 'All Roles' },
								{ value: 'USER', label: 'Users' },
								{ value: 'VENDOR', label: 'Vendors' },
								{ value: 'ADMIN', label: 'Admins' }
							]}
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
						<Select 
							bind:value={statusFilter}
							options={[
								{ value: 'ALL', label: 'All Status' },
								{ value: 'ACTIVE', label: 'Active' },
								{ value: 'SUSPENDED', label: 'Suspended' },
								{ value: 'BANNED', label: 'Banned' }
							]}
						/>
					</div>
				</div>
			</div>

			<!-- Users Table -->
			<div class="bg-white rounded-lg shadow overflow-hidden">
				<div class="px-6 py-4 border-b border-gray-200">
					<h2 class="text-xl font-semibold text-gray-900">
						Users ({filteredUsers.length})
					</h2>
				</div>

				{#if filteredUsers.length === 0}
					<div class="text-center py-12">
						<Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
						<p class="text-gray-600">Try adjusting your search or filter criteria.</p>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each filteredUsers as user}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="flex items-center">
												<div class="flex-shrink-0 h-10 w-10">
													<div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
														<span class="text-sm font-medium text-gray-700">
															{user.name.charAt(0).toUpperCase()}
														</span>
													</div>
												</div>
												<div class="ml-4">
													<div class="text-sm font-medium text-gray-900">{user.name}</div>
													<div class="text-sm text-gray-500 flex items-center">
														<Mail class="w-3 h-3 mr-1" />
														{user.email}
													</div>
												</div>
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getRoleColor(user.role)}">
												{user.role.toLowerCase()}
											</span>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(user.status)}">
												{#if user.status === 'ACTIVE'}
													<CheckCircle class="w-3 h-3 mr-1" />
												{:else if user.status === 'SUSPENDED'}
													<Clock class="w-3 h-3 mr-1" />
												{:else}
													<XCircle class="w-3 h-3 mr-1" />
												{/if}
												{user.status.toLowerCase()}
											</span>
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<div class="flex items-center">
												<Calendar class="w-3 h-3 mr-1" />
												{formatDateTime(user.createdAt)}
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
											{#if user.id !== $auth.user?.id}
												<div class="flex items-center space-x-2">
													<!-- Role Actions -->
													{#if user.role !== 'ADMIN'}
														<Button
															size="sm"
															variant="outline"
															onclick={() => {
																const newRole = user.role === 'VENDOR' ? 'USER' : 'VENDOR';
																updateUserRole(user.id, newRole);
															}}
														>
															{user.role === 'VENDOR' ? 'Demote' : 'Make Vendor'}
														</Button>
													{/if}

													<!-- Status Actions -->
													{#if user.status === 'ACTIVE'}
														<Button
															size="sm"
															variant="danger"
															onclick={() => updateUserStatus(user.id, 'SUSPENDED')}
														>
															<Ban class="w-3 h-3 mr-1" />
															Suspend
														</Button>
													{:else if user.status === 'SUSPENDED'}
														<Button
															size="sm"
															variant="success"
															onclick={() => updateUserStatus(user.id, 'ACTIVE')}
														>
															<CheckCircle class="w-3 h-3 mr-1" />
															Activate
														</Button>
														<Button
															size="sm"
															variant="danger"
															onclick={() => updateUserStatus(user.id, 'BANNED')}
														>
															<XCircle class="w-3 h-3 mr-1" />
															Ban
														</Button>
													{:else}
														<Button
															size="sm"
															variant="success"
															onclick={() => updateUserStatus(user.id, 'ACTIVE')}
														>
															<CheckCircle class="w-3 h-3 mr-1" />
															Unban
														</Button>
													{/if}
												</div>
											{:else}
												<span class="text-gray-400 text-xs">Current User</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
