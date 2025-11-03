# Echo - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide gets you from zero to running Echo as fast as possible.

---

## ⚡ Prerequisites Check

```bash
# Check Node.js (need v18+)
node --version

# Check npm
npm --version

# If missing, install from: https://nodejs.org/
```

---

## 📦 Installation (3 Steps)

### Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/echo.git
cd echo

# Install dependencies
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Gemini API key
# Get free key from: https://makersuite.google.com/app/apikey
```

**Minimum .env configuration:**
```bash
GEMINI_API_KEY=your_actual_gemini_key_here
DB_ENCRYPTION_KEY=any_random_32_character_string_here
```

### Step 3: Start Development Server

```bash
npm start
```

---

## 📱 Run on Device

### Option A: Expo Go (Easiest)

1. Install **Expo Go** app on your phone
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan QR code from terminal

3. App loads on your phone ✅

### Option B: Simulator

```bash
# iOS (macOS only)
npm run ios

# Android
npm run android
```

---

## 🎯 First Use

### 1. Open the App
- App launches to dashboard

### 2. Log Your First Mood
- Tap mood selector
- Choose how you're feeling
- Add optional note
- See it appear on dashboard

### 3. Create Your First Task
- Navigate to Tasks
- Tap "Add Task"
- Enter task details
- Set priority and due date

### 4. Try AI Chat
- Navigate to AI Chat
- Ask: "How should I plan my day?"
- Get personalized recommendations

---

## 📚 Learn More

### Essential Reading (15 min)
1. [README.md](README.md) - Project overview
2. [01-Vision-and-Objectives.md](docs/01-Vision-and-Objectives.md) - Why Echo exists
3. [03-Feature-Overview.md](docs/03-Feature-Overview.md) - All features

### Full Documentation
- See [docs/00-Documentation-Index.md](docs/00-Documentation-Index.md)
- 13 comprehensive guides
- 50,000+ words of documentation

---

## 🛠️ Common Issues

### "Module not found"
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### "API key not working"
- Check `.env` file exists
- Verify key is correct
- Restart server after changing `.env`

### "Database error"
- Delete app and reinstall
- Check `DB_ENCRYPTION_KEY` is set

---

## 🎓 Next Steps

1. **Explore Features**
   - Try mood tracking
   - Create tasks
   - Chat with AI
   - Set up habits

2. **Read Documentation**
   - Understand the vision
   - Learn the architecture
   - See the roadmap

3. **Start Developing**
   - Follow [10-Development-Roadmap.md](docs/10-Development-Roadmap.md)
   - Build MVP features
   - Customize for your needs

---

## 💡 Quick Tips

- **Mood First:** Log your mood daily for best AI insights
- **Start Small:** Don't add too many tasks at once
- **Be Honest:** AI works better with honest mood data
- **Explore:** Try all features to see what helps you
- **Customize:** Adjust settings to match your preferences

---

## 📞 Need Help?

- **Setup Issues:** See [SETUP.md](SETUP.md)
- **Documentation:** See [docs/](docs/)
- **Questions:** Create GitHub issue
- **Feedback:** Contact via email/LinkedIn

---

**You're all set! Start building your personal AI companion. 🎉**
