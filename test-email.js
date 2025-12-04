import dotenv from 'dotenv';
import { sendOTPEmail, generateOTP } from './src/config/email.js';

dotenv.config();

const testEmail = async () => {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD?.length);
  
  try {
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
    console.log('Attempting to send email...');
    
    await sendOTPEmail('prathapv260@gmail.com', otp, 'verification');
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Email send failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
  }
};

testEmail();
