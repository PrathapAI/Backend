/**
 * Email OTP Test Script
 * 
 * This script tests the email OTP functionality without starting the full server.
 * Use this to verify your Gmail SMTP configuration is correct.
 * 
 * Usage:
 * 1. Make sure .env file has EMAIL_USER and EMAIL_PASSWORD configured
 * 2. Run: node src/test/test-email-otp.js
 */

import dotenv from 'dotenv';
import { generateOTP, sendOTPEmail } from '../config/email.js';

// Load environment variables
dotenv.config();

async function testEmailOTP() {
  console.log('🧪 Testing Email OTP Service...\n');

  // Check environment variables (optional now - will use Ethereal if not set)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('⚠️  Gmail credentials not found in .env');
    console.log('📧 Using Ethereal Email test service instead...\n');
  } else {
    console.log(`📧 Email configured: ${process.env.EMAIL_USER}`);
  }

  // Generate OTP
  const otp = generateOTP();
  console.log(`🔢 Generated OTP: ${otp}\n`);

  // Test email address - use your actual Gmail for testing
  const testEmail = 'prathapv260@gmail.com'; // Send to your own Gmail
  
  console.log(`📨 Sending test email to: ${testEmail}...`);

  try {
    // Send verification email
    const result1 = await sendOTPEmail(testEmail, otp, 'verification');
    console.log(`✅ Verification email sent successfully!`);
    console.log(`   Message ID: ${result1.messageId}\n`);

    // Send reset email
    const resetOTP = generateOTP();
    const result2 = await sendOTPEmail(testEmail, resetOTP, 'reset');
    console.log(`✅ Password reset email sent successfully!`);
    console.log(`   Message ID: ${result2.messageId}\n`);

    console.log('🎉 All tests passed!\n');
    console.log('✉️  Check your email inbox for:');
    console.log(`   1. Email Verification OTP (${otp})`);
    console.log(`   2. Password Reset OTP (${resetOTP})\n`);
    console.log('💡 If you don\'t see the emails, check your spam folder.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Make sure you\'re using an App Password, not your regular Gmail password');
    console.log('2. Enable 2-Factor Authentication on your Google Account');
    console.log('3. Generate App Password: https://myaccount.google.com/apppasswords');
    console.log('4. Check that port 587 is not blocked by your firewall\n');
    process.exit(1);
  }
}

// Run the test
testEmailOTP();
