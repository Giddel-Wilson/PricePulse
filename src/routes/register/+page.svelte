<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { notifications } from '$lib/stores/notifications';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { TrendingUp } from 'lucide-svelte';
	import { validateEmail, validatePassword } from '$lib/utils';

	let form = {
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	};
	let errors: Record<string, string> = {};
	let isLoading = false;

	// Redirect if already logged in
	onMount(() => {
		if ($auth.user) {
			goto('/');
		}
	});

	function validateForm() {
		errors = {};

		if (!form.name.trim()) {
			errors.name = 'Name is required';
		}

		if (!form.email) {
			errors.email = 'Email is required';
		} else if (!validateEmail(form.email)) {
			errors.email = 'Please enter a valid email address';
		}

		if (!form.password) {
			errors.password = 'Password is required';
		} else {
			const passwordValidation = validatePassword(form.password);
			if (!passwordValidation.isValid) {
				errors.password = passwordValidation.errors[0];
			}
		}

		if (!form.confirmPassword) {
			errors.confirmPassword = 'Please confirm your password';
		} else if (form.password !== form.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!validateForm()) {
			return;
		}

		try {
			isLoading = true;
			
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			});

			const result = await response.json();

			if (result.success) {
				auth.setUser(result.data);
				notifications.success('Account created successfully! Welcome to PricePulse.');
				goto('/');
			} else {
				notifications.error(result.error || 'Registration failed');
			}
		} catch (error) {
			notifications.error('Network error. Please try again.');
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Register - PricePulse</title>
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
			<h2 class="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
			<p class="mt-2 text-sm text-gray-600">
				Already have an account?
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
					Sign in here
				</a>
			</p>
		</div>

		<!-- Form -->
		<form onsubmit={handleSubmit} class="mt-8 space-y-6">
			<div class="space-y-4">
				<Input
					type="text"
					label="Full Name"
					placeholder="Enter your full name"
					bind:value={form.name}
					error={errors.name}
					required
					autocomplete="name"
				/>

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
					placeholder="Create a strong password"
					bind:value={form.password}
					error={errors.password}
					required
					autocomplete="new-password"
					hint="Must be at least 8 characters with uppercase, lowercase, and number"
				/>

				<Input
					type="password"
					label="Confirm Password"
					placeholder="Confirm your password"
					bind:value={form.confirmPassword}
					error={errors.confirmPassword}
					required
					autocomplete="new-password"
				/>
			</div>

			<div class="text-sm text-gray-600">
				<p>
					By creating an account, you agree to our
					<a href="/terms" class="text-blue-600 hover:text-blue-500">Terms of Service</a>
					and
					<a href="/privacy" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>.
				</p>
			</div>

			<Button
				type="submit"
				fullWidth
				loading={isLoading}
			>
				Create Account
			</Button>
		</form>

		<!-- Info -->
		<div class="mt-6 p-4 bg-green-50 rounded-lg">
			<h3 class="text-sm font-medium text-green-900 mb-2">Join as a Vendor</h3>
			<p class="text-xs text-green-700">
				Register to submit price information from your market and help create a transparent marketplace.
			</p>
		</div>
	</div>
</div>
