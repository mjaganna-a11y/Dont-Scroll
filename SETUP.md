# Unfreeze App - Setup & Development Guide

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

4. **Watchman** (Mac only, recommended)
   ```bash
   brew install watchman
   ```

### Platform-Specific Requirements

#### For iOS Development (Mac only)

1. **Xcode** (latest version)
   - Install from Mac App Store
   - Install Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```

2. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

3. **iOS Simulator**
   - Included with Xcode
   - Or download separately from Xcode preferences

#### For Android Development

1. **Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)

2. **Android SDK**
   - Install via Android Studio
   - Required SDK versions: Android 13 (API 33) or higher

3. **Android Emulator**
   - Set up via Android Studio AVD Manager
   - Recommended: Pixel 5 or similar

4. **Environment Variables**
   
   Add to your `~/.bash_profile` or `~/.zshrc`:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/mjaganna-a11y/Dont-Scroll.git
cd Dont-Scroll
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React Native
- React Navigation
- AsyncStorage
- Other dependencies listed in package.json

### 3. iOS Setup (Mac only)

Install iOS dependencies:

```bash
cd ios
pod install
cd ..
```

If you encounter issues:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### 4. Android Setup

No additional setup required if Android Studio is properly configured.

## Running the App

### Start Metro Bundler

In one terminal window:

```bash
npm start
```

Or:

```bash
npx react-native start
```

### Run on iOS

In a new terminal window:

```bash
npm run ios
```

Or specify a simulator:

```bash
npx react-native run-ios --simulator="iPhone 14 Pro"
```

### Run on Android

Make sure an emulator is running or a device is connected.

In a new terminal window:

```bash
npm run android
```

## Development Workflow

### Project Structure Overview

```
src/
├── models/        # Data structures
├── services/      # Business logic
├── screens/       # UI components
└── navigation/    # App navigation

App.js            # Entry point
```

### Making Changes

1. **Edit files** in the `src/` directory
2. **Save changes** - Metro will hot reload automatically
3. **Test changes** in the simulator/emulator
4. **Commit** when feature is complete

### Hot Reloading

- iOS: Cmd + D → Enable Fast Refresh
- Android: Cmd + M → Enable Fast Refresh

### Debugging

#### React Native Debugger

1. Install React Native Debugger:
   ```bash
   brew install --cask react-native-debugger
   ```

2. Open debugger and reload app:
   - iOS: Cmd + D → Debug
   - Android: Cmd + M → Debug

#### Chrome DevTools

- iOS: Cmd + D → Debug
- Android: Cmd + M → Debug
- Opens Chrome at `http://localhost:8081/debugger-ui`

#### Console Logs

View logs in terminal:

```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

## Common Issues & Solutions

### Metro Bundler Issues

**Problem**: Metro not starting or cache issues

**Solution**:
```bash
npm start -- --reset-cache
```

### iOS Build Fails

**Problem**: Pod installation errors

**Solution**:
```bash
cd ios
rm -rf Pods
pod deintegrate
pod install
cd ..
```

### Android Build Fails

**Problem**: Gradle issues

**Solution**:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Port Already in Use

**Problem**: Metro bundler port 8081 in use

**Solution**:
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill

# Or use different port
npm start -- --port 8082
```

### Simulator Not Showing App

**Problem**: App not appearing after build

**Solution**:
1. Quit and restart simulator
2. Clean build:
   ```bash
   # iOS
   cd ios
   xcodebuild clean
   cd ..
   
   # Android
   cd android
   ./gradlew clean
   cd ..
   ```

## Testing

### Manual Testing Checklist

- [ ] Complete onboarding flow (all 7 steps)
- [ ] Navigate between tab screens
- [ ] Start and complete a focus session
- [ ] View screen time insights
- [ ] Check stats and gamification
- [ ] Edit profile in settings
- [ ] Test emergency exit in focus mode
- [ ] Verify data persistence (close and reopen app)

### Testing User Flows

1. **First-Time User**
   - Delete app data
   - Go through onboarding
   - Start first session

2. **Returning User**
   - Close and reopen app
   - Check data persistence
   - Complete another session

3. **Power User**
   - Complete multiple sessions
   - Earn badges
   - Build streak

## Data Management

### View Stored Data

Data is stored in AsyncStorage. To view:

1. Add debugging code:
   ```javascript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   AsyncStorage.getAllKeys().then(keys => {
     console.log('All keys:', keys);
   });
   ```

2. View in React Native Debugger

### Clear App Data

#### iOS Simulator
```bash
xcrun simctl erase all
```

Or in simulator: Device → Erase All Content and Settings

#### Android Emulator
Settings → Apps → Unfreeze → Storage → Clear Data

### Reset During Development

In settings screen, use "Reset All Data" button, or programmatically:

```javascript
import { StorageService } from './src/services/StorageService';

StorageService.clearAllData();
```

## Code Style

### Formatting

- Use 2 spaces for indentation
- Single quotes for strings
- Semicolons at end of statements
- Trailing commas in objects/arrays

### Naming Conventions

- **Components**: PascalCase (`HomeScreen.js`)
- **Functions**: camelCase (`generateTasks()`)
- **Constants**: UPPER_SNAKE_CASE (`USER_ROLE`)
- **Files**: PascalCase for components, camelCase for utilities

## Performance Tips

### Development

- Keep Metro bundler running
- Use Fast Refresh instead of full reload
- Close unused apps to free RAM
- Use physical device for better performance

### Production

- Enable Hermes engine (already configured)
- Optimize images before adding
- Use FlatList for long lists
- Minimize re-renders with React.memo

## Building for Production

### iOS

1. **Open Xcode project**
   ```bash
   open ios/Unfreeze.xcworkspace
   ```

2. **Select target**: Any iOS Device or your connected device

3. **Archive**: Product → Archive

4. **Submit**: Follow prompts to upload to App Store Connect

### Android

1. **Generate release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Find APK**:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

3. **Generate AAB for Play Store**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

## Environment Setup Verification

Run this command to verify setup:

```bash
npx react-native doctor
```

This checks:
- Node.js version
- Watchman installation
- Xcode setup
- Android Studio setup
- Environment variables

## Additional Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

### Troubleshooting
- [React Native Issues](https://github.com/facebook/react-native/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### Community
- [React Native Community](https://www.reactnative.community/)
- [Reactiflux Discord](https://www.reactiflux.com/)

## Development Tips

### Quick Commands

```bash
# Start fresh
npm start -- --reset-cache

# Reload app
# iOS: Cmd + R
# Android: R R (double tap R)

# Open dev menu
# iOS: Cmd + D
# Android: Cmd + M

# Toggle element inspector
# iOS: Cmd + D → Show Element Inspector
# Android: Cmd + M → Show Element Inspector

# Clear watchman
watchman watch-del-all

# Clear npm cache
npm cache clean --force
```

### Useful Scripts to Add

Add these to `package.json` scripts:

```json
"clean-ios": "cd ios && xcodebuild clean && cd ..",
"clean-android": "cd android && ./gradlew clean && cd ..",
"clean-all": "npm run clean-ios && npm run clean-android && npm start -- --reset-cache",
"pod-install": "cd ios && pod install && cd .."
```

## Getting Help

If you encounter issues:

1. Check this guide for solutions
2. Search existing GitHub issues
3. Check React Native documentation
4. Ask in React Native community forums
5. Open a new GitHub issue with:
   - Detailed description
   - Steps to reproduce
   - Screenshots/error messages
   - Your environment details

## Next Steps

After setup:

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical overview
2. Check [FLOWCHART.md](./FLOWCHART.md) for user flows
3. Review [UX_EXPLANATION.md](./UX_EXPLANATION.md) for design decisions
4. Start developing!

---

Happy coding! 🚀
