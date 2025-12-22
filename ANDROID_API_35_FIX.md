# Fix: Android API Level 35 Requirement

## Problem
Google Play Store error: "Your app currently targets API level 34 and must target at least API level 35"

## Solution Applied

Updated `app.json` with the following configuration:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "bab1be55-6e28-45d5-834a-8296a84c239c"
      }
    },
    "android": {
      "package": "com.campaignstar",
      "targetSdkVersion": 35,
      "compileSdkVersion": 35
    }
  }
}
```

## Next Steps

1. **Rebuild your Android app using EAS:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Or if using local build:**
   ```bash
   npx cap sync android
   # Then build in Android Studio
   ```

3. **Upload the new APK/AAB to Google Play Console**

## Key Changes
- ✅ `targetSdkVersion`: 35 (Android 15)
- ✅ `compileSdkVersion`: 35 (Android 15)

## Testing
After rebuilding, verify the SDK version:
```bash
aapt dump badging your-app.apk | grep "targetSdkVersion"
```

Should show: `targetSdkVersion:'35'`

## Important Notes
- Google Play requires API level 35 for all new app submissions and updates as of late 2024
- This ensures your app uses the latest security and performance optimizations
- Make sure to test your app thoroughly on Android 15 devices after this update

## Build Command
```bash
cd d:\Campaign-Star
eas build --platform android --profile production
```

## Additional Resources
- [Android 15 Behavior Changes](https://developer.android.com/about/versions/15/behavior-changes-15)
- [Play Console API Level Requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
