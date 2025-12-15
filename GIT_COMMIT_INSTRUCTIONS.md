# Git Commit Instructions for Account Deletion Feature

## Summary of Changes

This commit adds a **secure, OTP-verified account deletion system** compliant with Google Play Store data deletion policies.

### Files Modified:

#### Backend
- `Backend/src/routes/auth.js` - Added `/auth/delete-account` and `/auth/delete-account/confirm` endpoints
- `Backend/src/config/email.js` - Added 'delete' purpose for deletion OTP email template
- `Backend/src/config/cloudinary.js` - Added `deleteCloudinaryImage()` helper function

#### Frontend
- `frontend/public/delete-account.html` - Updated to use production backend URLs

#### Documentation
- `ACCOUNT_DELETION_SETUP.md` - Complete deployment and Play Store setup guide
- `PRIVACY_POLICY_DELETION_SECTION.md` - Privacy policy text and Play Console answers

---

## 🚀 How to Commit and Push to GitLab

### Step 1: Stage All Changes

```powershell
cd d:\Campaign-Star

# Stage backend changes
git add Backend/src/routes/auth.js
git add Backend/src/config/email.js
git add Backend/src/config/cloudinary.js

# Stage frontend changes
git add frontend/public/delete-account.html

# Stage documentation
git add ACCOUNT_DELETION_SETUP.md
git add PRIVACY_POLICY_DELETION_SECTION.md
git add GIT_COMMIT_INSTRUCTIONS.md
```

### Step 2: Commit Changes

```powershell
git commit -m "feat: add secure account deletion with OTP verification for Play Store compliance

- Add POST /auth/delete-account endpoint to initiate deletion with OTP
- Add POST /auth/delete-account/confirm endpoint to verify OTP and delete data
- Implement complete data deletion: user, listings, images, messages, favorites, etc.
- Add Cloudinary image cleanup on account deletion
- Update email config to support deletion OTP emails
- Update frontend delete page to use production backend URLs
- Add comprehensive documentation for Play Store setup
- Include Privacy Policy section for data deletion

Complies with Google Play Store data deletion requirements.
Resolves: Account deletion feature for app store submission"
```

### Step 3: Push to GitLab

```powershell
# Push to main branch
git push origin main

# Or if you're on a different branch
git push origin <your-branch-name>
```

---

## 🔄 Alternative: Create Feature Branch (Recommended)

If you want to review changes before merging to main:

```powershell
# Create and switch to feature branch
git checkout -b feature/account-deletion

# Stage and commit (same as above)
git add Backend/src/routes/auth.js Backend/src/config/email.js Backend/src/config/cloudinary.js
git add frontend/public/delete-account.html
git add ACCOUNT_DELETION_SETUP.md PRIVACY_POLICY_DELETION_SECTION.md GIT_COMMIT_INSTRUCTIONS.md

git commit -m "feat: add secure account deletion with OTP verification for Play Store compliance

- Add POST /auth/delete-account endpoint to initiate deletion with OTP
- Add POST /auth/delete-account/confirm endpoint to verify OTP and delete data
- Implement complete data deletion: user, listings, images, messages, favorites, etc.
- Add Cloudinary image cleanup on account deletion
- Update email config to support deletion OTP emails
- Update frontend delete page to use production backend URLs
- Add comprehensive documentation for Play Store setup
- Include Privacy Policy section for data deletion

Complies with Google Play Store data deletion requirements."

# Push feature branch
git push origin feature/account-deletion

# Then create merge request in GitLab UI
```

---

## ✅ Post-Deployment Checklist

After pushing to GitLab and deploying:

### Backend Deployment (Railway/Render)
- [ ] Verify backend deployed successfully
- [ ] Check environment variables are set (EMAIL_USER, CLOUDINARY_*, etc.)
- [ ] Test endpoint: `POST https://your-backend.up.railway.app/auth/delete-account`

### Frontend Deployment (Vercel)
- [ ] Verify frontend deployed successfully
- [ ] Access: `https://your-frontend.vercel.app/delete-account.html`
- [ ] Test form submission

### Google Play Console
- [ ] Go to **App Content** → **Data Safety**
- [ ] Update data deletion URL: `https://your-frontend.vercel.app/delete-account.html`
- [ ] Fill out data collection questions using `PRIVACY_POLICY_DELETION_SECTION.md`
- [ ] Update Privacy Policy with deletion section

### Testing
- [ ] Test with valid user (phone number exists)
- [ ] Test OTP verification
- [ ] Verify data deleted from database
- [ ] Check Cloudinary images deleted
- [ ] Test on mobile device

---

## 📊 What Changed

### New Endpoints
- `POST /auth/delete-account` - Request deletion with phone/email, receive OTP
- `POST /auth/delete-account/confirm` - Confirm with OTP, permanently delete data

### Data Deletion Coverage
✅ User account and profile  
✅ All user listings  
✅ Listing images (DB + Cloudinary)  
✅ Favorites (user's and others' of user's listings)  
✅ Messages (sent/received)  
✅ Reviews (given/received)  
✅ Search history  
✅ Notifications  
✅ Reports  
✅ Activity logs  

### Security Features
✅ OTP verification (5-min expiry)  
✅ Database transaction (atomic deletion)  
✅ Cloudinary cleanup  
✅ Request logging  
✅ User warnings  

---

## 🆘 Troubleshooting

### If commit fails:
```powershell
# Check current status
git status

# Stash any untracked changes
git stash

# Try commit again
```

### If push fails (authentication):
```powershell
# Check remote URL
git remote -v

# Update remote if needed
git remote set-url origin https://gitlab.com/your-username/campaign-star.git

# Try push with credentials
git push origin main
```

### If merge conflicts:
```powershell
# Pull latest changes
git pull origin main

# Resolve conflicts in files
# Then stage and commit
git add .
git commit -m "fix: resolve merge conflicts"
git push origin main
```

---

## 📞 Support

For questions:
- **Developer:** prathapv260@gmail.com
- **Documentation:** See `ACCOUNT_DELETION_SETUP.md`

---

**Ready to commit!** 🚀
