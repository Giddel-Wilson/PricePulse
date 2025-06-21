<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		color?: 'primary' | 'white' | 'gray';
		text?: string;
	}

	let { size = 'md', color = 'primary', text }: Props = $props();

	function getSizeClasses(size: string): string {
		switch (size) {
			case 'sm':
				return 'w-4 h-4';
			case 'lg':
				return 'w-8 h-8';
			case 'md':
			default:
				return 'w-6 h-6';
		}
	}

	function getColorClasses(color: string): string {
		switch (color) {
			case 'white':
				return 'text-white';
			case 'gray':
				return 'text-gray-600';
			case 'primary':
			default:
				return 'text-blue-600';
		}
	}
</script>

<div class="flex items-center justify-center space-x-2">
	<svg 
		class="{getSizeClasses(size)} {getColorClasses(color)} animate-spin" 
		xmlns="http://www.w3.org/2000/svg" 
		fill="none" 
		viewBox="0 0 24 24"
		aria-hidden="true"
	>
		<circle 
			class="opacity-25" 
			cx="12" 
			cy="12" 
			r="10" 
			stroke="currentColor" 
			stroke-width="4"
		></circle>
		<path 
			class="opacity-75" 
			fill="currentColor" 
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
	{#if text}
		<span class="text-sm {getColorClasses(color)}">{text}</span>
	{/if}
</div>
