// App Configuration
export const Config = {
  // App Info
  appName: 'Echo',
  appVersion: '0.1.0',
  appDescription: 'Your Personal AI Companion',
  
  // API Configuration
  geminiApiUrl: 'https://generativelanguage.googleapis.com/v1beta',
  coinGeckoApiUrl: 'https://api.coingecko.com/api/v3',
  alphaVantageApiUrl: 'https://www.alphavantage.co/query',
  
  // Cache TTL (milliseconds)
  cacheTTL: {
    prices: 5 * 60 * 1000,        // 5 minutes
    moodAnalysis: 60 * 60 * 1000, // 1 hour
    aiResponse: 30 * 60 * 1000,   // 30 minutes
  },
  
  // API Rate Limits
  rateLimits: {
    gemini: {
      requestsPerMinute: 60,
      requestsPerDay: 1500,
    },
    coinGecko: {
      requestsPerMinute: 50,
      requestsPerMonth: 10000,
    },
    alphaVantage: {
      requestsPerMinute: 5,
      requestsPerDay: 500,
    },
  },
  
  // Feature Flags
  features: {
    moodTracking: true,
    taskManagement: true,
    aiChat: true,
    financeTracking: true,
    learningHub: true,
    habitTracking: true,
    entertainment: false,  // Phase 2
    community: false,      // Phase 2
  },
  
  // Notification Settings
  notifications: {
    moodCheckInterval: 4 * 60 * 60 * 1000, // 4 hours
    taskReminderBefore: 15 * 60 * 1000,    // 15 minutes
    habitReminderTime: '19:00',            // 7 PM
  },
  
  // Database
  database: {
    name: 'echo.db',
    version: 1,
  },
};
