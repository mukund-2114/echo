# API Schemas & Data Models

## 📋 Complete Data Structure Reference

This document defines all data models, JSON schemas, and API structures used throughout Echo.

---

## 🎭 Mood Module

### MoodEntry

```typescript
interface MoodEntry {
  id: string;                    // UUID
  userId: string;                // User reference
  moodType: MoodType;            // Enum: great, neutral, low, stressed, tired
  intensity: number;             // 1-10 scale
  note?: string;                 // Optional journal entry
  triggers?: string[];           // Array of trigger tags
  timestamp: Date;               // When mood was logged
  createdAt: Date;               // Record creation time
}

enum MoodType {
  GREAT = 'great',
  NEUTRAL = 'neutral',
  LOW = 'low',
  STRESSED = 'stressed',
  TIRED = 'tired'
}
```

**Example JSON:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user_123",
  "moodType": "neutral",
  "intensity": 6,
  "note": "Feeling okay after morning coffee. Work shift ahead.",
  "triggers": ["work", "sleep_quality"],
  "timestamp": "2025-11-03T09:00:00.000Z",
  "createdAt": "2025-11-03T09:00:05.123Z"
}
```

---

### MoodAnalysis

```typescript
interface MoodAnalysis {
  id: string;
  userId: string;
  analysisDate: Date;
  patterns: MoodPattern[];
  insights: string[];
  recommendations: string[];
  energyPrediction: EnergyPrediction;
  triggers: TriggerAnalysis[];
}

interface MoodPattern {
  type: 'daily' | 'weekly' | 'activity_based';
  description: string;
  confidence: number;          // 0-1
  frequency: number;           // How often pattern occurs
}

interface EnergyPrediction {
  currentEnergy: number;       // 1-10
  peakEnergy: number;          // 1-10
  peakTime: string;            // HH:mm format
  trajectory: 'improving' | 'stable' | 'declining';
  confidence: number;          // 0-1
}

interface TriggerAnalysis {
  trigger: string;
  impact: 'positive' | 'negative' | 'neutral';
  frequency: number;
  averageMoodChange: number;   // -10 to +10
}
```

**Example JSON:**
```json
{
  "id": "analysis_456",
  "userId": "user_123",
  "analysisDate": "2025-11-03T10:00:00.000Z",
  "patterns": [
    {
      "type": "daily",
      "description": "Mood improves after 2 PM consistently",
      "confidence": 0.85,
      "frequency": 0.9
    }
  ],
  "insights": [
    "You're most productive in the afternoon",
    "Coding challenges consistently boost your mood"
  ],
  "recommendations": [
    "Schedule important tasks after 2 PM",
    "Start day with light activities"
  ],
  "energyPrediction": {
    "currentEnergy": 6,
    "peakEnergy": 8,
    "peakTime": "14:00",
    "trajectory": "improving",
    "confidence": 0.78
  },
  "triggers": [
    {
      "trigger": "coding",
      "impact": "positive",
      "frequency": 15,
      "averageMoodChange": 1.5
    }
  ]
}
```

---

## 📅 Task Module

### Task

```typescript
interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate?: Date;
  startTime?: Date;
  estimatedDuration?: number;  // minutes
  energyRequired?: number;     // 1-10
  moodTag?: MoodType;          // Mood when created
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  habitId?: string;            // If related to habit
  subtasks?: Subtask[];
  tags?: string[];
}

enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

enum TaskCategory {
  WORK = 'work',
  LEARNING = 'learning',
  PERSONAL = 'personal',
  FINANCE = 'finance',
  COMMUNITY = 'community',
  HEALTH = 'health'
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}
```

**Example JSON:**
```json
{
  "id": "task_789",
  "userId": "user_123",
  "title": "Complete React Native module",
  "description": "Finish the navigation section of the course",
  "priority": "high",
  "status": "in_progress",
  "category": "learning",
  "dueDate": "2025-11-05T23:59:59.000Z",
  "startTime": "2025-11-03T14:00:00.000Z",
  "estimatedDuration": 90,
  "energyRequired": 7,
  "moodTag": "neutral",
  "createdAt": "2025-11-02T10:00:00.000Z",
  "updatedAt": "2025-11-03T09:00:00.000Z",
  "subtasks": [
    {
      "id": "sub_1",
      "title": "Watch video lectures",
      "completed": true
    },
    {
      "id": "sub_2",
      "title": "Complete exercises",
      "completed": false
    }
  ],
  "tags": ["react-native", "mobile-dev"]
}
```

---

### ScheduleBlock

```typescript
interface ScheduleBlock {
  id: string;
  userId: string;
  type: BlockType;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number;            // minutes
  priority: Priority;
  flexibility: Flexibility;
  energyRequired: number;      // 1-10
  location?: string;
  relatedTaskId?: string;
  notes?: string;
}

enum BlockType {
  WORK = 'work',
  TRAVEL = 'travel',
  TASK = 'task',
  LEARNING = 'learning',
  BREAK = 'break',
  SLEEP = 'sleep',
  ENTERTAINMENT = 'entertainment',
  MEAL = 'meal'
}

enum Flexibility {
  FIXED = 'fixed',           // Cannot be moved
  FLEXIBLE = 'flexible',     // Can be rescheduled
  OPTIONAL = 'optional'      // Can be skipped
}
```

**Example JSON:**
```json
{
  "id": "block_101",
  "userId": "user_123",
  "type": "work",
  "title": "Subway shift",
  "startTime": "2025-11-03T09:00:00.000Z",
  "endTime": "2025-11-03T17:00:00.000Z",
  "duration": 480,
  "priority": "high",
  "flexibility": "fixed",
  "energyRequired": 6,
  "location": "Subway Restaurant",
  "notes": "Busy lunch shift expected"
}
```

---

## 💪 Habit Module

### Habit

```typescript
interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  targetDays?: number[];       // Days of week (0-6, 0=Sunday)
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  reminderTime?: string;       // HH:mm format
  reminderEnabled: boolean;
  category: TaskCategory;
  createdAt: Date;
  isActive: boolean;
}

enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom'
}
```

**Example JSON:**
```json
{
  "id": "habit_202",
  "userId": "user_123",
  "name": "Daily coding challenge",
  "description": "Complete at least one coding problem",
  "frequency": "daily",
  "currentStreak": 7,
  "longestStreak": 15,
  "totalCompletions": 42,
  "reminderTime": "19:00",
  "reminderEnabled": true,
  "category": "learning",
  "createdAt": "2025-10-01T00:00:00.000Z",
  "isActive": true
}
```

---

### HabitCompletion

```typescript
interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date;
  mood?: MoodType;
  note?: string;
}
```

**Example JSON:**
```json
{
  "id": "completion_303",
  "habitId": "habit_202",
  "userId": "user_123",
  "completedAt": "2025-11-03T19:30:00.000Z",
  "mood": "great",
  "note": "Solved a hard problem today!"
}
```

---

## 📚 Learning Module

### CodingChallenge

```typescript
interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: ChallengeCategory;
  starterCode?: string;
  solution?: string;
  hints: Hint[];
  testCases: TestCase[];
  timeEstimate: number;        // minutes
  tags: string[];
}

enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

enum ChallengeCategory {
  ARRAYS = 'arrays',
  STRINGS = 'strings',
  ALGORITHMS = 'algorithms',
  DATA_STRUCTURES = 'data_structures',
  DYNAMIC_PROGRAMMING = 'dynamic_programming'
}

interface Hint {
  level: number;               // 1-3 (subtle to explicit)
  text: string;
}

interface TestCase {
  input: any;
  expectedOutput: any;
  description?: string;
}
```

**Example JSON:**
```json
{
  "id": "challenge_404",
  "title": "Two Sum",
  "description": "Given an array of integers and a target, return indices of two numbers that add up to target.",
  "difficulty": "easy",
  "category": "arrays",
  "starterCode": "function twoSum(nums, target) {\n  // Your code here\n}",
  "hints": [
    {
      "level": 1,
      "text": "Think about using a data structure to store values you've seen"
    },
    {
      "level": 2,
      "text": "A hash map can help you look up complements in O(1) time"
    },
    {
      "level": 3,
      "text": "For each number, check if (target - number) exists in your map"
    }
  ],
  "testCases": [
    {
      "input": { "nums": [2, 7, 11, 15], "target": 9 },
      "expectedOutput": [0, 1],
      "description": "Basic case"
    }
  ],
  "timeEstimate": 15,
  "tags": ["hash-map", "arrays", "beginner"]
}
```

---

### LearningProgress

```typescript
interface LearningProgress {
  id: string;
  userId: string;
  challengeId: string;
  challengeType: 'coding' | 'vocabulary' | 'quiz';
  difficulty: Difficulty;
  completed: boolean;
  timeSpent: number;           // seconds
  hintsUsed: number;
  attempts: number;
  score?: number;              // 0-100
  completedAt?: Date;
  createdAt: Date;
}
```

**Example JSON:**
```json
{
  "id": "progress_505",
  "userId": "user_123",
  "challengeId": "challenge_404",
  "challengeType": "coding",
  "difficulty": "easy",
  "completed": true,
  "timeSpent": 900,
  "hintsUsed": 1,
  "attempts": 2,
  "score": 85,
  "completedAt": "2025-11-03T20:00:00.000Z",
  "createdAt": "2025-11-03T19:45:00.000Z"
}
```

---

### VocabularyWord

```typescript
interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  examples: string[];
  synonyms?: string[];
  pronunciation?: string;
  difficulty: Difficulty;
}
```

**Example JSON:**
```json
{
  "id": "vocab_606",
  "word": "ephemeral",
  "definition": "Lasting for a very short time",
  "partOfSpeech": "adjective",
  "examples": [
    "The ephemeral beauty of cherry blossoms",
    "Social media posts are often ephemeral"
  ],
  "synonyms": ["fleeting", "transient", "temporary"],
  "pronunciation": "ih-FEM-er-uhl",
  "difficulty": "medium"
}
```

---

## 💰 Finance Module

### Asset

```typescript
interface Asset {
  id: string;
  type: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice?: number;
  lastUpdated?: Date;
}

enum AssetType {
  STOCK = 'stock',
  CRYPTO = 'crypto',
  ETF = 'etf'
}
```

**Example JSON:**
```json
{
  "id": "asset_707",
  "type": "crypto",
  "symbol": "BTC",
  "name": "Bitcoin",
  "quantity": 0.05,
  "averageCost": 32000,
  "currentPrice": 34500,
  "lastUpdated": "2025-11-03T10:00:00.000Z"
}
```

---

### Transaction

```typescript
interface Transaction {
  id: string;
  userId: string;
  assetId: string;
  type: TransactionType;
  quantity: number;
  price: number;
  totalAmount: number;
  fees?: number;
  moodAtTransaction?: MoodType;
  notes?: string;
  timestamp: Date;
}

enum TransactionType {
  BUY = 'buy',
  SELL = 'sell'
}
```

**Example JSON:**
```json
{
  "id": "tx_808",
  "userId": "user_123",
  "assetId": "asset_707",
  "type": "buy",
  "quantity": 0.01,
  "price": 34000,
  "totalAmount": 340,
  "fees": 1.70,
  "moodAtTransaction": "neutral",
  "notes": "Dollar-cost averaging purchase",
  "timestamp": "2025-11-03T10:30:00.000Z"
}
```

---

### Portfolio

```typescript
interface Portfolio {
  id: string;
  userId: string;
  assets: Asset[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  assetAllocation: {
    stocks: number;
    crypto: number;
    cash: number;
  };
  lastUpdated: Date;
}
```

**Example JSON:**
```json
{
  "id": "portfolio_909",
  "userId": "user_123",
  "assets": [
    {
      "id": "asset_707",
      "type": "crypto",
      "symbol": "BTC",
      "name": "Bitcoin",
      "quantity": 0.05,
      "averageCost": 32000,
      "currentPrice": 34500
    }
  ],
  "totalValue": 1725,
  "totalCost": 1600,
  "totalGainLoss": 125,
  "totalGainLossPercent": 7.81,
  "assetAllocation": {
    "stocks": 0,
    "crypto": 100,
    "cash": 0
  },
  "lastUpdated": "2025-11-03T10:00:00.000Z"
}
```

---

## 🤝 Community Module

### VolunteerSession

```typescript
interface VolunteerSession {
  id: string;
  userId: string;
  projectName: string;
  organization: string;
  hours: number;
  description: string;
  skillsUsed: string[];
  impact?: string;
  sessionDate: Date;
  createdAt: Date;
}
```

**Example JSON:**
```json
{
  "id": "volunteer_1010",
  "userId": "user_123",
  "projectName": "Website Redesign",
  "organization": "Community of Guardians",
  "hours": 4,
  "description": "Implemented responsive navigation and improved accessibility",
  "skillsUsed": ["React", "CSS", "Accessibility"],
  "impact": "Improved site usability for 500+ users",
  "sessionDate": "2025-11-02T00:00:00.000Z",
  "createdAt": "2025-11-03T09:00:00.000Z"
}
```

---

## 🤖 AI Module

### AIConversation

```typescript
interface AIConversation {
  id: string;
  userId: string;
  message: string;
  response: string;
  context: ConversationContext;
  timestamp: Date;
}

interface ConversationContext {
  currentMood?: MoodType;
  recentTasks?: string[];
  activeHabits?: string[];
  userIntent?: string;
}
```

**Example JSON:**
```json
{
  "id": "conv_1111",
  "userId": "user_123",
  "message": "I'm feeling overwhelmed with my tasks today",
  "response": "I understand feeling overwhelmed can be tough. Looking at your schedule, you have 5 tasks planned. Since you're feeling this way, let's focus on just the top 2 priorities. Would you like me to suggest which ones?",
  "context": {
    "currentMood": "stressed",
    "recentTasks": ["Complete React module", "Job application", "Coding challenge"],
    "activeHabits": ["Daily coding", "Meditation"],
    "userIntent": "seeking_support"
  },
  "timestamp": "2025-11-03T11:00:00.000Z"
}
```

---

## 🔔 Notification Module

### Notification

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduledTime: Date;
  sentAt?: Date;
  readAt?: Date;
  priority: Priority;
  sound?: string;
  vibration?: number[];
}

enum NotificationType {
  TASK_REMINDER = 'task_reminder',
  TASK_DUE_SOON = 'task_due_soon',
  MOOD_CHECK = 'mood_check',
  BREAK_REMINDER = 'break_reminder',
  MOTIVATION = 'motivation',
  HABIT_REMINDER = 'habit_reminder',
  LEARNING_PROMPT = 'learning_prompt',
  ACHIEVEMENT = 'achievement',
  EMOTIONAL_TRADING_ALERT = 'emotional_trading_alert'
}
```

**Example JSON:**
```json
{
  "id": "notif_1212",
  "userId": "user_123",
  "type": "habit_reminder",
  "title": "🔥 Keep your streak alive!",
  "body": "Don't forget your daily coding challenge",
  "data": {
    "habitId": "habit_202",
    "currentStreak": 7
  },
  "scheduledTime": "2025-11-03T19:00:00.000Z",
  "priority": "normal",
  "sound": "default"
}
```

---

## 📊 Analytics Module

### DailyInsight

```typescript
interface DailyInsight {
  id: string;
  userId: string;
  date: Date;
  summary: string;
  moodAverage: number;
  tasksCompleted: number;
  tasksTotal: number;
  learningTime: number;        // minutes
  habitsCompleted: number;
  achievements: string[];
  patterns: string[];
  suggestions: string[];
}
```

**Example JSON:**
```json
{
  "id": "insight_1313",
  "userId": "user_123",
  "date": "2025-11-03T00:00:00.000Z",
  "summary": "Productive day with steady mood improvement",
  "moodAverage": 7.2,
  "tasksCompleted": 4,
  "tasksTotal": 5,
  "learningTime": 60,
  "habitsCompleted": 2,
  "achievements": [
    "Maintained 7-day coding streak",
    "Completed all high-priority tasks"
  ],
  "patterns": [
    "Most productive between 2-5 PM",
    "Coding boosts mood consistently"
  ],
  "suggestions": [
    "Schedule important work in afternoon",
    "Consider adding meditation habit"
  ]
}
```

---

**These schemas provide a complete reference for all data structures in Echo—ensuring consistency across the application and clear API contracts.**
