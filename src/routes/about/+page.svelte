<script lang="ts">
	import { Target, Users, Eye, Heart, Award, TrendingUp } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>About Us - PricePulse</title>
	<meta name="description" content="Learn about PricePulse's mission to provide transparent, real-time market price information and promote fair trading across local markets." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Hero Section -->
	<section class="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
			<div class="text-center">
				<h1 class="text-4xl lg:text-5xl font-bold mb-6">About PricePulse</h1>
				<p class="text-xl text-blue-100 max-w-3xl mx-auto">
					Empowering consumers and vendors with transparent, real-time market price information 
					to create a fairer marketplace for everyone.
				</p>
			</div>
		</div>
	</section>

	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<!-- Mission & Vision -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
			<div class="bg-white rounded-lg shadow-md p-8">
				<div class="flex items-center mb-4">
					<Target class="w-8 h-8 text-blue-600 mr-3" />
					<h2 class="text-2xl font-bold text-gray-900">Our Mission</h2>
				</div>
				<p class="text-gray-600 leading-relaxed">
					To democratize access to market price information by creating a transparent platform 
					where consumers can make informed purchasing decisions and vendors can compete fairly. 
					We believe that price transparency is fundamental to a healthy marketplace.
				</p>
			</div>

			<div class="bg-white rounded-lg shadow-md p-8">
				<div class="flex items-center mb-4">
					<Eye class="w-8 h-8 text-green-600 mr-3" />
					<h2 class="text-2xl font-bold text-gray-900">Our Vision</h2>
				</div>
				<p class="text-gray-600 leading-relaxed">
					To become the leading platform for market price transparency in Nigeria and beyond, 
					fostering trust between consumers and vendors while promoting fair competition and 
					reducing information asymmetry in local markets.
				</p>
			</div>
		</div>

		<!-- The Problem We Solve -->
		<section class="mb-16">
			<div class="text-center mb-8">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">The Problem We Solve</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Local markets often lack price transparency, making it difficult for consumers to find fair prices 
					and for honest vendors to compete effectively.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="bg-white rounded-lg shadow-md p-6 text-center">
					<div class="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
						<span class="text-red-600 font-bold text-xl">?</span>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Price Uncertainty</h3>
					<p class="text-gray-600 text-sm">Consumers often don't know current market prices, making them vulnerable to overcharging.</p>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6 text-center">
					<div class="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
						<span class="text-orange-600 font-bold text-xl">≠</span>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Market Manipulation</h3>
					<p class="text-gray-600 text-sm">Lack of price information enables unfair pricing and market manipulation.</p>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6 text-center">
					<div class="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
						<span class="text-yellow-600 font-bold text-xl">⚡</span>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Information Gap</h3>
					<p class="text-gray-600 text-sm">No centralized platform existed for real-time market price information.</p>
				</div>
			</div>
		</section>

		<!-- Our Solution -->
		<section class="mb-16">
			<div class="text-center mb-8">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">Our Solution</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					PricePulse bridges the information gap by connecting verified vendors with consumers 
					through a transparent, real-time price sharing platform.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="bg-white rounded-lg shadow-md p-6 text-center">
					<TrendingUp class="w-12 h-12 text-blue-600 mx-auto mb-4" />
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
					<p class="text-gray-600 text-sm">Verified vendors submit current prices, providing up-to-date market information.</p>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6 text-center">
					<Award class="w-12 h-12 text-green-600 mx-auto mb-4" />
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Verified Sources</h3>
					<p class="text-gray-600 text-sm">All vendors go through a verification process to ensure data quality and reliability.</p>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6 text-center">
					<Users class="w-12 h-12 text-purple-600 mx-auto mb-4" />
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Community Driven</h3>
					<p class="text-gray-600 text-sm">Built by the community, for the community, promoting mutual benefit and trust.</p>
				</div>
			</div>
		</section>

		<!-- Our Values -->
		<section class="mb-16">
			<div class="text-center mb-8">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-start">
						<div class="bg-blue-100 p-2 rounded-lg mr-4">
							<Eye class="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<h3 class="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
							<p class="text-gray-600">We believe in open, honest communication and transparent pricing information for all.</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-start">
						<div class="bg-green-100 p-2 rounded-lg mr-4">
							<Award class="w-6 h-6 text-green-600" />
						</div>
						<div>
							<h3 class="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
							<p class="text-gray-600">We maintain high standards for data accuracy and platform reliability.</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-start">
						<div class="bg-purple-100 p-2 rounded-lg mr-4">
							<Users class="w-6 h-6 text-purple-600" />
						</div>
						<div>
							<h3 class="text-lg font-semibold text-gray-900 mb-2">Community</h3>
							<p class="text-gray-600">We foster a collaborative environment that benefits both consumers and vendors.</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-start">
						<div class="bg-orange-100 p-2 rounded-lg mr-4">
							<Heart class="w-6 h-6 text-orange-600" />
						</div>
						<div>
							<h3 class="text-lg font-semibold text-gray-900 mb-2">Fairness</h3>
							<p class="text-gray-600">We promote fair competition and equal access to market information.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- How It Works -->
		<section class="mb-16">
			<div class="text-center mb-8">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div class="text-center">
					<div class="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">1</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Vendor Registration</h3>
					<p class="text-gray-600 text-sm">Vendors apply and get verified through our approval process.</p>
				</div>

				<div class="text-center">
					<div class="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">2</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Price Submission</h3>
					<p class="text-gray-600 text-sm">Approved vendors submit current prices from their markets.</p>
				</div>

				<div class="text-center">
					<div class="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">3</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Review & Approval</h3>
					<p class="text-gray-600 text-sm">Our team reviews submissions for accuracy before publication.</p>
				</div>

				<div class="text-center">
					<div class="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">4</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Public Access</h3>
					<p class="text-gray-600 text-sm">Consumers can search and compare prices across markets.</p>
				</div>
			</div>
		</section>

		<!-- Call to Action -->
		<div class="bg-blue-50 rounded-lg p-8 text-center">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
			<p class="text-gray-600 mb-6 max-w-2xl mx-auto">
				Help us create a more transparent marketplace. Whether you're a consumer looking for fair prices 
				or a vendor wanting to compete fairly, PricePulse is built for you.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button size="lg">
					<a href="/search">Explore Prices</a>
				</Button>
				<Button variant="outline" size="lg">
					<a href="/vendor">Become a Vendor</a>
				</Button>
			</div>
		</div>
	</div>
</div>
