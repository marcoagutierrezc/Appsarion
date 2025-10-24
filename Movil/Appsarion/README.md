# Appsarion (Expo SDK 54)

This project has been updated to align dependencies with a modern Expo SDK while preserving the original app logic.

## What was updated
- Fixed Expo config schema (removed invalid `android.supportsTablet`).
- Installed required native peer dependencies for React Navigation:
  - `react-native-screens`, `react-native-safe-area-context`.
- Installed missing runtime modules used by the code:
  - `@expo/vector-icons`, `@react-native-async-storage/async-storage`, `expo-file-system`, `react-native-draggable`.
- De-duplicated `expo-constants` versions via `expo install`.
- Wrapped the app with `GestureHandlerRootView` and `SafeAreaProvider` (no logic change) for compatibility with RN 0.81/Navigation v7.
- Added an npm `start` script.

## How to run (Android)
1. Install Android Studio + SDK Platform 36 and required build tools.
2. Set the Android SDK path (PowerShell):
   - If default SDK location is different, set the variable accordingly:
     - `$env:ANDROID_HOME = "$env:LOCALAPPDATA/Android/Sdk"`
     - Or create `android/local.properties` with: `sdk.dir=C:\\Users\\<YOU>\\AppData\\Local\\Android\\Sdk`
3. Install dependencies:
   - `npm install`
4. Sync native projects after config changes:
   - `npx expo prebuild --clean` (Optional, but recommended after config edits)
5. Run Android:
   - `npm run android`

## Notes
- If `.expo/` is already tracked by git, run: `git rm -r --cached .expo` to stop tracking it (it's already in `.gitignore`).
- If you still see a `java.lang.String cannot be cast to java.lang.Boolean` crash, please capture the full stack trace. Typical root causes:
  - Missing peer dependencies (fixed above).
  - Invalid app.json schema fields (fixed above).
  - Manifest meta-data typed as strings where a boolean is expected by a native module. Ensure booleans come from config plugins (not hard-coded as strings).
- TypeScript strict mode will report some app-level typing issues; these do not block running the app with Metro. We’ve left app logic intact; address types incrementally if desired.
