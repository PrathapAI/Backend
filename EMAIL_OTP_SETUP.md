# Email OTP Microservice Documentation

## Overview
This application uses email-based OTP (One-Time Password) verification for user authentication and security. The system leverages **Nodemailer** with Gmail's free SMTP service to send OTP codes via email.

## Features
- ✉️ **Email Verification** - OTP sent during user registration
- 🔒 **Password Reset** - OTP-based forgot password functionality
- 🎨 **Branded Emails** - Professional HTML emails with CRED-inspired design
- ⏱️ **Time-Limited OTPs** - 5-minute expiration for security
- 📧 **Free SMTP** - Uses Gmail's free SMTP service (no paid service required)

## Setup Instructions

### 1. Gmail Account Configuration
To use Gmail's SMTP service, you need to generate an **App Password**:

1. **Enable 2-Factor Authentication**:
   - Go to your Google Account: https://myaccount.google.com
   - Navigate to Security > 2-Step Verification
   - Follow the steps to enable 2FA

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Campaign Star" or any name
   - Click "Generate"
   - Copy the 16-character password (you'll need this)

### 2. Environment Variables Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the email configuration in `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password-here
   ```

   **Important**: 
   - Use your Gmail address for `EMAIL_USER`
   - Use the 16-character App Password (not your regular password) for `EMAIL_PASSWORD`
   - Never commit the `.env` file to version control

### 3. Install Dependencies
```bash
cd Backend
npm install
```

## API Endpoints

### 1. Generate OTP (Registration)
**Endpoint**: `POST /auth/generate-otp`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "message": "OTP sent to your email",
  "otp": "123456"  // Only in development mode
}
```

### 2. Verify OTP
**Endpoint**: `POST /auth/verify-otp`

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "message": "OTP verified successfully"
}
```

### 3. Send Reset OTP (Forgot Password)
**Endpoint**: `POST /auth/send-reset-otp`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "otp": "123456"  // Only in development mode
}
```

### 4. Reset Password
**Endpoint**: `POST /auth/reset-password`

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## Email Templates

### Verification Email
- **Subject**: Email Verification OTP - Campaign Star
- **Purpose**: Sent during user registration
- **Contains**: 6-digit OTP code, valid for 5 minutes

### Password Reset Email
- **Subject**: Password Reset OTP - Campaign Star
- **Purpose**: Sent when user forgets password
- **Contains**: 6-digit OTP code, valid for 5 minutes

## Security Features

### OTP Generation
- 6-digit random numeric code
- Generated using `Math.random()` with proper range
- Unique for each request

### OTP Storage
- Stored in-memory (global object) for development
- **Production Recommendation**: Use Redis or database for persistent storage
- Automatic expiration after 5 minutes
- Automatically deleted after successful verification

### Rate Limiting
**Recommended for Production**:
- Limit OTP generation requests per email per timeframe
- Implement exponential backoff for failed attempts
- Add CAPTCHA for additional security

## Development vs Production

### Development Mode
- OTP returned in API response for testing
- Console logs for debugging
- In-memory storage

### Production Recommendations
1. **Remove OTP from Response**: Don't return OTP in API response
2. **Use Redis**: Replace in-memory storage with Redis
3. **Add Rate Limiting**: Prevent abuse
4. **Enable SSL/TLS**: Secure SMTP connection
5. **Monitor Email Delivery**: Track delivery failures
6. **Add Logging**: Log OTP attempts for security audits

## File Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── email.js          # Email service configuration
│   ├── routes/
│   │   └── auth.js           # OTP endpoints
│   └── ...
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment template
└── package.json               # Dependencies
```

## Troubleshooting

### Common Issues

1. **"Invalid login: 535-5.7.8 Username and Password not accepted"**
   - Solution: Use App Password instead of regular password
   - Enable 2-Factor Authentication first

2. **"ETIMEDOUT" or "ECONNECTION REFUSED"**
   - Solution: Check firewall settings
   - Ensure port 587 (SMTP) is not blocked

3. **OTP not received**
   - Check spam/junk folder
   - Verify EMAIL_USER is correct
   - Check Gmail quota limits

4. **"OTP expired"**
   - OTPs are valid for 5 minutes only
   - Request a new OTP

### Gmail Sending Limits
- Free Gmail accounts: ~500 emails/day
- For high-volume applications, consider:
  - SendGrid (free tier: 100 emails/day)
  - Mailgun (free tier: 5000 emails/month)
  - AWS SES (pay as you go)

## Alternative SMTP Providers

If you want to use other free SMTP services:

### Outlook/Hotmail
```javascript
service: 'hotmail',
auth: {
  user: 'your-email@outlook.com',
  pass: 'your-password'
}
```

### Yahoo Mail
```javascript
service: 'yahoo',
auth: {
  user: 'your-email@yahoo.com',
  pass: 'your-password'
}
```

### Custom SMTP
```javascript
host: 'smtp.example.com',
port: 587,
secure: false,
auth: {
  user: 'your-email',
  pass: 'your-password'
}
```

## Testing

### Manual Testing
1. Register a new account with your email
2. Check your inbox for OTP email
3. Enter the 6-digit OTP
4. Verify email successfully

### Test Forgot Password
1. Go to login page
2. Click "forgot password?"
3. Enter your email
4. Check inbox for OTP
5. Enter OTP and new password
6. Login with new password

## Support
For issues or questions, refer to:
- Nodemailer documentation: https://nodemailer.com
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

## License
MIT License - Feel free to use this implementation in your projects.
