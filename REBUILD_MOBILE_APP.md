# How to Rebuild Mobile App to See Changes

## ⚠️ IMPORTANT: Your mobile app is showing OLD cached code

The CSS changes are correct in the code, but your Android app needs to be rebuilt to see them.

## Quick Steps to Rebuild:

### Option 1: Full Rebuild (Recommended)
```bash
cd frontend

# 1. Build the web app
npm run build

# 2. Sync with Capacitor
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. In Android Studio:
#    - Click "Build" > "Clean Project"
#    - Click "Build" > "Rebuild Project"
#    - Click "Run" button (green play icon)
```

### Option 2: Quick Live Reload (For Development)
```bash
cd frontend

# Start dev server
npm run dev

# In another terminal
npx cap run android -l --external

# This enables live reload - changes will appear immediately
```

### Option 3: Test in Browser First
```bash
cd frontend
npm run dev

# Open http://localhost:5173 in Chrome
# Press F12, click mobile device icon
# Set to "Responsive" or choose a phone model
# Resize to mobile width
# Press Ctrl+Shift+R to hard refresh
```

## Why This is Happening:

1. **Capacitor apps bundle HTML/CSS/JS** into the APK
2. Your app has the **OLD version** bundled inside
3. Changes to GitHub don't automatically update installed apps
4. You must **rebuild and reinstall** to see changes

## Expected Result After Rebuild:

✅ Ads will show **2 per row** side by side
✅ Smaller card size (200px height instead of 240px)
✅ Smaller images (110px instead of 140px)
✅ Tighter spacing (6px gaps)

## Troubleshooting:

### If ads still show vertically after rebuild:

1. **Check if build actually updated:**
   ```bash
   # Check build timestamp
   ls -l frontend/dist
   ```

2. **Force clean everything:**
   ```bash
   cd frontend
   rm -rf dist
   rm -rf android/app/build
   npm run build
   npx cap sync android
   ```

3. **Verify mobile.css is loading:**
   - In Android Studio, open Chrome DevTools
   - Connect your device
   - Go to chrome://inspect
   - Inspect your app
   - Check if mobile.css rules are applied

4. **Check screen width:**
   - The @media query triggers at max-width: 768px
   - Some devices might have wider viewport
   - Try making cards even smaller or adjusting breakpoint

## Alternative: Deploy to Web Server

If you're hosting on Vercel/Netlify:
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

Users will see changes immediately without app rebuild.

## Need Help?

If still not working after rebuild, check:
- [ ] Android Studio successfully built
- [ ] App was uninstalled and reinstalled (or "Build > Clean Project")
- [ ] No cache issues (Settings > Apps > Clear Cache)
- [ ] CSS file size changed in the APK
