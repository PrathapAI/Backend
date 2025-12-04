import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.replace(/\s/g, '') : ''
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log('[EMAIL] Gmail SMTP configured for:', process.env.EMAIL_USER);

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  try {
    const subject = purpose === 'reset' 
      ? 'Password Reset OTP - Campaign Star' 
      : 'Email Verification OTP - Campaign Star';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 700; color: #00d09c; text-transform: lowercase; }
          .otp-box { background: rgba(0, 208, 156, 0.1); border: 2px solid #00d09c; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: 700; color: #00d09c; letter-spacing: 8px; margin: 10px 0; }
          .message { color: #ccc; font-size: 14px; line-height: 1.6; margin: 20px 0; }
          .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; }
          .warning { color: #ff6b6b; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">campaign star</div>
          </div>
          <div class="message">
            ${purpose === 'reset' 
              ? 'You requested to reset your password. Use the OTP below to proceed:' 
              : 'Welcome! Please verify your email address with the OTP below:'}
          </div>
          <div class="otp-box">
            <div style="color: #aaa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</div>
            <div class="otp-code">${otp}</div>
            <div style="color: #aaa; font-size: 12px; margin-top: 10px;">Valid for 5 minutes</div>
          </div>
          <div class="message">
            Enter this code in the application to complete your ${purpose === 'reset' ? 'password reset' : 'registration'}.
          </div>
          <div class="warning">
            ⚠️ If you didn't request this, please ignore this email.
          </div>
          <div class="footer">
            © 2025 Campaign Star. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Campaign Star" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
      to: email,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL] OTP sent successfully to:', email);
    console.log('[EMAIL] Message ID:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EMAIL] Failed to send OTP:', error);
    throw error;
  }
};

export default transporter;
