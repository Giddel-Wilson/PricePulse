<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { notifications } from '$lib/stores/notifications';
	import { goto } from '$app/navigation';
	import { 
		Mail, 
		MailOpen, 
		Reply, 
		Archive, 
		Eye,
		Trash2,
		Filter,
		Search
	} from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { formatDateTime } from '$lib/utils';

	interface ContactMessage {
		id: string;
		name: string;
		email: string;
		subject: string;
		message: string;
		status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
		adminNotes?: string;
		createdAt: string;
		readAt?: string;
		repliedAt?: string;
	}

	let messages: ContactMessage[] = $state([]);
	let isLoading = $state(true);
	let selectedMessage: ContactMessage | null = $state(null);
	let filterStatus = $state('ALL');
	let searchQuery = $state('');
	let showReplyModal = $state(false);
	let replyMessage = $state('');
	let adminNotes = $state('');

	// Filter messages based on status and search
	let filteredMessages = $derived(messages.filter(message => {
		const matchesStatus = filterStatus === 'ALL' || message.status === filterStatus;
		const matchesSearch = searchQuery === '' || 
			message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			message.subject.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesStatus && matchesSearch;
	}));

	onMount(async () => {
		// Check if user is admin
		if (!$auth.user || $auth.user.role !== 'ADMIN') {
			goto('/auth/login');
			return;
		}
		await loadMessages();
	});

	async function loadMessages() {
		try {
			isLoading = true;
			const response = await fetch('/api/admin/contact-messages');
			if (!response.ok) throw new Error('Failed to load messages');
			
			const data = await response.json();
			messages = data.messages;
		} catch (error) {
			notifications.add({ type: 'error', message: 'Failed to load contact messages' });
			console.error('Error loading messages:', error);
		} finally {
			isLoading = false;
		}
	}

	async function markAsRead(messageId: string) {
		try {
			const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'READ' })
			});

			if (!response.ok) throw new Error('Failed to mark as read');
			
			const index = messages.findIndex(m => m.id === messageId);
			if (index !== -1) {
				messages[index].status = 'READ';
				messages[index].readAt = new Date().toISOString();
			}
		} catch (error) {
			notifications.add({ type: 'error', message: 'Failed to mark message as read' });
		}
	}

	async function updateStatus(messageId: string, status: string, notes?: string) {
		try {
			const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status, adminNotes: notes })
			});

			if (!response.ok) throw new Error('Failed to update status');
			
			const index = messages.findIndex(m => m.id === messageId);
			if (index !== -1) {
				messages[index].status = status as any;
				if (notes) messages[index].adminNotes = notes;
				if (status === 'REPLIED') {
					messages[index].repliedAt = new Date().toISOString();
				}
			}

			notifications.add({ type: 'success', message: 'Message status updated successfully' });
		} catch (error) {
			notifications.add({ type: 'error', message: 'Failed to update message status' });
		}
	}

	function openMessage(message: ContactMessage) {
		selectedMessage = message;
		if (message.status === 'UNREAD') {
			markAsRead(message.id);
		}
	}

	function closeMessage() {
		selectedMessage = null;
		showReplyModal = false;
		replyMessage = '';
		adminNotes = '';
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'UNREAD': return Mail;
			case 'READ': return MailOpen;
			case 'REPLIED': return Reply;
			case 'ARCHIVED': return Archive;
			default: return Mail;
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'UNREAD': return 'bg-blue-100 text-blue-800';
			case 'READ': return 'bg-green-100 text-green-800';
			case 'REPLIED': return 'bg-purple-100 text-purple-800';
			case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>Contact Messages - PricePulse Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Contact Messages</h1>
			<p class="text-gray-600 mt-2">Manage customer inquiries and support requests</p>
		</div>
		<Button onclick={loadMessages} disabled={isLoading}>
			{#if isLoading}
				<LoadingSpinner size="sm" />
			{/if}
			Refresh
		</Button>
	</div>

	<!-- Filters and Search -->
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
		<div class="flex flex-col sm:flex-row gap-4">
			<!-- Search -->
			<div class="flex-1">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
					<input
						type="text"
						placeholder="Search by name, email, or subject..."
						bind:value={searchQuery}
						class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			</div>

			<!-- Status Filter -->
			<div class="sm:w-48">
				<select
					bind:value={filterStatus}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				>
					<option value="ALL">All Messages</option>
					<option value="UNREAD">Unread</option>
					<option value="READ">Read</option>
					<option value="REPLIED">Replied</option>
					<option value="ARCHIVED">Archived</option>
				</select>
			</div>
		</div>

		<!-- Stats -->
		<div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
			<div class="text-center">
				<div class="text-2xl font-bold text-blue-600">{messages.filter(m => m.status === 'UNREAD').length}</div>
				<div class="text-sm text-gray-500">Unread</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-green-600">{messages.filter(m => m.status === 'READ').length}</div>
				<div class="text-sm text-gray-500">Read</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-purple-600">{messages.filter(m => m.status === 'REPLIED').length}</div>
				<div class="text-sm text-gray-500">Replied</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-gray-600">{messages.filter(m => m.status === 'ARCHIVED').length}</div>
				<div class="text-sm text-gray-500">Archived</div>
			</div>
		</div>
	</div>

	{#if isLoading}
		<div class="flex justify-center py-12">
			<LoadingSpinner size="lg" />
		</div>
	{:else if filteredMessages.length === 0}
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
			<Mail class="mx-auto text-gray-400 mb-4" size={48} />
			<h3 class="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
			<p class="text-gray-500">
				{searchQuery || filterStatus !== 'ALL' 
					? 'Try adjusting your search or filter criteria.' 
					: 'Contact messages will appear here when customers reach out.'
				}
			</p>
		</div>
	{:else}
		<!-- Messages List -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<div class="divide-y divide-gray-200">					{#each filteredMessages as message (message.id)}
						{@const StatusIcon = getStatusIcon(message.status)}
						<div 
							class="p-6 hover:bg-gray-50 cursor-pointer transition-colors {message.status === 'UNREAD' ? 'bg-blue-50' : ''}"
							onclick={() => openMessage(message)}
							onkeydown={(e) => e.key === 'Enter' && openMessage(message)}
							role="button"
							tabindex="0"
						>
							<div class="flex items-center justify-between">
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-3 mb-2">
										<StatusIcon size={20} class="text-gray-400" />
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(message.status)}">
											{message.status.toLowerCase()}
										</span>
										{#if message.status === 'UNREAD'}
											<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
										{/if}
									</div>
									<div class="flex items-center gap-4 mb-2">
										<h3 class="text-lg font-semibold text-gray-900 truncate">{message.subject}</h3>
										<span class="text-sm text-gray-500 whitespace-nowrap">{formatDateTime(message.createdAt)}</span>
									</div>
									<div class="flex items-center gap-4 mb-2">
										<span class="font-medium text-gray-900">{message.name}</span>
										<button 
											class="text-blue-600 hover:text-blue-800 underline"
											onclick={(e) => { e.stopPropagation(); window.location.href = `mailto:${message.email}`; }}
										>
											{message.email}
										</button>
									</div>
									<p class="text-gray-600 line-clamp-2">{message.message}</p>
								</div>
								<div class="ml-4 flex-shrink-0">
									<Eye class="text-gray-400" size={20} />
								</div>
							</div>
						</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<!-- Message Detail Modal -->
{#if selectedMessage}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<div>
					<h2 class="text-xl font-semibold text-gray-900">Message Details</h2>
					<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(selectedMessage.status)} mt-2">
						{selectedMessage.status.toLowerCase()}
					</span>
				</div>
				<button
					onclick={closeMessage}
					class="text-gray-400 hover:text-gray-600 transition-colors"
					aria-label="Close message"
				>
					<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Content -->
			<div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
				<!-- Message Info -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div>
						<h3 class="font-semibold text-gray-900 mb-4">Contact Information</h3>
						<div class="space-y-3">
							<div>
								<span class="text-sm font-medium text-gray-500">Name:</span>
								<p class="text-gray-900">{selectedMessage.name}</p>
							</div>
							<div>
								<span class="text-sm font-medium text-gray-500">Email:</span>
								<a href="mailto:{selectedMessage.email}" class="text-blue-600 hover:text-blue-800">{selectedMessage.email}</a>
							</div>
							<div>
								<span class="text-sm font-medium text-gray-500">Subject:</span>
								<p class="text-gray-900">{selectedMessage.subject}</p>
							</div>
						</div>
					</div>
					<div>
						<h3 class="font-semibold text-gray-900 mb-4">Message Details</h3>
						<div class="space-y-3">
							<div>
								<span class="text-sm font-medium text-gray-500">Received:</span>
								<p class="text-gray-900">{formatDateTime(selectedMessage.createdAt)}</p>
							</div>
							{#if selectedMessage.readAt}
								<div>
									<span class="text-sm font-medium text-gray-500">Read:</span>
									<p class="text-gray-900">{formatDateTime(selectedMessage.readAt)}</p>
								</div>
							{/if}
							{#if selectedMessage.repliedAt}
								<div>
									<span class="text-sm font-medium text-gray-500">Replied:</span>
									<p class="text-gray-900">{formatDateTime(selectedMessage.repliedAt)}</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Message Content -->
				<div class="mb-6">
					<h3 class="font-semibold text-gray-900 mb-4">Message</h3>
					<div class="bg-gray-50 p-4 rounded-lg">
						<p class="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
					</div>
				</div>

				<!-- Admin Notes -->
				<div class="mb-6">
					<h3 class="font-semibold text-gray-900 mb-4">Admin Notes</h3>
					<textarea
						bind:value={adminNotes}
						placeholder="Add internal notes about this message..."
						rows="4"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					></textarea>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
				<div class="flex gap-2">
					<Button
						variant="secondary"
						onclick={() => selectedMessage && updateStatus(selectedMessage.id, 'ARCHIVED', adminNotes)}
					>
						<Archive size={16} />
						Archive
					</Button>
				</div>
				<div class="flex gap-2">
					<Button
						variant="secondary"
						onclick={() => selectedMessage && updateStatus(selectedMessage.id, 'READ', adminNotes)}
					>
						Mark as Read
					</Button>
					<Button
						onclick={() => selectedMessage && updateStatus(selectedMessage.id, 'REPLIED', adminNotes)}
					>
						<Reply size={16} />
						Mark as Replied
					</Button>
					<a
						href="mailto:{selectedMessage?.email}?subject=Re: {selectedMessage?.subject}&body=Hi {selectedMessage?.name},%0D%0A%0D%0AThank you for contacting PricePulse.%0D%0A%0D%0A"
						class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						onclick={() => selectedMessage && updateStatus(selectedMessage.id, 'REPLIED', adminNotes)}
					>
						<Reply size={16} />
						Reply via Email
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
