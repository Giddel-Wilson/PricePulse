<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		timeRemaining: number; // seconds remaining
		onComplete?: () => void;
	}

	let { timeRemaining, onComplete }: Props = $props();

	let currentTime = $state(timeRemaining);
	let interval: NodeJS.Timeout | null = null;

	onMount(() => {
		if (currentTime > 0) {
			interval = setInterval(() => {
				currentTime -= 1;
				if (currentTime <= 0) {
					if (interval) {
						clearInterval(interval);
						interval = null;
					}
					onComplete?.();
				}
			}, 1000);
		}
	});

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}h ${minutes}m ${secs}s`;
		} else if (minutes > 0) {
			return `${minutes}m ${secs}s`;
		} else {
			return `${secs}s`;
		}
	}
</script>

{#if currentTime > 0}
	<div class="countdown-timer">
		<div class="timer-text">
			You can request vendor access again in:
		</div>
		<div class="timer-display">
			{formatTime(currentTime)}
		</div>
	</div>
{/if}

<style>
	.countdown-timer {
		background: linear-gradient(135deg, #fef3c7, #fcd34d);
		border: 1px solid #f59e0b;
		border-radius: 8px;
		padding: 16px;
		text-align: center;
		margin: 16px 0;
	}

	.timer-text {
		font-size: 14px;
		color: #92400e;
		margin-bottom: 8px;
	}

	.timer-display {
		font-size: 20px;
		font-weight: 600;
		color: #92400e;
		font-family: monospace;
	}
</style>
