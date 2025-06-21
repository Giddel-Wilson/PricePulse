<script lang="ts">
	import { FileText, Scale, Shield, AlertTriangle, Users, Ban } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Terms of Service - PricePulse</title>
	<meta name="description" content="Read the terms and conditions for using PricePulse, including user responsibilities, vendor guidelines, and platform policies." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="text-center">
				<div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<FileText class="w-8 h-8 text-blue-600" />
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
				<p class="text-xl text-gray-600">Last updated: June 21, 2025</p>
			</div>
		</div>
	</div>

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Introduction -->
		<div class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
			<p class="text-gray-600 leading-relaxed mb-4">
				These Terms of Service ("Terms") govern your use of the PricePulse website and services 
				operated by PricePulse ("we," "our," or "us"). By accessing or using our service, 
				you agree to be bound by these Terms.
			</p>
			<p class="text-gray-600 leading-relaxed">
				If you disagree with any part of these terms, then you may not access the service. 
				These Terms constitute a legally binding agreement between you and PricePulse.
			</p>
		</div>

		<!-- Definitions -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Definitions</h2>
			
			<div class="space-y-4">
				<div>
					<h3 class="text-lg font-semibold text-gray-900">Service</h3>
					<p class="text-gray-600">The PricePulse website, platform, and all related services provided by us.</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900">User</h3>
					<p class="text-gray-600">Any individual who accesses or uses our Service.</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900">Vendor</h3>
					<p class="text-gray-600">A verified User who has been approved to submit price information.</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900">Content</h3>
					<p class="text-gray-600">All information, data, text, and other materials available through our Service.</p>
				</div>
			</div>
		</section>

		<!-- User Accounts -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<Users class="w-6 h-6 mr-3 text-blue-600" />
				User Accounts
			</h2>
			
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Account Creation</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>You must provide accurate and complete information when creating an account</li>
						<li>You are responsible for maintaining the confidentiality of your account credentials</li>
						<li>You must be at least 18 years old to create an account</li>
						<li>One person may not maintain multiple accounts</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>You are responsible for all activities that occur under your account</li>
						<li>Notify us immediately of any unauthorized use of your account</li>
						<li>Keep your account information up to date</li>
						<li>Do not share your account with others</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Account Termination</h3>
					<p class="text-gray-600">
						We reserve the right to suspend or terminate accounts that violate these Terms 
						or engage in harmful activities. You may also delete your account at any time 
						by contacting our support team.
					</p>
				</div>
			</div>
		</section>

		<!-- Vendor Terms -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<Shield class="w-6 h-6 mr-3 text-green-600" />
				Vendor Terms and Responsibilities
			</h2>
			
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Vendor Verification</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>Vendors must complete our verification process</li>
						<li>Provide accurate business and contact information</li>
						<li>Maintain active business operations in declared markets</li>
						<li>Submit to periodic re-verification as required</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Price Submission Guidelines</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>Submit only current, accurate price information</li>
						<li>Prices must reflect actual market conditions</li>
						<li>Include relevant details about product quality or conditions</li>
						<li>Do not submit misleading or false information</li>
						<li>Update prices regularly to maintain accuracy</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Vendor Obligations</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>Comply with all applicable laws and regulations</li>
						<li>Respond to inquiries from our moderation team</li>
						<li>Maintain professional conduct on the platform</li>
						<li>Report any suspicious or fraudulent activities</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- Acceptable Use -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<Scale class="w-6 h-6 mr-3 text-purple-600" />
				Acceptable Use Policy
			</h2>
			
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Permitted Uses</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>Search and view price information for personal or business use</li>
						<li>Submit accurate price information as a verified vendor</li>
						<li>Use our platform for legitimate market research</li>
						<li>Share price information from our platform with proper attribution</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Prohibited Activities</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>Submitting false, misleading, or inaccurate price information</li>
						<li>Attempting to manipulate market prices through false submissions</li>
						<li>Scraping or automated data collection without permission</li>
						<li>Impersonating other vendors or businesses</li>
						<li>Uploading malicious code or attempting to breach security</li>
						<li>Spamming or sending unsolicited communications</li>
						<li>Using the platform for illegal activities</li>
						<li>Interfering with other users' access to the service</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- Content and Intellectual Property -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Content and Intellectual Property</h2>
			
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Your Content</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>You retain ownership of price information you submit</li>
						<li>You grant us a license to use, display, and distribute your submissions</li>
						<li>You represent that you have the right to submit the information</li>
						<li>You are responsible for the accuracy of your submissions</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Our Content</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>PricePulse owns all rights to the platform design and software</li>
						<li>Our trademarks and branding are protected intellectual property</li>
						<li>Aggregated data and analytics remain our property</li>
						<li>You may not copy, modify, or redistribute our platform</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Content Moderation</h3>
					<p class="text-gray-600">
						We reserve the right to review, moderate, edit, or remove any content that 
						violates these Terms or our community standards. We are not obligated to 
						monitor all content but may do so at our discretion.
					</p>
				</div>
			</div>
		</section>

		<!-- Privacy and Data -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Privacy and Data Protection</h2>
			
			<p class="text-gray-600 mb-4">
				Your privacy is important to us. Our collection and use of personal information 
				is governed by our Privacy Policy, which is incorporated into these Terms by reference.
			</p>
			<p class="text-gray-600">
				By using our Service, you consent to the collection and use of your information 
				as described in our Privacy Policy.
			</p>
		</section>

		<!-- Disclaimers -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<AlertTriangle class="w-6 h-6 mr-3 text-orange-600" />
				Disclaimers and Limitation of Liability
			</h2>
			
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Service Availability</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>Our Service is provided "as is" without warranties of any kind</li>
						<li>We do not guarantee uninterrupted or error-free service</li>
						<li>Scheduled maintenance may temporarily affect availability</li>
						<li>We reserve the right to modify or discontinue features</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Price Information Accuracy</h3>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>Price information is provided by third-party vendors</li>
						<li>We do not guarantee the accuracy of submitted prices</li>
						<li>Prices may change without notice</li>
						<li>Users should verify prices before making purchasing decisions</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
					<p class="text-gray-600">
						To the maximum extent permitted by law, PricePulse shall not be liable for any 
						indirect, incidental, special, consequential, or punitive damages resulting from 
						your use of our Service, including but not limited to loss of profits, data, or 
						business opportunities.
					</p>
				</div>
			</div>
		</section>

		<!-- Termination -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<Ban class="w-6 h-6 mr-3 text-red-600" />
				Termination
			</h2>
			
			<div class="space-y-4">
				<p class="text-gray-600">
					We may terminate or suspend your account and access to our Service immediately, 
					without prior notice or liability, for any reason, including but not limited to 
					breach of these Terms.
				</p>
				<p class="text-gray-600">
					Upon termination, your right to use the Service will cease immediately. All provisions 
					of these Terms that by their nature should survive termination shall survive, including 
					but not limited to ownership provisions, warranty disclaimers, and limitations of liability.
				</p>
			</div>
		</section>

		<!-- Governing Law -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Governing Law and Dispute Resolution</h2>
			
			<div class="space-y-4">
				<p class="text-gray-600">
					These Terms shall be governed by and construed in accordance with the laws of Nigeria, 
					without regard to its conflict of law provisions.
				</p>
				<p class="text-gray-600">
					Any disputes arising from these Terms or your use of our Service shall be resolved 
					through binding arbitration in Lagos, Nigeria, in accordance with the rules of the 
					Lagos Court of Arbitration.
				</p>
			</div>
		</section>

		<!-- Changes to Terms -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Changes to These Terms</h2>
			
			<p class="text-gray-600">
				We reserve the right to modify or replace these Terms at any time. If a revision is 
				material, we will provide at least 30 days notice prior to any new terms taking effect. 
				What constitutes a material change will be determined at our sole discretion. 
				Continued use of our Service after any such changes constitutes acceptance of the new Terms.
			</p>
		</section>

		<!-- Contact Information -->
		<div class="bg-blue-50 rounded-lg p-8 text-center">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Questions About These Terms?</h2>
			<p class="text-gray-600 mb-6">
				If you have any questions about these Terms of Service, please contact us.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button>
					<a href="/contact">Contact Support</a>
				</Button>
				<Button variant="outline">
					<a href="mailto:legal@pricepulse.ng">Email Legal Team</a>
				</Button>
			</div>
		</div>
	</div>
</div>
