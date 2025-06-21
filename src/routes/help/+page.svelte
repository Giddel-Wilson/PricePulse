<script lang="ts">
	import { Search, HelpCircle, Book, MessageCircle, Users, TrendingUp } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Help & Support - PricePulse</title>
	<meta name="description" content="Get help with using PricePulse, find answers to common questions, and learn how to navigate the platform effectively." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="text-center">
				<div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<HelpCircle class="w-8 h-8 text-blue-600" />
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
				<p class="text-xl text-gray-600">Find answers to common questions and learn how to use PricePulse effectively</p>
			</div>
		</div>
	</div>

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Quick Help Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
			<div class="bg-white rounded-lg shadow-md p-6 text-center">
				<Search class="w-8 h-8 text-blue-600 mx-auto mb-3" />
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Search Prices</h3>
				<p class="text-gray-600 text-sm">Learn how to search and filter price information effectively</p>
			</div>
			
			<div class="bg-white rounded-lg shadow-md p-6 text-center">
				<Users class="w-8 h-8 text-green-600 mx-auto mb-3" />
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Become a Vendor</h3>
				<p class="text-gray-600 text-sm">Understand the vendor registration and submission process</p>
			</div>
			
			<div class="bg-white rounded-lg shadow-md p-6 text-center">
				<TrendingUp class="w-8 h-8 text-purple-600 mx-auto mb-3" />
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Price Submission</h3>
				<p class="text-gray-600 text-sm">Guidelines for submitting accurate price information</p>
			</div>
		</div>

		<!-- FAQ Sections -->
		<div class="space-y-8">
			<!-- Getting Started -->
			<section class="bg-white rounded-lg shadow-md p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
					<Book class="w-6 h-6 mr-3 text-blue-600" />
					Getting Started
				</h2>
				
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">What is PricePulse?</h3>
						<p class="text-gray-600">PricePulse is a platform that provides real-time market price information for various goods across different local markets. It helps consumers make informed purchasing decisions and promotes price transparency in the marketplace.</p>
					</div>
					
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">How do I search for prices?</h3>
						<p class="text-gray-600">Use the search bar on the homepage or visit the Search page. You can search by product name, filter by category, market, region, or price range. The search results will show current prices from verified vendors.</p>
					</div>
					
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">Do I need an account to view prices?</h3>
						<p class="text-gray-600">No, you can browse and search prices without creating an account. However, you'll need an account if you want to become a vendor and submit price information.</p>
					</div>
				</div>
			</section>

			<!-- For Vendors -->
			<section class="bg-white rounded-lg shadow-md p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
					<Users class="w-6 h-6 mr-3 text-green-600" />
					For Vendors
				</h2>
				
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">How do I become a vendor?</h3>
						<p class="text-gray-600">Click on "Register as Vendor" from the homepage or your dashboard. Fill out the vendor request form with your business details. Our admin team will review your application and approve eligible vendors.</p>
					</div>
					
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">What information do I need to provide?</h3>
						<p class="text-gray-600">You'll need to provide your business name, contact information, market location, and the types of products you sell. This helps us verify legitimate vendors and maintain data quality.</p>
					</div>
					
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">How do I submit prices?</h3>
						<p class="text-gray-600">Once approved as a vendor, go to your vendor dashboard and click "Submit Price". Select the product and market, enter the current price and unit, and add any relevant notes. All submissions are reviewed before being published.</p>
					</div>
					
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">What if my product or market isn't listed?</h3>
						<p class="text-gray-600">When submitting prices, you can select "Other" from the product or market dropdown to add new entries. Provide the product name, category, and unit details, or market name, location, and region.</p>
					</div>
				</div>
			</section>

			<!-- Price Information -->
			<section class="bg-white rounded-lg shadow-md p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
					<TrendingUp class="w-6 h-6 mr-3 text-purple-600" />
					Price Information
				</h2>
				
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">How current are the prices?</h3>
						<p class="text-gray-600">Prices are submitted by verified vendors and include timestamps. We encourage vendors to submit current market prices, and all submissions are moderated for accuracy.</p>
					</div>
					
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">Why do prices vary between markets?</h3>
						<p class="text-gray-600">Prices naturally vary due to factors like transportation costs, local demand, supply availability, quality differences, and market competition. Our platform helps you compare these variations.</p>
					</div>
					
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">How do you ensure price accuracy?</h3>
						<p class="text-gray-600">All price submissions go through an admin review process. We verify vendor credentials, check for suspicious pricing patterns, and may follow up with vendors for clarification when needed.</p>
					</div>
				</div>
			</section>

			<!-- Technical Support -->
			<section class="bg-white rounded-lg shadow-md p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
					<MessageCircle class="w-6 h-6 mr-3 text-orange-600" />
					Technical Support
				</h2>
				
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">I'm having trouble logging in</h3>
						<p class="text-gray-600">Make sure you're using the correct email and password. If you forgot your password, click "Forgot Password" on the login page. Contact support if you continue having issues.</p>
					</div>
					
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">The search isn't returning results</h3>
						<p class="text-gray-600">Try using different search terms, check your filters, or broaden your search criteria. If you're looking for a specific product that isn't listed, vendors can add new products when submitting prices.</p>
					</div>
					
					<div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">I found incorrect price information</h3>
						<p class="text-gray-600">If you notice inaccurate prices, please contact our support team with details about the specific entry. We take data quality seriously and will investigate promptly.</p>
					</div>
				</div>
			</section>
		</div>

		<!-- Contact Section -->
		<div class="mt-12 bg-blue-50 rounded-lg p-8 text-center">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
			<p class="text-gray-600 mb-6">Can't find what you're looking for? Our support team is here to help.</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button>
					<a href="/contact">Contact Support</a>
				</Button>
				<Button variant="outline">
					<a href="mailto:support@pricepulse.ng">Email Us</a>
				</Button>
			</div>
		</div>
	</div>
</div>
