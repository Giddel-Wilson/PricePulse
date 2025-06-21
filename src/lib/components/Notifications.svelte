{#snippet icon(type: string)}
	{#if type === 'success'}
		<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
		</svg>
	{:else if type === 'error'}
		<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
		</svg>
	{:else if type === 'warning'}
		<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
		</svg>
	{:else}
		<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
		</svg>
	{/if}
{/snippet}

<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import { fly } from 'svelte/transition';
	import { X } from 'lucide-svelte';

	function getNotificationClasses(type: string): string {
		const baseClasses = 'flex items-center w-full max-w-sm p-4 mb-4 text-sm bg-white rounded-lg shadow-lg border-l-4';
		
		switch (type) {
			case 'success':
				return `${baseClasses} border-green-500 text-green-800`;
			case 'error':
				return `${baseClasses} border-red-500 text-red-800`;
			case 'warning':
				return `${baseClasses} border-yellow-500 text-yellow-800`;
			case 'info':
			default:
				return `${baseClasses} border-blue-500 text-blue-800`;
		}
	}

	function getIconClasses(type: string): string {
		const baseClasses = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg';
		
		switch (type) {
			case 'success':
				return `${baseClasses} text-green-500 bg-green-100`;
			case 'error':
				return `${baseClasses} text-red-500 bg-red-100`;
			case 'warning':
				return `${baseClasses} text-yellow-500 bg-yellow-100`;
			case 'info':
			default:
				return `${baseClasses} text-blue-500 bg-blue-100`;
		}
	}
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
	{#each $notifications.notifications as notification (notification.id)}
		<div 
			class={getNotificationClasses(notification.type)}
			transition:fly={{ x: 300, duration: 300 }}
			role="alert"
		>
			<div class={getIconClasses(notification.type)}>
				{@render icon(notification.type)}
			</div>
			<div class="ms-3 text-sm font-normal flex-1">
				{notification.message}
			</div>
			<button
				type="button"
				class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
				onclick={() => notifications.remove(notification.id)}
				aria-label="Close"
			>
				<X class="w-3 h-3" />
			</button>
		</div>
	{/each}
</div>
