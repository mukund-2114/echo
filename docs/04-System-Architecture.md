# System Architecture

## 🏗️ Architecture Overview

Echo follows a **mobile-first, local-first architecture** with optional cloud synchronization. The system is designed for privacy, performance, and offline capability.

---

## 📐 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     MOBILE APPLICATION                       │
│                    (React Native + Expo)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  UI Layer    │  │ Navigation   │  │  Components  │      │
│  │  (Screens)   │  │  (Routes)    │  │  (Reusable)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │           STATE MANAGEMENT (Context API)           │     │
│  └─────────────────────────┬──────────────────────────┘     │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │              BUSINESS LOGIC LAYER                  │     │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │     │
│  │  │  Mood    │ │  Tasks   │ │ Learning │  ...      │     │
│  │  │ Service  │ │ Service  │ │ Service  │           │     │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘           │     │
│  └───────┼────────────┼────────────┼──────────────────┘     │
│          │            │            │                         │
│  ┌───────▼────────────▼────────────▼──────────────────┐     │
│  │            DATA ACCESS LAYER (DAL)                 │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │      SQLite Database (Encrypted)         │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                  │
         ▼                                  ▼
┌─────────────────┐              ┌─────────────────┐
│  EXTERNAL APIs  │              │  CLOUD SERVICES │
├─────────────────┤              ├─────────────────┤
│ • Gemini AI     │              │ • Supabase      │
│ • OpenAI        │              │   (Optional)    │
│ • CoinGecko     │              │ • Firebase      │
│ • Alpha Vantage │              │   (Notifications)│
│ • NewsAPI       │              │                 │
└─────────────────┘              └─────────────────┘
```

---

## 🔧 Component Architecture

### 1. **Frontend Layer (React Native)**

#### Screens
- **Dashboard Screen:** Main overview with widgets
- **Mood Screen:** Mood logging and analysis
- **Tasks Screen:** Task management and scheduling
- **Learning Screen:** Coding challenges and vocabulary
- **Finance Screen:** Portfolio and market data
- **Entertainment Screen:** Media and relaxation content
- **Community Screen:** Volunteer tracking
- **Chat Screen:** AI companion interface
- **Settings Screen:** Configuration and preferences

#### Navigation Structure
```
App Navigator (Stack)
├── Auth Navigator (if needed)
│   ├── Login
│   └── Onboarding
└── Main Navigator (Tabs)
    ├── Dashboard (Home)
    ├── Tasks
    ├── Mood
    ├── Learning
    └── More (Stack)
        ├── Finance
        ├── Entertainment
        ├── Community
        ├── AI Chat
        └── Settings
```

#### Reusable Components
- **MoodSelector:** Emoji-based mood input
- **TaskCard:** Individual task display
- **ProgressBar:** Visual progress indicator
- **ChartWidget:** Data visualization
- **NotificationBanner:** In-app alerts
- **AIMessageBubble:** Chat interface
- **HabitStreak:** Streak counter display
- **FinanceCard:** Portfolio summary

---

### 2. **State Management**

#### Context Providers
```typescript
<AppProvider>
  <AuthContext>
  <MoodContext>
  <TaskContext>
  <LearningContext>
  <FinanceContext>
  <SettingsContext>
  <AIContext>
</AppProvider>
```

#### State Flow
```
User Action → Dispatch Action → Service Layer → 
Database Update → State Update → UI Re-render
```

#### Local Storage Strategy
- **AsyncStorage:** User preferences, settings
- **SQLite:** Structured data (tasks, moods, habits)
- **File System:** Media cache, AI embeddings

---

### 3. **Business Logic Layer**

#### Service Architecture

**MoodService**
```typescript
class MoodService {
  async logMood(mood: MoodEntry): Promise<void>
  async getMoodHistory(days: number): Promise<MoodEntry[]>
  async analyzeMoodPatterns(): Promise<MoodInsights>
  async getMoodPrediction(): Promise<MoodPrediction>
}
```

**TaskService**
```typescript
class TaskService {
  async createTask(task: Task): Promise<Task>
  async updateTask(id: string, updates: Partial<Task>): Promise<void>
  async deleteTask(id: string): Promise<void>
  async getTasks(filter: TaskFilter): Promise<Task[]>
  async suggestTasksForMood(mood: Mood): Promise<Task[]>
}
```

**AIService**
```typescript
class AIService {
  async chat(message: string, context: Context): Promise<string>
  async analyzeMood(moodData: MoodData): Promise<MoodInsights>
  async generateMotivation(userState: UserState): Promise<string>
  async suggestLearning(skillLevel: SkillLevel): Promise<Challenge>
}
```

**FinanceService**
```typescript
class FinanceService {
  async getPortfolioValue(): Promise<number>
  async fetchMarketData(symbols: string[]): Promise<MarketData[]>
  async checkEmotionalTrading(mood: Mood): Promise<Alert | null>
  async logTransaction(transaction: Transaction): Promise<void>
}
```

---

### 4. **Data Access Layer (DAL)**

#### Database Schema (SQLite)

**Tables:**

```sql
-- Users (for future multi-user support)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Mood Entries
CREATE TABLE mood_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  mood_type TEXT NOT NULL,
  intensity INTEGER,
  note TEXT,
  triggers TEXT, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT,
  status TEXT,
  category TEXT,
  due_date DATETIME,
  completed_at DATETIME,
  mood_tag TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Habits
CREATE TABLE habits (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  frequency TEXT,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Habit Completions
CREATE TABLE habit_completions (
  id TEXT PRIMARY KEY,
  habit_id TEXT,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (habit_id) REFERENCES habits(id)
);

-- Learning Progress
CREATE TABLE learning_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  challenge_id TEXT,
  challenge_type TEXT,
  difficulty TEXT,
  completed BOOLEAN,
  time_spent INTEGER,
  hints_used INTEGER,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Finance Transactions
CREATE TABLE finance_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  asset_type TEXT,
  symbol TEXT,
  amount REAL,
  price REAL,
  transaction_type TEXT,
  mood_at_transaction TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Portfolio Holdings
CREATE TABLE portfolio_holdings (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  asset_type TEXT,
  symbol TEXT,
  quantity REAL,
  average_cost REAL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Volunteer Sessions
CREATE TABLE volunteer_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  project_name TEXT,
  hours REAL,
  description TEXT,
  skills_used TEXT, -- JSON array
  session_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- AI Conversations
CREATE TABLE ai_conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  message TEXT,
  response TEXT,
  context TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Settings
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  key TEXT NOT NULL,
  value TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Database Encryption
- **Library:** SQLCipher for React Native
- **Key Management:** Secure storage using Expo SecureStore
- **Encryption:** AES-256 encryption for all data at rest

---

## 🔌 External API Integration

### AI Services

#### Gemini API
```typescript
interface GeminiConfig {
  apiKey: string;
  model: 'gemini-pro' | 'gemini-pro-vision';
  temperature: number;
  maxTokens: number;
}

// Usage
const response = await gemini.generateContent({
  prompt: userMessage,
  context: conversationHistory,
  systemPrompt: personalizedInstructions
});
```

#### OpenAI API (Alternative)
```typescript
interface OpenAIConfig {
  apiKey: string;
  model: 'gpt-3.5-turbo' | 'gpt-4';
  temperature: number;
  maxTokens: number;
}
```

### Finance APIs

#### CoinGecko (Crypto)
```typescript
// Free tier: 50 calls/minute
const cryptoPrice = await fetch(
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
);
```

#### Alpha Vantage (Stocks)
```typescript
// Free tier: 5 calls/minute, 500/day
const stockData = await fetch(
  `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${API_KEY}`
);
```

### News API
```typescript
// Free tier: 100 requests/day
const news = await fetch(
  `https://newsapi.org/v2/everything?q=technology&apiKey=${API_KEY}`
);
```

---

## ☁️ Cloud Services (Optional)

### Supabase Integration

#### Purpose
- Cross-device synchronization
- Encrypted backup
- Real-time updates (future feature)

#### Configuration
```typescript
const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
```

#### Sync Strategy
```
Local DB (Primary) ↔ Sync Service ↔ Supabase (Backup)
```

- **Conflict Resolution:** Last-write-wins with timestamp
- **Sync Frequency:** On app launch, background every 30 min
- **Offline Support:** Queue changes, sync when online

### Firebase (Notifications)

#### Push Notifications
```typescript
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});
```

---

## 🔄 Data Flow Diagrams

### Mood Logging Flow
```
User Input (Mood + Note)
    ↓
MoodService.logMood()
    ↓
SQLite Insert
    ↓
Update MoodContext
    ↓
Trigger AI Analysis (async)
    ↓
Gemini API Call
    ↓
Store Insights
    ↓
Update Dashboard
    ↓
Send Notification (if needed)
```

### Task Recommendation Flow
```
User Opens Tasks Screen
    ↓
TaskService.getTasks()
    ↓
Fetch Current Mood
    ↓
AIService.suggestTasksForMood()
    ↓
Gemini API (with mood context)
    ↓
Filter & Prioritize Tasks
    ↓
Display Recommended Tasks
    ↓
User Selects Task
    ↓
Update Task Status
    ↓
Log Completion
    ↓
Update Streaks/Habits
```

### Finance Alert Flow
```
User Opens Finance Screen
    ↓
FinanceService.getPortfolioValue()
    ↓
Fetch Current Mood
    ↓
Check Access Frequency
    ↓
If Excessive + Negative Mood:
    ↓
Trigger Emotional Trading Alert
    ↓
Display Warning Message
    ↓
Suggest Cooling-Off Period
    ↓
Log Decision (if trade proceeds)
```

---

## 🔐 Security Architecture

### Data Protection Layers

1. **Device Level**
   - Encrypted SQLite database
   - Secure key storage (Expo SecureStore)
   - Biometric authentication (optional)

2. **Network Level**
   - HTTPS for all API calls
   - API key encryption
   - Certificate pinning (production)

3. **Application Level**
   - Input validation and sanitization
   - SQL injection prevention (parameterized queries)
   - XSS protection

4. **Privacy Level**
   - Local-first data processing
   - Minimal cloud dependency
   - User-controlled sync
   - No third-party analytics (optional)

---

## 📱 Offline-First Strategy

### Capabilities Without Internet

✅ **Full Functionality:**
- Mood logging
- Task management
- Habit tracking
- Viewing historical data
- Dashboard access

⚠️ **Limited Functionality:**
- AI chat (cached responses only)
- Learning challenges (pre-downloaded)
- Finance data (last cached values)

❌ **Requires Internet:**
- Real-time market prices
- AI-generated insights
- Cloud sync
- News feed

### Sync Queue
```typescript
interface SyncQueue {
  pendingMoods: MoodEntry[];
  pendingTasks: Task[];
  pendingTransactions: Transaction[];
}

// On reconnection
async function processSyncQueue() {
  const queue = await getSyncQueue();
  for (const item of queue) {
    await syncToCloud(item);
    await markAsSynced(item.id);
  }
}
```

---

## 🚀 Performance Optimization

### Strategies

1. **Lazy Loading**
   - Load screens on-demand
   - Paginate large data sets
   - Defer non-critical API calls

2. **Caching**
   - Cache API responses (TTL: 5-30 min)
   - Memoize expensive calculations
   - Pre-load frequently accessed data

3. **Database Optimization**
   - Indexed columns for fast queries
   - Batch inserts for multiple records
   - Connection pooling

4. **UI Optimization**
   - Virtual lists for long scrolls
   - Image optimization and lazy loading
   - Debounced search inputs

---

## 📊 Monitoring & Analytics (Optional)

### Performance Metrics
- App launch time
- Screen render time
- API response time
- Database query time

### Usage Metrics (Privacy-Preserving)
- Feature usage frequency
- Crash reports
- Error logs (local only)

---

## 🔮 Future Architecture Enhancements

### Phase 2
- **Web App:** React web version with shared codebase
- **Desktop App:** Electron wrapper
- **Real-Time Sync:** WebSocket-based live updates

### Phase 3
- **Microservices:** Separate AI, Finance, Learning services
- **GraphQL API:** Flexible data querying
- **Edge Computing:** Faster AI responses

### Phase 4
- **Federated Learning:** Improve AI without sharing data
- **Blockchain:** Decentralized data ownership
- **Voice Interface:** Hands-free interaction

---

**Echo's architecture prioritizes privacy, performance, and user control while maintaining flexibility for future enhancements.**
