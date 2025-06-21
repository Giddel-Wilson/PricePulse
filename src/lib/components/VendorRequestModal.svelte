<script lang="ts">
	import { onMount } from 'svelte';
	import { X } from 'lucide-svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import CountdownTimer from './CountdownTimer.svelte';
	import { notifications } from '$lib/stores/notifications';

	interface Props {
		isOpen: boolean;
		userEmail: string;
		onclose?: () => void;
		onsuccess?: () => void;
	}

	let { isOpen, userEmail, onclose, onsuccess }: Props = $props();

	let message = $state('');
	let isSubmitting = $state(false);
	let canRequest = $state(true);
	let timeRemaining = $state(0);
	let hasRejectionNotification = $state(false);

	onMount(() => {
		checkRequestStatus();
	});

	// Watch for modal opening to check status
	$effect(() => {
		if (isOpen) {
			checkRequestStatus();
		}
	});

	async function checkRequestStatus() {
		try {
			const response = await fetch(`/api/vendor-requests?email=${encodeURIComponent(userEmail)}`);
			const result = await response.json();

			if (result.success) {
				canRequest = result.canRequest;
				timeRemaining = result.timeRemaining || 0;

				// Check for rejection notification
				if (result.data?.status === 'REJECTED' && result.data?.canRequestAgainAt) {
					const now = new Date();
					const canRequestAgain = new Date(result.data.canRequestAgainAt);
					if (now < canRequestAgain && !hasRejectionNotification) {
						hasRejectionNotification = true;
						notifications.error('Your request has been reviewed by Admin and unfortunately was rejected. Maybe try again later, thank you.');
					}
				}
			}
		} catch (error) {
			console.error('Error checking request status:', error);
		}
	}

	function closeModal() {
		onclose?.();
		message = '';
	}

	function onCountdownComplete() {
		canRequest = true;
		timeRemaining = 0;
		notifications.info('You can now submit a new vendor request!');
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		
		if (isSubmitting) return;

		try {
			isSubmitting = true;

			const response = await fetch('/api/vendor-requests', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: userEmail,
					message: message.trim()
				})
			});

			const result = await response.json();

			if (result.success) {
				notifications.success('Vendor request submitted successfully! You will be notified once reviewed.');
				onsuccess?.();
				closeModal();
			} else {
				notifications.error(result.error || 'Failed to submit vendor request');
			}
		} catch (error) {
			console.error('Vendor request submission error:', error);
			notifications.error('Failed to submit vendor request');
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if isOpen}
	<!-- Modal Backdrop -->
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<!-- Modal Content -->
		<div class="bg-white rounded-lg shadow-xl max-w-md w-full">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b">
				<h2 class="text-xl font-semibold text-gray-900">Request Vendor Access</h2>
				<button 
					onclick={closeModal}
					class="text-gray-400 hover:text-gray-600 transition-colors"
				>
					<X class="w-6 h-6" />
				</button>
			</div>

			<!-- Modal Body -->
			<form onsubmit={handleSubmit} class="p-6">
				{#if !canRequest && timeRemaining > 0}
					<CountdownTimer 
						timeRemaining={timeRemaining} 
						onComplete={onCountdownComplete}
					/>
				{/if}

				<div class="space-y-4" class:opacity-50={!canRequest}>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
							Email Address
						</label>
						<Input
							id="email"
							type="email"
							value={userEmail}
							disabled
							class="bg-gray-50"
						/>
						<p class="text-xs text-gray-500 mt-1">
							This email will be used for your vendor account
						</p>
					</div>

					<div>
						<label for="message" class="block text-sm font-medium text-gray-700 mb-1">
							Request Message
						</label>
						<textarea
							id="message"
							bind:value={message}
							placeholder="Tell us why you want to become a vendor and any relevant experience..."
							rows="4"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
							required
							disabled={!canRequest}
						></textarea>
						<p class="text-xs text-gray-500 mt-1">
							Provide details about your business or market presence
						</p>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
					<Button
						type="button"
						variant="secondary"
						onclick={closeModal}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={isSubmitting}
						disabled={!message.trim() || !canRequest}
					>
						Submit Request
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
