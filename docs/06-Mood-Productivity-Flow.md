# Mood & Productivity Flowchart

## 🎭 The Mood-Productivity Connection

Echo's core innovation is recognizing that **productivity is not constant**—it fluctuates with emotional state, energy levels, and external circumstances. This document details how mood influences every aspect of the app.

---

## 📊 Mood-Driven System Flow

### High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER WAKES UP                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              MORNING MOOD CHECK                         │
│  "How are you feeling today?"                           │
│  😊 Great  😐 Okay  😔 Low  😤 Stressed  😴 Tired      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              AI MOOD ANALYSIS                           │
│  • Analyze mood selection                               │
│  • Compare with historical patterns                     │
│  • Identify potential triggers                          │
│  • Predict energy trajectory                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         PERSONALIZED ACTION PLAN                        │
│  Based on mood, generate:                               │
│  • Task recommendations                                 │
│  • Learning difficulty adjustment                       │
│  • Notification frequency                               │
│  • Entertainment suggestions                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         ADAPTIVE DAILY SCHEDULE                         │
│  • High-priority tasks during peak energy               │
│  • Light tasks during low energy                        │
│  • Breaks and entertainment integrated                  │
│  • Flexibility for mood changes                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         CONTINUOUS MONITORING                           │
│  Throughout day:                                        │
│  • Track task completion                                │
│  • Monitor mood changes                                 │
│  • Adjust recommendations                               │
│  • Provide motivational nudges                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         EVENING REFLECTION                              │
│  • Review day's achievements                            │
│  • Update mood if changed                               │
│  • Log insights and patterns                            │
│  • Prepare for next day                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         FEEDBACK LOOP                                   │
│  • AI learns from day's data                            │
│  • Refine predictions                                   │
│  • Improve recommendations                              │
│  • Personalize further                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Mood-Based Decision Matrix

### Task Recommendations by Mood

| Mood State | Energy Level | Recommended Tasks | Avoid |
|------------|--------------|-------------------|-------|
| **😊 Great** | High (8-10) | • Complex coding challenges<br>• Job applications<br>• Learning new concepts<br>• Important decisions | • Mindless tasks<br>• Excessive breaks |
| **😐 Neutral** | Medium (5-7) | • Routine tasks<br>• Code reviews<br>• Moderate learning<br>• Planning | • High-stakes decisions<br>• Overwhelming projects |
| **😔 Low** | Low (2-4) | • Simple tasks<br>• Entertainment<br>• Light reading<br>• Reflection | • Complex problems<br>• Important emails<br>• Financial decisions |
| **😤 Stressed** | Variable | • Physical activity<br>• Meditation<br>• Easy wins<br>• Organizing | • Challenging tasks<br>• Multitasking<br>• New learning |
| **😴 Tired** | Very Low (1-3) | • Rest<br>• Passive learning<br>• Entertainment<br>• Early sleep | • Any demanding work<br>• Decision-making |

---

## 🔄 Detailed Mood Processing Flow

### Step 1: Mood Input

```typescript
interface MoodInput {
  moodType: 'great' | 'neutral' | 'low' | 'stressed' | 'tired';
  intensity: number; // 1-10
  note?: string;
  triggers?: string[];
  timestamp: Date;
}

async function logMood(input: MoodInput) {
  // Store in database
  await db.moods.insert(input);
  
  // Trigger AI analysis
  const analysis = await analyzeMood(input);
  
  // Update app state
  updateAppState(analysis);
  
  // Generate recommendations
  const recommendations = await generateRecommendations(analysis);
  
  return { analysis, recommendations };
}
```

---

### Step 2: AI Mood Analyzer

```typescript
async function analyzeMood(currentMood: MoodInput) {
  // Fetch historical data
  const history = await db.moods.getRecent(30); // Last 30 days
  
  // Identify patterns
  const patterns = identifyPatterns(history, currentMood);
  
  // Predict energy trajectory
  const energyPrediction = predictEnergy(currentMood, patterns);
  
  // Detect triggers
  const triggers = detectTriggers(history, currentMood);
  
  // Generate insights
  const insights = await gemini.generateInsights({
    currentMood,
    patterns,
    energyPrediction,
    triggers
  });
  
  return {
    currentState: currentMood,
    patterns,
    energyPrediction,
    triggers,
    insights
  };
}
```

**Example Analysis Output:**
```json
{
  "currentState": {
    "moodType": "neutral",
    "intensity": 6,
    "timestamp": "2025-11-03T09:00:00Z"
  },
  "patterns": [
    "Mood typically improves after 2 PM",
    "Lower energy on Mondays",
    "Coding boosts mood by average 1.5 points"
  ],
  "energyPrediction": {
    "current": 6,
    "peak": 8,
    "peakTime": "14:00",
    "trajectory": "improving"
  },
  "triggers": [
    "Work shift yesterday (negative)",
    "Completed coding challenge (positive)"
  ],
  "insights": [
    "Schedule important tasks after 2 PM",
    "Consider light morning activities",
    "Coding challenge could boost current mood"
  ]
}
```

---

### Step 3: Personalized Action Plan

```typescript
async function generateRecommendations(analysis: MoodAnalysis) {
  const { currentState, energyPrediction, patterns } = analysis;
  
  // Get pending tasks
  const tasks = await db.tasks.getPending();
  
  // Filter and prioritize based on mood
  const recommendedTasks = tasks
    .filter(task => matchesMoodState(task, currentState))
    .sort((a, b) => priorityScore(a, currentState) - priorityScore(b, currentState))
    .slice(0, 5);
  
  // Adjust learning difficulty
  const learningDifficulty = calculateDifficulty(currentState, energyPrediction);
  
  // Determine notification frequency
  const notificationFrequency = calculateNotificationFrequency(currentState);
  
  // Suggest entertainment if needed
  const entertainmentSuggestion = shouldSuggestEntertainment(currentState);
  
  return {
    tasks: recommendedTasks,
    learningDifficulty,
    notificationFrequency,
    entertainmentSuggestion,
    motivationalMessage: generateMotivation(currentState)
  };
}
```

**Example Recommendations:**
```json
{
  "tasks": [
    {
      "id": "task_1",
      "title": "Review React documentation",
      "reason": "Light task suitable for current energy",
      "estimatedTime": 20,
      "priority": "medium"
    },
    {
      "id": "task_2",
      "title": "Organize project files",
      "reason": "Easy win to build momentum",
      "estimatedTime": 15,
      "priority": "low"
    }
  ],
  "learningDifficulty": "medium",
  "notificationFrequency": "normal",
  "entertainmentSuggestion": {
    "suggested": false,
    "reason": "Energy sufficient for productive work"
  },
  "motivationalMessage": "You're doing well! Your energy typically peaks around 2 PM—save challenging tasks for then."
}
```

---

### Step 4: Adjusted Schedule

```typescript
interface ScheduleBlock {
  time: string;
  activity: string;
  type: 'work' | 'learning' | 'break' | 'entertainment';
  difficulty: 'easy' | 'medium' | 'hard';
}

function generateAdaptiveSchedule(
  mood: MoodState,
  energyPrediction: EnergyPrediction,
  tasks: Task[]
): ScheduleBlock[] {
  const schedule: ScheduleBlock[] = [];
  
  // Morning (low energy predicted)
  if (energyPrediction.current < 6) {
    schedule.push({
      time: '09:00',
      activity: 'Light task or planning',
      type: 'work',
      difficulty: 'easy'
    });
  }
  
  // Afternoon (peak energy)
  if (energyPrediction.peak > 7) {
    schedule.push({
      time: energyPrediction.peakTime,
      activity: 'Most important task',
      type: 'work',
      difficulty: 'hard'
    });
  }
  
  // Evening (declining energy)
  schedule.push({
    time: '18:00',
    activity: 'Learning or entertainment',
    type: 'learning',
    difficulty: 'medium'
  });
  
  // Add breaks based on mood
  if (mood.moodType === 'stressed') {
    schedule.splice(1, 0, {
      time: '10:30',
      activity: 'Relaxation break',
      type: 'break',
      difficulty: 'easy'
    });
  }
  
  return schedule;
}
```

---

### Step 5: Continuous Monitoring

```typescript
class MoodMonitor {
  private checkInterval = 2 * 60 * 60 * 1000; // 2 hours
  
  startMonitoring() {
    setInterval(async () => {
      await this.checkMoodChange();
    }, this.checkInterval);
  }
  
  async checkMoodChange() {
    // Detect mood change indicators
    const indicators = {
      taskCompletionRate: await this.getCompletionRate(),
      appUsagePattern: await this.getUsagePattern(),
      timeOfDay: new Date().getHours()
    };
    
    // Predict if mood has changed
    const moodChangePrediction = await this.predictMoodChange(indicators);
    
    if (moodChangePrediction.confidence > 0.7) {
      // Prompt user for mood update
      await this.promptMoodCheck(moodChangePrediction.suggestedMood);
    }
  }
  
  async promptMoodCheck(suggestedMood: MoodType) {
    const notification = {
      title: 'Quick mood check',
      body: `Are you feeling ${suggestedMood}?`,
      data: { type: 'mood_check', suggestedMood }
    };
    
    await sendNotification(notification);
  }
}
```

---

## 🔔 Mood-Aware Notifications

### Notification Strategy by Mood

```typescript
function getNotificationStrategy(mood: MoodState): NotificationStrategy {
  switch (mood.moodType) {
    case 'great':
      return {
        frequency: 'normal',
        tone: 'encouraging',
        types: ['tasks', 'challenges', 'achievements'],
        timing: 'anytime'
      };
      
    case 'neutral':
      return {
        frequency: 'normal',
        tone: 'supportive',
        types: ['tasks', 'reminders', 'suggestions'],
        timing: 'standard_hours'
      };
      
    case 'low':
      return {
        frequency: 'reduced',
        tone: 'gentle',
        types: ['encouragement', 'easy_wins'],
        timing: 'non_intrusive'
      };
      
    case 'stressed':
      return {
        frequency: 'minimal',
        tone: 'calming',
        types: ['breaks', 'relaxation'],
        timing: 'only_important'
      };
      
    case 'tired':
      return {
        frequency: 'minimal',
        tone: 'understanding',
        types: ['rest_reminder'],
        timing: 'evening_only'
      };
  }
}
```

### Example Notifications

**Great Mood:**
> 🎉 You're on fire! Ready for today's coding challenge?

**Neutral Mood:**
> 📝 You have 3 tasks scheduled for today. Start with the easiest?

**Low Mood:**
> 💙 Take it easy today. How about a 10-minute break?

**Stressed Mood:**
> 🧘 Feeling overwhelmed? Try a 5-minute meditation.

**Tired Mood:**
> 😴 You seem tired. Consider resting—tomorrow is a new day.

---

## 📈 Mood Impact on Features

### Learning Module

```typescript
function adjustLearningContent(mood: MoodState) {
  if (mood.moodType === 'great' && mood.intensity >= 8) {
    return {
      difficulty: 'hard',
      duration: 'extended',
      type: 'challenging_problem',
      hints: 'minimal'
    };
  }
  
  if (mood.moodType === 'low' || mood.moodType === 'tired') {
    return {
      difficulty: 'easy',
      duration: 'short',
      type: 'review_or_tutorial',
      hints: 'generous'
    };
  }
  
  // Default for neutral/stressed
  return {
    difficulty: 'medium',
    duration: 'standard',
    type: 'balanced',
    hints: 'available'
  };
}
```

### Finance Module

```typescript
function checkFinanceAccess(mood: MoodState, accessCount: number) {
  // Prevent emotional trading
  if (mood.moodType === 'stressed' || mood.moodType === 'low') {
    if (accessCount > 3) {
      return {
        allowed: true,
        warning: 'You\'ve checked your portfolio frequently while stressed. Consider waiting before making decisions.',
        coolingPeriod: 30 * 60 * 1000 // 30 minutes
      };
    }
  }
  
  return { allowed: true, warning: null };
}
```

### Entertainment Module

```typescript
function suggestEntertainment(mood: MoodState) {
  const suggestions = {
    great: ['upbeat_music', 'creative_content', 'social_videos'],
    neutral: ['educational_videos', 'podcasts', 'light_reading'],
    low: ['comfort_content', 'relaxing_music', 'nature_sounds'],
    stressed: ['meditation', 'calming_music', 'breathing_exercises'],
    tired: ['sleep_sounds', 'gentle_music', 'rest_reminder']
  };
  
  return suggestions[mood.moodType];
}
```

---

## 🔁 Feedback Loop & Learning

### Daily Reflection

```typescript
async function eveningReflection() {
  const today = {
    morningMood: await db.moods.getMorning(),
    eveningMood: await db.moods.getEvening(),
    tasksCompleted: await db.tasks.getCompletedToday(),
    learningProgress: await db.learning.getTodayProgress(),
    moodChanges: await db.moods.getTodayChanges()
  };
  
  // AI analysis
  const reflection = await gemini.generateReflection(today);
  
  // Store insights
  await db.insights.insert({
    date: new Date(),
    summary: reflection.summary,
    patterns: reflection.patterns,
    suggestions: reflection.suggestions
  });
  
  // Show to user
  return reflection;
}
```

**Example Reflection:**
```json
{
  "summary": "You started the day feeling neutral but improved to 'great' by evening. Completing coding challenges boosted your mood significantly.",
  "patterns": [
    "Coding consistently improves your mood",
    "Afternoon is your most productive time",
    "Taking breaks prevents stress buildup"
  ],
  "suggestions": [
    "Schedule coding sessions when mood is low",
    "Protect your afternoon peak time for important tasks",
    "Continue taking regular breaks"
  ],
  "achievements": [
    "Completed 2 coding challenges",
    "Maintained 7-day learning streak",
    "Logged volunteer hours"
  ]
}
```

---

## 🎯 Mood-Productivity Optimization Loop

```
Mood Input → AI Analysis → Personalized Plan → Adaptive Schedule →
Task Execution → Mood Monitoring → Mood Update → Pattern Learning →
Refined Predictions → Better Recommendations → Improved Outcomes →
Mood Input (next day)
```

### Key Optimization Principles

1. **Respect Current State:** Never force productivity when energy is low
2. **Build Momentum:** Start with easy wins to boost confidence
3. **Protect Peak Times:** Reserve high-energy periods for important work
4. **Prevent Burnout:** Integrate breaks and entertainment proactively
5. **Learn Continuously:** Refine predictions based on actual outcomes
6. **Stay Flexible:** Allow schedule adjustments as mood changes
7. **Celebrate Progress:** Acknowledge achievements to maintain motivation

---

**Echo's mood-productivity system creates a virtuous cycle: better mood awareness leads to smarter task selection, which leads to more achievements, which improves mood—creating sustainable, balanced productivity.**
