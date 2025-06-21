import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER || 'your-email@gmail.com',
		pass: process.env.EMAIL_PASSWORD || 'your-app-password'
	}
};

const SUPPORT_EMAIL = 'giddel100@gmail.com';

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

export interface ContactMessage {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export async function sendContactEmail(contactData: ContactMessage): Promise<boolean> {
	try {
		const { name, email, subject, message } = contactData;
		
		// Check if email is configured
		const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && 
			process.env.EMAIL_USER !== 'your-email@gmail.com';
		
		if (!isEmailConfigured) {
			// Development mode - log email instead of sending
			console.log('📧 EMAIL NOT CONFIGURED - Would send to giddel100@gmail.com:');
			console.log('═══════════════════════════════════════════════════════');
			console.log(`From: ${name} <${email}>`);
			console.log(`Subject: [PricePulse Contact] ${subject}`);
			console.log(`To: ${SUPPORT_EMAIL}`);
			console.log(`Submitted: ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} (WAT)`);
			console.log('');
			console.log('Message:');
			console.log(message);
			console.log('═══════════════════════════════════════════════════════');
			console.log('ℹ️  To enable actual email sending, configure EMAIL_USER and EMAIL_PASSWORD in .env');
			return true;
		}

		// Production mode - send actual email
		const emailContent = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>New Contact Form Submission - PricePulse</title>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
		.content { background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
		.footer { background-color: #1e293b; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; }
		.field { margin-bottom: 15px; }
		.label { font-weight: bold; color: #1e293b; }
		.value { background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db; }
		.message-content { background-color: white; padding: 15px; border-radius: 4px; border: 1px solid #d1d5db; white-space: pre-wrap; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🌟 New Contact Form Submission</h1>
			<p>PricePulse Contact Form</p>
		</div>
		
		<div class="content">
			<div class="field">
				<div class="label">From:</div>
				<div class="value">${name} &lt;${email}&gt;</div>
			</div>
			
			<div class="field">
				<div class="label">Subject:</div>
				<div class="value">${subject}</div>
			</div>
			
			<div class="field">
				<div class="label">Submitted:</div>
				<div class="value">${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} (WAT)</div>
			</div>
			
			<div class="field">
				<div class="label">Message:</div>
				<div class="message-content">${message}</div>
			</div>
		</div>
		
		<div class="footer">
			<p>This message was sent through the PricePulse contact form.</p>
			<p>You can reply directly to this email to respond to the sender.</p>
		</div>
	</div>
</body>
</html>
		`;

		const mailOptions = {
			from: `"PricePulse Contact Form" <${EMAIL_CONFIG.auth.user}>`,
			to: SUPPORT_EMAIL,
			replyTo: email, // Allow direct reply to the sender
			subject: `[PricePulse Contact] ${subject}`,
			html: emailContent,
			text: `
New Contact Form Submission from PricePulse

From: ${name} (${email})
Subject: ${subject}
Submitted: ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} (WAT)

Message:
${message}

---
This message was sent through the PricePulse contact form.
You can reply directly to this email to respond to the sender.
			`
		};

		// Send email
		await transporter.sendMail(mailOptions);
		
		console.log(`✅ Contact email sent successfully to ${SUPPORT_EMAIL}`);
		return true;
		
	} catch (error) {
		console.error('❌ Failed to send contact email:', error);
		return false;
	}
}

export async function sendConfirmationEmail(contactData: ContactMessage): Promise<boolean> {
	try {
		const { name, email, subject } = contactData;
		
		// Check if email is configured
		const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && 
			process.env.EMAIL_USER !== 'your-email@gmail.com';
		
		if (!isEmailConfigured) {
			// Development mode - log email instead of sending
			console.log(`📧 Would send confirmation email to: ${email}`);
			console.log(`✅ Thank you ${name}! Confirmation for: "${subject}"`);
			return true;
		}

		// Production mode - send actual email
		const confirmationContent = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Thank you for contacting PricePulse</title>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background-color: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
		.content { background-color: #f0fdf4; padding: 20px; border: 1px solid #bbf7d0; }
		.footer { background-color: #1e293b; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>✅ Message Received</h1>
			<p>Thank you for contacting PricePulse!</p>
		</div>
		
		<div class="content">
			<p>Dear ${name},</p>
			
			<p>We have received your message with the subject: <strong>"${subject}"</strong></p>
			
			<p>Our support team will review your message and get back to you within 24 hours during business days.</p>
			
			<p><strong>Business Hours:</strong><br>
			Monday - Friday: 9:00 AM - 6:00 PM (WAT)<br>
			Saturday: 10:00 AM - 2:00 PM (WAT)<br>
			Sunday: Closed</p>
			
			<p>If you have urgent inquiries, you can also reach us at:</p>
			<ul>
				<li>📧 Email: support@pricepulse.ng</li>
				<li>📞 Phone: +234 (0) 123 456 7890</li>
			</ul>
			
			<p>Thank you for using PricePulse!</p>
		</div>
		
		<div class="footer">
			<p>This is an automated response. Please do not reply to this email.</p>
			<p>PricePulse - Transparent Market Prices</p>
		</div>
	</div>
</body>
</html>
		`;

		const mailOptions = {
			from: `"PricePulse Support" <${EMAIL_CONFIG.auth.user}>`,
			to: email,
			subject: 'Thank you for contacting PricePulse - We\'ve received your message',
			html: confirmationContent,
			text: `
Dear ${name},

Thank you for contacting PricePulse!

We have received your message with the subject: "${subject}"

Our support team will review your message and get back to you within 24 hours during business days.

Business Hours:
Monday - Friday: 9:00 AM - 6:00 PM (WAT)
Saturday: 10:00 AM - 2:00 PM (WAT)
Sunday: Closed

If you have urgent inquiries, you can also reach us at:
- Email: support@pricepulse.ng
- Phone: +234 (0) 123 456 7890

Thank you for using PricePulse!

---
This is an automated response. Please do not reply to this email.
PricePulse - Transparent Market Prices
			`
		};

		// Send confirmation email
		await transporter.sendMail(mailOptions);
		
		console.log(`✅ Confirmation email sent successfully to ${email}`);
		return true;
		
	} catch (error) {
		console.error('❌ Failed to send confirmation email:', error);
		return false;
	}
}
