# Echo - Setup Guide

## 🚀 Quick Start

Follow these steps to get Echo running on your local machine.

---

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** or **yarn** (comes with Node.js)
   - Verify: `npm --version`

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

4. **Git**
   - Download from: https://git-scm.com/
   - Verify: `git --version`

### For Mobile Development

**iOS Development (macOS only):**
- Xcode (from Mac App Store)
- iOS Simulator
- CocoaPods: `sudo gem install cocoapods`

**Android Development:**
- Android Studio
- Android SDK
- Android Emulator or physical device

**Alternative: Expo Go App**
- Install on your phone from App Store/Play Store
- Easiest way to test without simulators

---

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/echo.git
cd echo
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual API keys
# Use your preferred text editor
code .env  # VS Code
nano .env  # Terminal editor
```

**Required API Keys:**

1. **Gemini API Key** (Free)
   - Visit: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy and paste into `.env`

2. **Alpha Vantage API Key** (Free)
   - Visit: https://www.alphavantage.co/support/#api-key
   - Enter your email
   - Copy key from email into `.env`

3. **Database Encryption Key**
   ```bash
   # Generate a secure key
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Copy output into .env
   ```

**Optional API Keys:**
- OpenAI (if using GPT instead of Gemini)
- Supabase (if enabling cloud sync)
- CoinGecko Pro (if exceeding free tier)

### 4. Initialize Database

```bash
# Database will be created automatically on first run
# Schema is defined in src/database/schema.ts
npm run db:init
```

### 5. Start Development Server

```bash
npm start
# or
expo start
```

This will open Expo DevTools in your browser.

---

## 📱 Running on Devices

### Option 1: Expo Go (Easiest)

1. Install Expo Go on your phone
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Scan QR code from terminal/browser
   - iOS: Use Camera app
   - Android: Use Expo Go app

3. App will load on your phone

### Option 2: iOS Simulator (macOS only)

```bash
npm run ios
```

### Option 3: Android Emulator

```bash
npm run android
```

---

## 🛠️ Development Workflow

### Project Structure

```
Echo/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens
│   ├── services/        # Business logic
│   ├── database/        # Database layer
│   ├── navigation/      # Navigation setup
│   └── utils/           # Helper functions
├── assets/              # Images, fonts
├── docs/                # Documentation
└── tests/               # Test files
```

### Available Scripts

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --clear
```

#### 2. iOS build fails

```bash
# Reinstall pods
cd ios
pod install
cd ..
npm run ios
```

#### 3. Android build fails

```bash
# Clean gradle
cd android
./gradlew clean
cd ..
npm run android
```

#### 4. Database errors

```bash
# Reset database (WARNING: deletes all data)
npm run db:reset
```

#### 5. API key not working

- Check `.env` file exists and has correct keys
- Restart development server after changing `.env`
- Verify keys are valid on provider websites

---

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test File

```bash
npm test -- MoodService.test.ts
```

---

## 📦 Building for Production

### iOS

```bash
# Using Expo EAS
eas build --platform ios

# Or local build
npm run build:ios
```

### Android

```bash
# Using Expo EAS
eas build --platform android

# Or local build
npm run build:android
```

---

## 🔐 Security Setup

### 1. Generate Encryption Keys

```bash
# Database encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env as DB_ENCRYPTION_KEY
```

### 2. Enable Biometric Auth (Optional)

- Enabled by default in app settings
- Users can toggle in Settings > Security

### 3. Set Up PIN Protection (Optional)

- Users can set PIN in Settings > Security
- PIN is hashed before storage

---

## 📚 Next Steps

1. **Read the Documentation**
   - Check `/docs` folder for detailed guides
   - Start with `01-Vision-and-Objectives.md`

2. **Explore the Code**
   - Review `src/` folder structure
   - Check example components

3. **Customize**
   - Modify colors in `src/constants/colors.ts`
   - Adjust features in `src/constants/config.ts`

4. **Start Building**
   - Follow the roadmap in `docs/10-Development-Roadmap.md`
   - Begin with Phase 1 MVP features

---

## 🆘 Getting Help

### Resources

- **Documentation:** `/docs` folder
- **Issues:** GitHub Issues (if public repo)
- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/

### Common Questions

**Q: Do I need all the API keys?**
A: Only Gemini API key is required for MVP. Others are optional.

**Q: Can I use this without cloud sync?**
A: Yes! Cloud sync is completely optional. App works fully offline.

**Q: How do I reset everything?**
A: Delete the app, clear `.env`, and reinstall.

**Q: Can I contribute?**
A: This is a personal project, but feedback is welcome!

---

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] Expo CLI installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] `.env` file created
- [ ] API keys configured
- [ ] Development server running
- [ ] App loads on device/simulator
- [ ] Database initializes correctly
- [ ] Tests pass

---

**You're all set! Start building your personal AI companion. 🚀**
