# Tech Stack & Cost Plan

## 🛠️ Technology Stack

Echo is built using modern, cost-effective technologies that prioritize performance, developer experience, and user privacy.

---

## 📱 Frontend Stack

### React Native + Expo

**Why React Native:**
- ✅ Cross-platform (iOS + Android) from single codebase
- ✅ Large ecosystem and community support
- ✅ Hot reloading for fast development
- ✅ Native performance with JavaScript flexibility
- ✅ Mukund's existing expertise (React/Node.js)

**Why Expo:**
- ✅ Simplified development workflow
- ✅ Over-the-air updates
- ✅ Built-in APIs for common features
- ✅ Easy deployment and testing
- ✅ Free tier sufficient for personal use

**Version:**
```json
{
  "expo": "~50.0.0",
  "react-native": "0.73.0",
  "react": "18.2.0"
}
```

### UI Framework & Styling

**Component Library: React Native Paper**
- Material Design components
- Customizable theming
- Accessibility built-in
- Well-documented

**Styling: Styled Components + NativeWind (Tailwind for RN)**
```bash
npm install styled-components
npm install nativewind
npm install tailwindcss
```

**Icons: React Native Vector Icons + Lucide**
```bash
npm install react-native-vector-icons
npm install lucide-react-native
```

### State Management

**Context API + useReducer**
- Built into React (no extra dependencies)
- Sufficient for app complexity
- Easy to understand and maintain

**Alternative (if needed): Zustand**
```bash
npm install zustand
```
- Lightweight (1KB)
- Simple API
- Better performance than Context for frequent updates

### Navigation

**React Navigation v6**
```bash
npm install @react-navigation/native
npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens
npm install react-native-safe-area-context
```

---

## 🗄️ Backend & Database

### Local Database: SQLite

**Library: expo-sqlite**
```bash
npx expo install expo-sqlite
```

**Why SQLite:**
- ✅ Embedded database (no server needed)
- ✅ Fast queries for local data
- ✅ Reliable and battle-tested
- ✅ Works offline by default
- ✅ Free and open-source

**Encryption: SQLCipher**
```bash
npm install @journeyapps/react-native-sqlite-storage
```
- AES-256 encryption
- Transparent encryption/decryption
- Minimal performance impact

### Cloud Sync (Optional): Supabase

**Why Supabase:**
- ✅ PostgreSQL-based (powerful queries)
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ Generous free tier
- ✅ Open-source

**Free Tier:**
- 500MB database
- 1GB file storage
- 2GB bandwidth/month
- Unlimited API requests

**Pricing (if exceeded):**
- Pro: $25/month (8GB database, 100GB bandwidth)

**Installation:**
```bash
npm install @supabase/supabase-js
```

### Local Storage

**AsyncStorage (Expo)**
```bash
npx expo install @react-native-async-storage/async-storage
```
- Key-value storage
- For user preferences and settings
- Simple API

**SecureStore (Expo)**
```bash
npx expo install expo-secure-store
```
- Encrypted storage for sensitive data
- API keys, tokens, encryption keys
- Platform-specific secure storage (Keychain/Keystore)

---

## 🤖 AI & Machine Learning

### Primary: Google Gemini API

**Why Gemini:**
- ✅ Generous free tier (1,500 requests/day)
- ✅ Multimodal capabilities
- ✅ Fast response times
- ✅ Competitive with GPT-3.5
- ✅ Good for personal projects

**Installation:**
```bash
npm install @google/generative-ai
```

**Free Tier Limits:**
- 60 requests per minute
- 1,500 requests per day
- Rate limits reset daily

**Pricing (if exceeded):**
- Gemini Pro: $0.00025 per 1K characters input
- Gemini Pro: $0.0005 per 1K characters output

### Alternative: OpenAI API

**For comparison or fallback:**
```bash
npm install openai
```

**Pricing:**
- GPT-3.5-turbo: $0.0015 per 1K input tokens, $0.002 per 1K output tokens
- GPT-4: $0.03 per 1K input tokens, $0.06 per 1K output tokens

### Local AI (Future): TensorFlow.js

**For on-device processing:**
```bash
npm install @tensorflow/tfjs
npm install @tensorflow/tfjs-react-native
```

**Use Cases:**
- Simple pattern recognition
- Embeddings storage
- Offline predictions
- Privacy-sensitive operations

---

## 📊 Data Visualization

### React Native Chart Kit

```bash
npm install react-native-chart-kit
npm install react-native-svg
```

**Features:**
- Line charts (mood trends)
- Bar charts (task completion)
- Pie charts (time allocation)
- Progress circles (habit streaks)

**Alternative: Victory Native**
```bash
npm install victory-native
```
- More customizable
- Better animations
- Larger bundle size

---

## 🔔 Notifications

### Expo Notifications

```bash
npx expo install expo-notifications
npx expo install expo-device
```

**Features:**
- Local notifications (free)
- Scheduled notifications
- Badge management
- Sound and vibration

**Push Notifications (Optional): Firebase Cloud Messaging**
```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging
```

**Cost:** Free (unlimited notifications)

---

## 💰 External APIs

### Finance APIs

#### CoinGecko (Crypto Prices)

**Free Tier:**
- 50 calls/minute
- 10,000 calls/month
- No API key required

**Pricing (if exceeded):**
- Analyst: $129/month (500 calls/min, 500K/month)

**Installation:**
```bash
# No SDK needed, use fetch
```

#### Alpha Vantage (Stock Prices)

**Free Tier:**
- 5 API calls/minute
- 500 calls/day

**Pricing (if exceeded):**
- Premium: $49.99/month (75 calls/min, unlimited daily)

**Installation:**
```bash
# No SDK needed, use fetch
```

### News API (Optional)

**Free Tier:**
- 100 requests/day
- Developer plan only

**Pricing:**
- Business: $449/month (unlimited)

---

## 🎨 Development Tools

### TypeScript

```bash
npm install --save-dev typescript @types/react @types/react-native
```

**Benefits:**
- Type safety
- Better IDE support
- Fewer runtime errors
- Self-documenting code

### Linting & Formatting

**ESLint + Prettier**
```bash
npm install --save-dev eslint prettier
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

### Testing

**Jest (Unit Tests)**
```bash
npm install --save-dev jest @testing-library/react-native
```

**Detox (E2E Tests - Optional)**
```bash
npm install --save-dev detox
```

---

## 💵 Cost Breakdown

### Monthly Costs (Personal Use)

| Service | Free Tier | Expected Usage | Estimated Cost |
|---------|-----------|----------------|----------------|
| **Expo** | Unlimited builds | Personal dev | **$0** |
| **Supabase** | 500MB DB, 1GB storage | Optional sync | **$0** |
| **Gemini API** | 1,500 req/day | ~100-200/day | **$0** |
| **CoinGecko** | 10K calls/month | ~1K/month | **$0** |
| **Alpha Vantage** | 500 calls/day | ~50/day | **$0** |
| **Firebase (Notifications)** | Unlimited | Push notifications | **$0** |
| **Domain (Optional)** | N/A | Portfolio site | **$12/year** |

**Total Monthly Cost: $0-1** (staying within free tiers)

### If Scaling Beyond Personal Use

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| **Expo EAS** | Production | $29/month |
| **Supabase** | Pro | $25/month |
| **Gemini API** | Pay-as-you-go | ~$5-10/month |
| **CoinGecko** | Analyst | $129/month |
| **Alpha Vantage** | Premium | $50/month |

**Total (Production): ~$238/month**

---

## 📦 Complete Package.json

```json
{
  "name": "echo",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json}\""
  },
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    
    "expo-sqlite": "~13.0.0",
    "expo-secure-store": "~12.8.0",
    "@react-native-async-storage/async-storage": "1.21.0",
    
    "@google/generative-ai": "^0.1.3",
    
    "react-native-paper": "^5.11.3",
    "react-native-vector-icons": "^10.0.3",
    "lucide-react-native": "^0.294.0",
    
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "14.1.0",
    
    "expo-notifications": "~0.27.0",
    
    "zustand": "^4.4.7",
    "date-fns": "^3.0.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@babel/core": "^7.23.5",
    "@types/react": "~18.2.45",
    "@types/react-native": "~0.73.0",
    "typescript": "^5.3.3",
    
    "eslint": "^8.55.0",
    "prettier": "^3.1.1",
    "@typescript-eslint/parser": "^6.15.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.2"
  }
}
```

---

## 🏗️ Project Structure

```
Echo/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Buttons, inputs, cards
│   │   ├── mood/            # Mood selector, mood chart
│   │   ├── tasks/           # Task card, task list
│   │   ├── finance/         # Portfolio card, price chart
│   │   └── learning/        # Challenge card, progress bar
│   │
│   ├── screens/             # App screens
│   │   ├── Dashboard/
│   │   ├── Mood/
│   │   ├── Tasks/
│   │   ├── Learning/
│   │   ├── Finance/
│   │   ├── Entertainment/
│   │   ├── Community/
│   │   ├── AIChat/
│   │   └── Settings/
│   │
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   │
│   ├── services/            # Business logic
│   │   ├── MoodService.ts
│   │   ├── TaskService.ts
│   │   ├── AIService.ts
│   │   ├── FinanceService.ts
│   │   ├── LearningService.ts
│   │   └── NotificationService.ts
│   │
│   ├── database/            # Database layer
│   │   ├── schema.ts
│   │   ├── migrations/
│   │   └── repositories/
│   │
│   ├── api/                 # External API integrations
│   │   ├── gemini.ts
│   │   ├── coinGecko.ts
│   │   ├── alphaVantage.ts
│   │   └── supabase.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── dateHelpers.ts
│   │   ├── encryption.ts
│   │   ├── validation.ts
│   │   └── formatters.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useMood.ts
│   │   ├── useTasks.ts
│   │   ├── usePortfolio.ts
│   │   └── useNotifications.ts
│   │
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── MoodContext.tsx
│   │   ├── TaskContext.tsx
│   │   └── SettingsContext.tsx
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── mood.ts
│   │   ├── task.ts
│   │   ├── finance.ts
│   │   └── index.ts
│   │
│   └── constants/           # App constants
│       ├── colors.ts
│       ├── config.ts
│       └── strings.ts
│
├── assets/                  # Static assets
│   ├── images/
│   ├── fonts/
│   └── sounds/
│
├── docs/                    # Documentation
│
├── tests/                   # Test files
│   ├── unit/
│   └── integration/
│
├── .env.example             # Environment variables template
├── .gitignore
├── app.json                 # Expo configuration
├── babel.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

### .env.example

```bash
# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Finance APIs
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
# CoinGecko doesn't require API key for free tier

# Cloud Services (Optional)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Database Encryption
DB_ENCRYPTION_KEY=generate_secure_random_key_here

# App Configuration
APP_ENV=development
API_TIMEOUT=10000
ENABLE_ANALYTICS=false
```

---

## 🚀 Deployment Strategy

### Development

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on physical device (scan QR code with Expo Go app)
```

### Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run linter
npm run lint

# Format code
npm run format
```

### Production Build

**Using Expo EAS (Recommended)**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

**Cost:**
- Free tier: Limited builds/month
- Production: $29/month (unlimited builds)

---

## 📊 Performance Optimization

### Bundle Size Optimization

```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin',
    ['transform-remove-console', { exclude: ['error', 'warn'] }] // Remove console.logs in production
  ]
};
```

### Image Optimization

```bash
# Install image optimization tools
npm install --save-dev sharp
```

### Code Splitting

```typescript
// Lazy load screens
const DashboardScreen = lazy(() => import('./screens/Dashboard'));
const FinanceScreen = lazy(() => import('./screens/Finance'));
```

---

## 🔮 Future Tech Considerations

### Phase 2
- **Web App:** Next.js for web version
- **Desktop:** Electron wrapper
- **Backend API:** Node.js + Express (if needed)

### Phase 3
- **Real-time Sync:** WebSockets
- **Advanced Analytics:** Custom analytics dashboard
- **Voice Interface:** Speech recognition APIs

### Phase 4
- **Microservices:** Separate services for AI, Finance, etc.
- **GraphQL:** Flexible data querying
- **Kubernetes:** Container orchestration (if scaling)

---

**Echo's tech stack is designed for rapid development, low costs, and future scalability—perfect for a personal project that can grow into a portfolio showcase.**
