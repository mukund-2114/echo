// Core Types for Echo App

// ============================================
// Mood Types
// ============================================

export enum MoodType {
  GREAT = 'great',
  NEUTRAL = 'neutral',
  LOW = 'low',
  STRESSED = 'stressed',
  TIRED = 'tired',
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodType: MoodType;
  intensity: number;        // 1-10
  note?: string;
  triggers?: string[];
  timestamp: Date;
  createdAt: Date;
}

export interface MoodAnalysis {
  id: string;
  userId: string;
  analysisDate: Date;
  patterns: MoodPattern[];
  insights: string[];
  recommendations: string[];
  energyPrediction: EnergyPrediction;
}

export interface MoodPattern {
  type: 'daily' | 'weekly' | 'activity_based';
  description: string;
  confidence: number;
  frequency: number;
}

export interface EnergyPrediction {
  currentEnergy: number;
  peakEnergy: number;
  peakTime: string;
  trajectory: 'improving' | 'stable' | 'declining';
  confidence: number;
}

// ============================================
// Task Types
// ============================================

export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskCategory {
  WORK = 'work',
  LEARNING = 'learning',
  PERSONAL = 'personal',
  FINANCE = 'finance',
  COMMUNITY = 'community',
  HEALTH = 'health',
}

export interface Task {
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
  moodTag?: MoodType;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  subtasks?: Subtask[];
  tags?: string[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

// ============================================
// Habit Types
// ============================================

export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  targetDays?: number[];       // Days of week (0-6)
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  reminderTime?: string;
  reminderEnabled: boolean;
  category: TaskCategory;
  createdAt: Date;
  isActive: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date;
  mood?: MoodType;
  note?: string;
}

// ============================================
// Finance Types
// ============================================

export enum AssetType {
  STOCK = 'stock',
  CRYPTO = 'crypto',
  ETF = 'etf',
}

export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
}

export interface Asset {
  id: string;
  type: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice?: number;
  lastUpdated?: Date;
}

export interface Transaction {
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

export interface Portfolio {
  id: string;
  userId: string;
  assets: Asset[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  lastUpdated: Date;
}

// ============================================
// Learning Types
// ============================================

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum ChallengeCategory {
  ARRAYS = 'arrays',
  STRINGS = 'strings',
  ALGORITHMS = 'algorithms',
  DATA_STRUCTURES = 'data_structures',
  DYNAMIC_PROGRAMMING = 'dynamic_programming',
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: ChallengeCategory;
  starterCode?: string;
  solution?: string;
  hints: Hint[];
  testCases: TestCase[];
  timeEstimate: number;
  tags: string[];
}

export interface Hint {
  level: number;
  text: string;
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  description?: string;
}

export interface LearningProgress {
  id: string;
  userId: string;
  challengeId: string;
  challengeType: 'coding' | 'vocabulary' | 'quiz';
  difficulty: Difficulty;
  completed: boolean;
  timeSpent: number;
  hintsUsed: number;
  attempts: number;
  score?: number;
  completedAt?: Date;
  createdAt: Date;
}

// ============================================
// AI Types
// ============================================

export interface AIConversation {
  id: string;
  userId: string;
  message: string;
  response: string;
  context: ConversationContext;
  timestamp: Date;
}

export interface ConversationContext {
  currentMood?: MoodType;
  recentTasks?: string[];
  activeHabits?: string[];
  userIntent?: string;
}

// ============================================
// Notification Types
// ============================================

export enum NotificationType {
  TASK_REMINDER = 'task_reminder',
  TASK_DUE_SOON = 'task_due_soon',
  MOOD_CHECK = 'mood_check',
  BREAK_REMINDER = 'break_reminder',
  MOTIVATION = 'motivation',
  HABIT_REMINDER = 'habit_reminder',
  LEARNING_PROMPT = 'learning_prompt',
  ACHIEVEMENT = 'achievement',
  EMOTIONAL_TRADING_ALERT = 'emotional_trading_alert',
}

export interface Notification {
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
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  name: string;
  email?: string;
  createdAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  biometricAuth: boolean;
  moodReminders: boolean;
  taskReminders: boolean;
  habitReminders: boolean;
}

// ============================================
// Utility Types
// ============================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}
