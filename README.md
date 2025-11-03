# Echo - Your Personal AI Companion

> **Your all-in-one AI companion that tracks emotions, manages life, motivates you, and integrates finance, learning, and personal growth.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-React%20Native-61DAFB)
![License](https://img.shields.io/badge/license-MIT-green)

## 📖 Table of Contents

- [Vision & Purpose](#vision--purpose)
- [Documentation](#documentation)
- [Quick Start](#quick-start)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🎯 Vision & Purpose

Echo (SecondBrain) is a personal mobile application designed to act as your second brain. It helps manage daily life, emotions, learning, finances, motivation, and entertainment in one seamless interface.

### Core Philosophy

- **Real productivity** requires balancing work, learning, and personal happiness
- **Mood and emotional state** strongly influence effectiveness; the app uses AI to adjust schedules and suggestions accordingly
- **Entertainment, personal growth, and learning** are integrated to maintain motivation and avoid burnout

### Goals

✅ Build a personal AI assistant to track emotions, productivity, and habits  
✅ Integrate mood analysis and scheduling to optimize daily routines  
✅ Support learning (coding, vocabulary, skills) while balancing entertainment  
✅ Track financial activity (stocks and crypto) with AI-guided insights  
✅ Provide actionable feedback, reminders, and progress reports

## 📚 Documentation

### Quick Start Guides
- **[QUICK-START.md](./QUICK-START.md)** - Get running in 5 minutes ⚡
- **[SETUP.md](./SETUP.md)** - Detailed installation guide
- **[GIT-WORKFLOW.md](./GIT-WORKFLOW.md)** - Feature-based development workflow
- **[FREE-SERVICES.md](./FREE-SERVICES.md)** - Verification that everything is 100% free

### Comprehensive Documentation
Full documentation is available in the `/docs` folder:

- **[00-Documentation-Index.md](./docs/00-Documentation-Index.md)** - Complete documentation guide
- **[01-Vision-and-Objectives.md](./docs/01-Vision-and-Objectives.md)** - Why this app exists and what problems it solves
- **[02-User-Persona.md](./docs/02-User-Persona.md)** - Tailored around you, your habits, and emotional patterns
- **[03-Feature-Overview.md](./docs/03-Feature-Overview.md)** - All modules and capabilities
- **[04-System-Architecture.md](./docs/04-System-Architecture.md)** - Technical architecture and diagrams
- **[05-AI-Model-Strategy.md](./docs/05-AI-Model-Strategy.md)** - Training, personalization, data flow, privacy
- **[06-Mood-Productivity-Flow.md](./docs/06-Mood-Productivity-Flow.md)** - How mood influences notifications and tasks
- **[07-Scheduling-Logic.md](./docs/07-Scheduling-Logic.md)** - Flow and pseudocode for daily planner
- **[08-Finance-Module.md](./docs/08-Finance-Module.md)** - APIs, dashboards, and mood-aware coaching
- **[09-Tech-Stack-and-Costs.md](./docs/09-Tech-Stack-and-Costs.md)** - Tools, hosting budget, storage choices ($0/month)
- **[10-Development-Roadmap.md](./docs/10-Development-Roadmap.md)** - Expansion from prototype to portfolio project
- **[11-API-Schemas.md](./docs/11-API-Schemas.md)** - JSON structures and data models
- **[12-Security-Privacy.md](./docs/12-Security-Privacy.md)** - Data protection and privacy measures

## 🚀 Quick Start

### Option 1: Super Quick (5 minutes)
See **[QUICK-START.md](./QUICK-START.md)** for the fastest way to get running.

### Option 2: Full Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/echo.git

# Navigate to project directory
cd echo

# Install dependencies
npm install

# Copy environment template and add your API keys
cp .env.example .env
# Edit .env with your Gemini API key (free from https://makersuite.google.com)

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

**See [SETUP.md](./SETUP.md) for detailed installation instructions.**

### 💰 Cost: $0/month
All services used are **100% free** for personal development. See [FREE-SERVICES.md](./FREE-SERVICES.md) for verification.

## ✨ Features

### 🎭 Mood Tracker + AI Analysis
Records mood, journal entries, and behavior. AI provides personalized suggestions and insights.

### 📅 Task & Schedule Management
To-do lists, reminders, travel and sleep integration, priority-based scheduling.

### 💪 Motivation & Habit Builder
Streaks, daily affirmations, motivational content, and habit tracking gamification.

### 📚 Learning Hub
- English word-of-the-day and quizzes
- Coding challenges (LeetCode-style)
- AI-powered learning hints

### 💰 Finance & Crypto Tracker
Real-time stock and crypto portfolio tracking, emotional trading alerts, and learning resources.

### 🎮 Entertainment Hub
Music, videos, games, piano practice, or relaxation content to balance stress.

### 🤖 AI Chat Companion
Conversational AI trained on your app data for guidance, motivation, and emotional support.

### 📊 Personal Dashboard
Central hub showing mood trends, task completion, progress, and wellness metrics.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React Native (TypeScript) + Expo |
| **Backend** | Node.js with Express / Firebase Functions |
| **Database** | SQLite (local) + Supabase (optional sync) |
| **AI Layer** | Gemini API / OpenAI API + local embeddings |
| **Hosting** | Firebase / Render.com (free tier) |
| **APIs** | CoinGecko, Alpha Vantage, NewsAPI |

## 📁 Project Structure

```
Echo/
├── docs/                    # Comprehensive documentation
├── src/
│   ├── components/          # React Native components
│   ├── screens/             # App screens
│   ├── services/            # API services and business logic
│   ├── utils/               # Utility functions
│   ├── models/              # Data models and schemas
│   ├── ai/                  # AI integration and processing
│   └── navigation/          # Navigation configuration
├── assets/                  # Images, fonts, and static files
├── tests/                   # Unit and integration tests
├── .env.example             # Environment variables template
├── package.json
└── README.md
```

## 🔄 Development Workflow

This project follows a **feature-based Git workflow** with frequent commits:

```bash
# Create feature branch
git checkout -b feature/mood-tracking

# Make small changes and commit frequently
git add .
git commit -m "feat(mood): add mood selector component"
git push origin feature/mood-tracking

# Merge when feature is complete
git checkout develop
git merge feature/mood-tracking
git push origin develop
```

**See [GIT-WORKFLOW.md](./GIT-WORKFLOW.md) for complete workflow guide.**

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with passion for personal growth and productivity
- Inspired by the need for an integrated life management system
- Powered by AI to adapt to individual needs and emotions

---

**Made with ❤️ by Mukund** | [Portfolio](https://yourportfolio.com) | [LinkedIn](https://linkedin.com/in/yourprofile)
