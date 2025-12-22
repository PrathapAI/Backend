# 🚀 Quick Start Guide - Email OTP Setup

## ⚡ Fast Setup (5 Minutes)

### Step 1: Configure Gmail (2 minutes)

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" → Follow steps

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - App: Mail
   - Device: Other → Enter "Campaign Star"
   - Click Generate
   - **Copy the 16-character password**

### Step 2: Configure Backend (1 minute)

```bash
cd Backend
```

Create `.env` file (or update existing):
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Replace**:
- `your-email@gmail.com` with your Gmail address
- `xxxx xxxx xxxx xxxx` with the App Password you just generated

### Step 3: Test Email Setup (1 minute)

```bash
npm run test:email
```

✅ If successful, you'll see:
```
✅ Verification email sent successfully!
✅ Password reset email sent successfully!
🎉 All tests passed!
```

📧 **Check your email** - You should receive 2 test emails

### Step 4: Start Application (1 minute)

```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🧪 Test the Features

### Test 1: Registration with Email OTP
1. Go to http://localhost:5173/register
2. Fill in: username, name, **email**
3. Click "send OTP to email"
4. Check your email inbox
5. Enter 6-digit OTP
6. Click "verify OTP"
7. Complete registration

### Test 2: Forgot Password
1. Go to http://localhost:5173/login
2. Click "forgot password?"
3. Enter your **email**
4. Click "send OTP"
5. Check your email
6. Enter OTP
7. Set new password

## 🔧 Troubleshooting

### Problem: Test email fails with "Invalid login"
**Solution**: 
- Use App Password, NOT your regular Gmail password
- Make sure 2FA is enabled

### Problem: No email received
**Solution**:
- Check spam/junk folder
- Wait 30-60 seconds
- Verify EMAIL_USER is correct

### Problem: Port 587 connection error
**Solution**:
- Check firewall settings
- Try disabling VPN
- Check antivirus isn't blocking

## 📝 What Was Implemented?

✅ Email-based OTP for registration (replaces phone OTP)
✅ Email-based OTP for password reset (replaces phone OTP)
✅ Professional HTML email templates
✅ 6-digit OTP codes
✅ 5-minute expiration
✅ Free Gmail SMTP service

## 📚 Documentation

For detailed information, see:
- `EMAIL_OTP_SETUP.md` - Complete setup guide
- `EMAIL_OTP_IMPLEMENTATION.md` - Technical implementation details

## 🎯 Production Checklist

Before deploying to production:

- [ ] Set EMAIL_USER and EMAIL_PASSWORD in production environment
- [ ] Remove OTP from API responses (currently shown for development)
- [ ] Implement Redis for OTP storage (currently in-memory)
- [ ] Add rate limiting (prevent OTP spam)
- [ ] Monitor email delivery
- [ ] Consider using SendGrid/AWS SES for higher volume

## 💡 Tips

- **Development**: OTP shown in API response for easy testing
- **Testing**: Use your own email to test the flow
- **Gmail Limits**: Free Gmail can send ~500 emails/day
- **Alternative**: Can use Outlook, Yahoo, or custom SMTP

---

**Need Help?** Check the detailed documentation in `EMAIL_OTP_SETUP.md`

**Status**: ✅ Ready to use
**Version**: 1.0.0
**Updated**: December 3, 2025
