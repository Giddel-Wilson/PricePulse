<script lang="ts">
	import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { notifications } from '$lib/stores/notifications';

	let form = $state({
		name: '',
		email: '',
		subject: '',
		message: ''
	});

	let isSubmitting = $state(false);
	let errors: Record<string, string> = $state({});

	function validateForm() {
		errors = {};

		if (!form.name.trim()) {
			errors.name = 'Name is required';
		}

		if (!form.email.trim()) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			errors.email = 'Please enter a valid email address';
		}

		if (!form.subject.trim()) {
			errors.subject = 'Subject is required';
		}

		if (!form.message.trim()) {
			errors.message = 'Message is required';
		} else if (form.message.trim().length < 10) {
			errors.message = 'Message must be at least 10 characters long';
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		try {
			isSubmitting = true;

			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			});

			const result = await response.json();

			if (result.success) {
				notifications.success('Message sent successfully! We\'ll get back to you soon.');
				form = { name: '', email: '', subject: '', message: '' };
			} else {
				notifications.error(result.error || 'Failed to send message');
			}
		} catch (error) {
			console.error('Contact form error:', error);
			notifications.error('Network error. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Contact Us - PricePulse</title>
	<meta name="description" content="Get in touch with the PricePulse team. We're here to help with questions, support, feedback, and partnership opportunities." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="text-center">
				<div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<MessageCircle class="w-8 h-8 text-blue-600" />
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
				<p class="text-xl text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
			</div>
		</div>
	</div>

	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
			<!-- Contact Information -->
			<div class="lg:col-span-1">
				<div class="bg-white rounded-lg shadow-md p-8">
					<h2 class="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
					
					<div class="space-y-6">
						<div class="flex items-start">
							<Mail class="w-6 h-6 text-blue-600 mr-4 mt-1" />
							<div>
								<h3 class="text-lg font-semibold text-gray-900">Email</h3>
								<p class="text-gray-600">support@pricepulse.ng</p>
								<p class="text-sm text-gray-500 mt-1">For general inquiries and support</p>
							</div>
						</div>

						<div class="flex items-start">
							<Phone class="w-6 h-6 text-green-600 mr-4 mt-1" />
							<div>
								<h3 class="text-lg font-semibold text-gray-900">Phone</h3>
								<p class="text-gray-600">+234 (0) 123 456 7890</p>
								<p class="text-sm text-gray-500 mt-1">Monday - Friday, 9:00 AM - 6:00 PM (WAT)</p>
							</div>
						</div>

						<div class="flex items-start">
							<MapPin class="w-6 h-6 text-purple-600 mr-4 mt-1" />
							<div>
								<h3 class="text-lg font-semibold text-gray-900">Address</h3>
								<p class="text-gray-600">123 Innovation Drive<br>Victoria Island, Lagos<br>Nigeria</p>
							</div>
						</div>

						<div class="flex items-start">
							<Clock class="w-6 h-6 text-orange-600 mr-4 mt-1" />
							<div>
								<h3 class="text-lg font-semibold text-gray-900">Business Hours</h3>
								<p class="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
								<p class="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
								<p class="text-gray-600">Sunday: Closed</p>
							</div>
						</div>
					</div>

					<!-- Quick Contact Options -->
					<div class="mt-8 pt-6 border-t border-gray-200">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
						<div class="space-y-3">
							<Button variant="outline" class="w-full justify-start">
								<Mail class="w-4 h-4 mr-2" />
								<a href="mailto:support@pricepulse.ng">Email Support</a>
							</Button>
							<Button variant="outline" class="w-full justify-start">
								<Phone class="w-4 h-4 mr-2" />
								<a href="tel:+2341234567890">Call Us</a>
							</Button>
						</div>
					</div>
				</div>
			</div>

			<!-- Contact Form -->
			<div class="lg:col-span-2">
				<div class="bg-white rounded-lg shadow-md p-8">
					<h2 class="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
					
					<form onsubmit={handleSubmit} class="space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								type="text"
								label="Your Name"
								bind:value={form.name}
								placeholder="John Doe"
								error={errors.name}
								required
							/>

							<Input
								type="email"
								label="Email Address"
								bind:value={form.email}
								placeholder="john@example.com"
								error={errors.email}
								required
							/>
						</div>

						<Input
							type="text"
							label="Subject"
							bind:value={form.subject}
							placeholder="How can we help you?"
							error={errors.subject}
							required
						/>

						<div>
							<label for="message" class="block text-sm font-medium text-gray-700 mb-2">
								Message *
							</label>
							<textarea
								id="message"
								bind:value={form.message}
								rows="6"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Tell us more about your inquiry..."
								class:border-red-300={errors.message}
								class:focus:ring-red-500={errors.message}
								class:focus:border-red-500={errors.message}
							></textarea>
							{#if errors.message}
								<p class="mt-1 text-sm text-red-600">{errors.message}</p>
							{/if}
						</div>

						<Button
							type="submit"
							loading={isSubmitting}
							class="w-full"
							size="lg"
						>
							<Send class="w-4 h-4 mr-2" />
							Send Message
						</Button>
					</form>

					<div class="mt-6 p-4 bg-blue-50 rounded-lg">
						<h3 class="text-sm font-medium text-blue-900 mb-2">Before you contact us:</h3>
						<ul class="text-sm text-blue-700 space-y-1">
							<li>• Check our <a href="/help" class="underline hover:no-underline">Help page</a> for common questions</li>
							<li>• For vendor applications, use the vendor registration form</li>
							<li>• Include as much detail as possible in your message</li>
							<li>• We typically respond within 24 hours during business days</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<!-- FAQ Section -->
		<div class="mt-16">
			<div class="text-center mb-8">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
				<p class="text-xl text-gray-600">Can't find what you're looking for? These might help.</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div class="bg-white rounded-lg shadow-md p-6">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">How do I report incorrect prices?</h3>
					<p class="text-gray-600 text-sm">Contact us with the specific price entry details, and we'll investigate immediately. Include the product name, market, and what you believe is incorrect.</p>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Can I partner with PricePulse?</h3>
					<p class="text-gray-600 text-sm">We're always open to partnerships! Send us details about your organization and how you'd like to collaborate with us.</p>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">How do I delete my account?</h3>
					<p class="text-gray-600 text-sm">Contact our support team to request account deletion. We'll process your request within 48 hours and confirm when it's complete.</p>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Do you offer API access?</h3>
					<p class="text-gray-600 text-sm">We're currently developing API access for developers and businesses. Contact us to express interest and get notified when it's available.</p>
				</div>
			</div>
		</div>
	</div>
</div>
