<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { notifications } from '$lib/stores/notifications';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { TrendingUp } from 'lucide-svelte';

	let form = {
		email: '',
		password: ''
	};
	let errors: Record<string, string> = {};
	let isLoading = false;

	// Redirect if already logged in
	onMount(() => {
		if ($auth.user) {
			goto('/');
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		errors = {};
		
		// Basic validation
		if (!form.email) {
			errors.email = 'Email is required';
		}
		if (!form.password) {
			errors.password = 'Password is required';
		}

		if (Object.keys(errors).length > 0) {
			return;
		}

		try {
			isLoading = true;
			
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			});

			const result = await response.json();

			if (result.success) {
				auth.setUser(result.data);
				notifications.success('Login successful! Welcome back.');
				goto('/');
			} else {
				notifications.error(result.error || 'Login failed');
			}
		} catch (error) {
			notifications.error('Network error. Please try again.');
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - PricePulse</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<!-- Header -->
		<div class="text-center">
			<div class="flex justify-center">
				<a href="/" class="flex items-center space-x-2">
					<TrendingUp class="h-10 w-10 text-blue-600" />
					<span class="text-2xl font-bold text-gray-900">PricePulse</span>
				</a>
			</div>
			<h2 class="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
			<p class="mt-2 text-sm text-gray-600">
				Or
				<a href="/register" class="font-medium text-blue-600 hover:text-blue-500">
					create a new account
				</a>
			</p>
		</div>

		<!-- Form -->
		<form onsubmit={handleSubmit} class="mt-8 space-y-6">
			<div class="space-y-4">
				<Input
					type="email"
					label="Email address"
					placeholder="Enter your email"
					bind:value={form.email}
					error={errors.email}
					required
					autocomplete="email"
				/>

				<Input
					type="password"
					label="Password"
					placeholder="Enter your password"
					bind:value={form.password}
					error={errors.password}
					required
					autocomplete="current-password"
				/>
			</div>

			<div class="flex items-center justify-between">
				<div class="text-sm">
					<a href="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
						Forgot your password?
					</a>
				</div>
			</div>

			<Button
				type="submit"
				fullWidth
				loading={isLoading}
			>
				Sign in
			</Button>
		</form>
	</div>
</div>
