<script lang="ts">
	import { Shield, Lock, Eye, Database, Users, AlertTriangle } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Privacy Policy - PricePulse</title>
	<meta name="description" content="Learn how PricePulse collects, uses, and protects your personal information. Your privacy is important to us." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="text-center">
				<div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<Shield class="w-8 h-8 text-green-600" />
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
				<p class="text-xl text-gray-600">Last updated: June 21, 2025</p>
			</div>
		</div>
	</div>

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Introduction -->
		<div class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
			<p class="text-gray-600 leading-relaxed mb-4">
				At PricePulse ("we," "our," or "us"), we are committed to protecting your privacy and personal information. 
				This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
				our website and use our services.
			</p>
			<p class="text-gray-600 leading-relaxed">
				By using PricePulse, you agree to the collection and use of information in accordance with this policy. 
				If you do not agree with our policies and practices, do not use our services.
			</p>
		</div>

		<!-- Information We Collect -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<Database class="w-6 h-6 mr-3 text-blue-600" />
				Information We Collect
			</h2>
			
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
					<p class="text-gray-600 mb-2">We may collect personal information that you voluntarily provide to us when you:</p>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>Register for an account</li>
						<li>Apply to become a vendor</li>
						<li>Submit price information</li>
						<li>Contact us through our support channels</li>
						<li>Subscribe to our newsletter</li>
					</ul>
					<p class="text-gray-600 mt-2">This may include:</p>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>Name and contact information (email, phone number)</li>
						<li>Business information (for vendors)</li>
						<li>Market location and product information</li>
						<li>Communication preferences</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Usage Information</h3>
					<p class="text-gray-600 mb-2">We automatically collect certain information when you visit our website:</p>
					<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
						<li>IP address and device information</li>
						<li>Browser type and version</li>
						<li>Pages visited and time spent on our site</li>
						<li>Search queries and interactions</li>
						<li>Referring website information</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Cookies and Tracking Technologies</h3>
					<p class="text-gray-600">
						We use cookies and similar tracking technologies to improve your experience, 
						analyze usage patterns, and provide personalized content. You can control 
						cookie preferences through your browser settings.
					</p>
				</div>
			</div>
		</section>

		<!-- How We Use Information -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<Eye class="w-6 h-6 mr-3 text-green-600" />
				How We Use Your Information
			</h2>
			
			<div class="space-y-4">
				<p class="text-gray-600">We use the information we collect for various purposes, including:</p>
				<ul class="list-disc list-inside text-gray-600 space-y-2 ml-4">
					<li><strong>Service Provision:</strong> To provide, maintain, and improve our platform</li>
					<li><strong>Account Management:</strong> To create and manage user accounts</li>
					<li><strong>Vendor Verification:</strong> To verify and approve vendor applications</li>
					<li><strong>Content Moderation:</strong> To review and moderate price submissions</li>
					<li><strong>Communication:</strong> To send important updates, notifications, and support responses</li>
					<li><strong>Analytics:</strong> To analyze usage patterns and improve our services</li>
					<li><strong>Security:</strong> To protect against fraud, abuse, and security threats</li>
					<li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
				</ul>
			</div>
		</section>

		<!-- Information Sharing -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<Users class="w-6 h-6 mr-3 text-purple-600" />
				Information Sharing and Disclosure
			</h2>
			
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Public Information</h3>
					<p class="text-gray-600">
						Price information, vendor names, and market locations are displayed publicly 
						on our platform as part of our core service. Personal contact information 
						is never displayed publicly.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Service Providers</h3>
					<p class="text-gray-600">
						We may share information with trusted third-party service providers who assist 
						us in operating our platform, conducting business, or serving our users, 
						provided they agree to keep this information confidential.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Legal Requirements</h3>
					<p class="text-gray-600">
						We may disclose your information if required by law, court order, or government 
						request, or to protect our rights, property, or safety and that of our users.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Business Transfers</h3>
					<p class="text-gray-600">
						In the event of a merger, acquisition, or sale of our business, user 
						information may be transferred as part of the transaction.
					</p>
				</div>
			</div>
		</section>

		<!-- Data Security -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<Lock class="w-6 h-6 mr-3 text-red-600" />
				Data Security
			</h2>
			
			<div class="space-y-4">
				<p class="text-gray-600">
					We implement appropriate technical and organizational security measures to protect 
					your personal information against unauthorized access, alteration, disclosure, or destruction:
				</p>
				<ul class="list-disc list-inside text-gray-600 space-y-2 ml-4">
					<li>Encryption of data in transit and at rest</li>
					<li>Regular security assessments and updates</li>
					<li>Access controls and authentication mechanisms</li>
					<li>Employee training on data protection</li>
					<li>Secure hosting infrastructure</li>
				</ul>
				<p class="text-gray-600 mt-4">
					However, no method of transmission over the internet or electronic storage is 100% secure. 
					While we strive to protect your information, we cannot guarantee absolute security.
				</p>
			</div>
		</section>

		<!-- Your Rights -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Your Rights and Choices</h2>
			
			<div class="space-y-4">
				<p class="text-gray-600">You have certain rights regarding your personal information:</p>
				<ul class="list-disc list-inside text-gray-600 space-y-2 ml-4">
					<li><strong>Access:</strong> Request access to your personal information</li>
					<li><strong>Correction:</strong> Request correction of inaccurate information</li>
					<li><strong>Deletion:</strong> Request deletion of your personal information</li>
					<li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
					<li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
					<li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
					<li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
				</ul>
				<p class="text-gray-600 mt-4">
					To exercise these rights, please contact us at privacy@pricepulse.ng. 
					We will respond to your request within 30 days.
				</p>
			</div>
		</section>

		<!-- Data Retention -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Data Retention</h2>
			
			<div class="space-y-4">
				<p class="text-gray-600">
					We retain your personal information only for as long as necessary to fulfill 
					the purposes outlined in this Privacy Policy, unless a longer retention period 
					is required or permitted by law:
				</p>
				<ul class="list-disc list-inside text-gray-600 space-y-2 ml-4">
					<li>Account information: Until account deletion or 2 years of inactivity</li>
					<li>Price submissions: Indefinitely for historical market data</li>
					<li>Communication records: 3 years from last interaction</li>
					<li>Analytics data: Aggregated and anonymized data may be retained indefinitely</li>
				</ul>
			</div>
		</section>

		<!-- Children's Privacy -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
				<AlertTriangle class="w-6 h-6 mr-3 text-orange-600" />
				Children's Privacy
			</h2>
			
			<p class="text-gray-600">
				Our service is not intended for children under 18 years of age. We do not knowingly 
				collect personal information from children under 18. If you are a parent or guardian 
				and believe your child has provided personal information, please contact us immediately.
			</p>
		</section>

		<!-- International Users -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">International Users</h2>
			
			<p class="text-gray-600">
				Our services are primarily intended for users in Nigeria. If you are accessing our 
				services from outside Nigeria, please note that your information may be transferred 
				to, stored, and processed in Nigeria, where our servers are located and our central 
				database is operated.
			</p>
		</section>

		<!-- Policy Updates -->
		<section class="bg-white rounded-lg shadow-md p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Changes to This Privacy Policy</h2>
			
			<p class="text-gray-600">
				We may update this Privacy Policy from time to time to reflect changes in our 
				practices or legal requirements. We will notify you of any material changes by 
				posting the new Privacy Policy on this page and updating the "Last updated" date. 
				We encourage you to review this Privacy Policy periodically.
			</p>
		</section>

		<!-- Contact Information -->
		<div class="bg-blue-50 rounded-lg p-8 text-center">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Questions About This Policy?</h2>
			<p class="text-gray-600 mb-6">
				If you have any questions about this Privacy Policy or our data practices, 
				please don't hesitate to contact us.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button>
					<a href="/contact">Contact Us</a>
				</Button>
				<Button variant="outline">
					<a href="mailto:privacy@pricepulse.ng">Email Privacy Team</a>
				</Button>
			</div>
		</div>
	</div>
</div>
