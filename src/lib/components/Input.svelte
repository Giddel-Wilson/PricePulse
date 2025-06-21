<script lang="ts">
	interface Props {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
		label?: string;
		placeholder?: string;
		value?: string | number;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		hint?: string;
		id?: string;
		name?: string;
		autocomplete?: string;
		min?: number | string;
		max?: number | string;
		step?: number | string;
		class?: string;
		onchange?: (value: string) => void;
		oninput?: (value: string) => void;
	}

	let { 
		type = 'text',
		label,
		placeholder,
		value = $bindable(''),
		required = false,
		disabled = false,
		error,
		hint,
		id,
		name,
		autocomplete,
		min,
		max,
		step,
		class: className = '',
		onchange,
		oninput
	}: Props = $props();

	const inputId = $derived(id || name || Math.random().toString(36).substring(2));
	const hasError = $derived(!!error);

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = type === 'number' ? parseFloat(target.value) || 0 : target.value;
		oninput?.(target.value);
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		onchange?.(target.value);
	}
</script>

<div class="w-full {className}">
	{#if label}
		<label for={inputId} class="block text-sm font-medium text-gray-700 mb-1">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}
	
	<input
		{type}
		id={inputId}
		{name}
		{placeholder}
		{required}
		{disabled}
		autocomplete={autocomplete as any}
		{min}
		{max}
		{step}
		bind:value
		oninput={handleInput}
		onchange={handleChange}
		class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed {hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}"
	/>
	
	{#if error}
		<p class="mt-1 text-sm text-red-600" role="alert">
			{error}
		</p>
	{:else if hint}
		<p class="mt-1 text-sm text-gray-500">
			{hint}
		</p>
	{/if}
</div>
