<script lang="ts">
	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		label?: string;
		value?: string;
		options: Option[];
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		hint?: string;
		id?: string;
		name?: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let { 
		label,
		value = $bindable(''),
		options,
		placeholder = 'Select an option',
		required = false,
		disabled = false,
		error,
		hint,
		id,
		name,
		class: className = '',
		onchange
	}: Props = $props();

	const selectId = $derived(id || name || Math.random().toString(36).substring(2));
	const hasError = $derived(!!error);

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		value = target.value;
		onchange?.(target.value);
	}
</script>

<div class="w-full {className}">
	{#if label}
		<label for={selectId} class="block text-sm font-medium text-gray-700 mb-1">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}
	
	<select
		id={selectId}
		{name}
		{required}
		{disabled}
		bind:value
		onchange={handleChange}
		class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed {hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}"
	>
		{#if placeholder && !value}
			<option value="" disabled>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value} disabled={option.disabled}>
				{option.label}
			</option>
		{/each}
	</select>
	
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
