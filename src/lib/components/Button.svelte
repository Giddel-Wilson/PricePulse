<script lang="ts">
	import LoadingSpinner from './LoadingSpinner.svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		fullWidth?: boolean;
		onclick?: () => void;
		children: any;
		class?: string;
	}

	let { 
		variant = 'primary', 
		size = 'md', 
		loading = false, 
		disabled = false, 
		type = 'button',
		fullWidth = false,
		onclick,
		children,
		class: className = ''
	}: Props = $props();

	function getBaseClasses(): string {
		return 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
	}

	function getSizeClasses(size: string): string {
		switch (size) {
			case 'sm':
				return 'px-3 py-2 text-sm';
			case 'lg':
				return 'px-6 py-3 text-base';
			case 'md':
			default:
				return 'px-4 py-2.5 text-sm';
		}
	}

	function getVariantClasses(variant: string): string {
		switch (variant) {
			case 'secondary':
				return 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500';
			case 'danger':
				return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
			case 'success':
				return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
			case 'outline':
				return 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500';
			case 'primary':
			default:
				return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
		}
	}

	const isDisabled = $derived(disabled || loading);
	const classes = $derived([
		getBaseClasses(),
		getSizeClasses(size),
		getVariantClasses(variant),
		fullWidth ? 'w-full' : '',
		className
	].join(' '));
</script>

<button 
	{type}
	class={classes}
	disabled={isDisabled}
	onclick={onclick}
>
	{#if loading}
		<LoadingSpinner size="sm" color={variant === 'outline' ? 'gray' : 'white'} />
		<span class="ml-2">Loading...</span>
	{:else}
		{@render children()}
	{/if}
</button>
