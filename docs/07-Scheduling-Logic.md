# Scheduling & Notifications Logic

## ⏰ Intelligent Scheduling System

Echo's scheduling system goes beyond simple reminders—it integrates mood, energy levels, travel time, rest periods, and real-world constraints to create realistic, achievable daily plans.

---

## 🎯 Scheduling Philosophy

### Core Principles

1. **Realistic Time Estimation** - Account for travel, breaks, and buffer time
2. **Energy-Aware Placement** - Schedule tasks during optimal energy windows
3. **Flexibility First** - Allow easy rescheduling without guilt
4. **Work-Life Balance** - Enforce rest periods and prevent overcommitment
5. **Context Switching Minimization** - Group similar tasks together

---

## 📅 Schedule Components

### Time Block Structure

```typescript
interface TimeBlock {
  id: string;
  type: 'work' | 'travel' | 'task' | 'learning' | 'break' | 'sleep' | 'entertainment';
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  priority: 'high' | 'medium' | 'low';
  flexibility: 'fixed' | 'flexible' | 'optional';
  energyRequired: number; // 1-10
  location?: string;
  relatedTaskId?: string;
}
```

### Daily Schedule

```typescript
interface DailySchedule {
  date: Date;
  blocks: TimeBlock[];
  totalWorkTime: number;
  totalBreakTime: number;
  totalTravelTime: number;
  sleepSchedule: {
    bedtime: Date;
    wakeTime: Date;
    duration: number;
  };
  flexibility: number; // Percentage of flexible time
  overallLoad: 'light' | 'moderate' | 'heavy';
}
```

---

## 🧮 Scheduling Algorithm

### Step 1: Gather Constraints

```typescript
interface SchedulingConstraints {
  // Fixed commitments
  workShifts: TimeBlock[];
  volunteerSessions: TimeBlock[];
  appointments: TimeBlock[];
  
  // Personal constraints
  sleepSchedule: { bedtime: string; wakeTime: string };
  mealTimes: string[];
  exercisePreference?: string;
  
  // Preferences
  peakEnergyTime: string; // e.g., "14:00"
  preferredLearningTime: string;
  maxWorkHoursPerDay: number;
  
  // Current state
  currentMood: MoodState;
  energyLevel: number;
  availableTime: number; // minutes
}
```

### Step 2: Calculate Available Time Windows

```typescript
function calculateAvailableWindows(
  date: Date,
  constraints: SchedulingConstraints
): TimeWindow[] {
  const dayStart = new Date(date);
  dayStart.setHours(parseInt(constraints.sleepSchedule.wakeTime.split(':')[0]));
  
  const dayEnd = new Date(date);
  dayEnd.setHours(parseInt(constraints.sleepSchedule.bedtime.split(':')[0]));
  
  // Start with full day
  let windows: TimeWindow[] = [{
    start: dayStart,
    end: dayEnd
  }];
  
  // Subtract fixed commitments
  for (const commitment of constraints.workShifts) {
    windows = subtractTimeBlock(windows, commitment);
  }
  
  // Subtract travel time
  for (const commitment of constraints.workShifts) {
    const travelTime = calculateTravelTime(commitment.location);
    windows = subtractTravelBuffer(windows, commitment, travelTime);
  }
  
  // Subtract meal times (30 min each)
  for (const mealTime of constraints.mealTimes) {
    windows = subtractMealTime(windows, mealTime);
  }
  
  return windows.filter(w => w.duration >= 15); // Minimum 15-minute blocks
}
```

### Step 3: Prioritize Tasks

```typescript
function prioritizeTasks(
  tasks: Task[],
  mood: MoodState,
  energyPrediction: EnergyPrediction
): PrioritizedTask[] {
  return tasks.map(task => {
    const score = calculatePriorityScore(task, mood, energyPrediction);
    return { ...task, score };
  }).sort((a, b) => b.score - a.score);
}

function calculatePriorityScore(
  task: Task,
  mood: MoodState,
  energyPrediction: EnergyPrediction
): number {
  let score = 0;
  
  // Base priority
  score += task.priority === 'high' ? 100 : task.priority === 'medium' ? 50 : 25;
  
  // Urgency (due date)
  const daysUntilDue = getDaysUntilDue(task.dueDate);
  score += Math.max(0, 50 - daysUntilDue * 5);
  
  // Mood compatibility
  const moodMatch = getMoodTaskCompatibility(task, mood);
  score += moodMatch * 30;
  
  // Energy requirement match
  const energyMatch = getEnergyTaskCompatibility(task, energyPrediction);
  score += energyMatch * 20;
  
  // Streak maintenance (if habit-related)
  if (task.habitId && isStreakAtRisk(task.habitId)) {
    score += 40;
  }
  
  return score;
}
```

### Step 4: Assign Tasks to Time Windows

```typescript
function assignTasksToWindows(
  tasks: PrioritizedTask[],
  windows: TimeWindow[],
  energyPrediction: EnergyPrediction
): ScheduledTask[] {
  const scheduled: ScheduledTask[] = [];
  const remainingWindows = [...windows];
  
  for (const task of tasks) {
    // Find best window for this task
    const bestWindow = findBestWindow(
      task,
      remainingWindows,
      energyPrediction
    );
    
    if (!bestWindow) {
      // Can't fit this task today
      continue;
    }
    
    // Schedule task
    const scheduledTask = {
      ...task,
      startTime: bestWindow.start,
      endTime: new Date(bestWindow.start.getTime() + task.estimatedDuration * 60000)
    };
    
    scheduled.push(scheduledTask);
    
    // Update remaining windows
    remainingWindows = subtractTimeBlock(remainingWindows, scheduledTask);
  }
  
  return scheduled;
}

function findBestWindow(
  task: Task,
  windows: TimeWindow[],
  energyPrediction: EnergyPrediction
): TimeWindow | null {
  let bestWindow: TimeWindow | null = null;
  let bestScore = -Infinity;
  
  for (const window of windows) {
    if (window.duration < task.estimatedDuration) {
      continue; // Too short
    }
    
    // Calculate window score
    const score = calculateWindowScore(window, task, energyPrediction);
    
    if (score > bestScore) {
      bestScore = score;
      bestWindow = window;
    }
  }
  
  return bestWindow;
}

function calculateWindowScore(
  window: TimeWindow,
  task: Task,
  energyPrediction: EnergyPrediction
): number {
  let score = 0;
  
  // Energy alignment
  const windowEnergy = energyPrediction.getEnergyAt(window.start);
  const energyDiff = Math.abs(windowEnergy - task.energyRequired);
  score += (10 - energyDiff) * 10; // Prefer matching energy levels
  
  // Time of day preference
  if (task.preferredTime) {
    const timeDiff = Math.abs(
      window.start.getHours() - parseInt(task.preferredTime.split(':')[0])
    );
    score += (24 - timeDiff) * 5;
  }
  
  // Avoid context switching
  const previousTask = getTaskBefore(window.start);
  if (previousTask && previousTask.category === task.category) {
    score += 15; // Bonus for similar tasks
  }
  
  return score;
}
```

### Step 5: Add Breaks and Buffers

```typescript
function addBreaksAndBuffers(schedule: ScheduledTask[]): TimeBlock[] {
  const blocks: TimeBlock[] = [];
  
  for (let i = 0; i < schedule.length; i++) {
    const task = schedule[i];
    
    // Add the task
    blocks.push(task);
    
    // Add break after task if needed
    if (shouldAddBreak(task, schedule[i + 1])) {
      blocks.push({
        id: generateId(),
        type: 'break',
        title: 'Break',
        startTime: task.endTime,
        endTime: new Date(task.endTime.getTime() + 10 * 60000), // 10 min
        duration: 10,
        priority: 'medium',
        flexibility: 'flexible',
        energyRequired: 1
      });
    }
    
    // Add buffer for context switching
    if (needsContextSwitchBuffer(task, schedule[i + 1])) {
      blocks.push({
        id: generateId(),
        type: 'break',
        title: 'Buffer',
        startTime: task.endTime,
        endTime: new Date(task.endTime.getTime() + 5 * 60000), // 5 min
        duration: 5,
        priority: 'low',
        flexibility: 'flexible',
        energyRequired: 1
      });
    }
  }
  
  return blocks;
}

function shouldAddBreak(current: Task, next?: Task): boolean {
  // Break after 90 minutes of work
  if (current.duration >= 90) return true;
  
  // Break before high-energy task
  if (next && next.energyRequired >= 8) return true;
  
  // Break if next task is much later
  if (next && (next.startTime.getTime() - current.endTime.getTime()) > 30 * 60000) {
    return false; // Natural gap exists
  }
  
  return false;
}
```

---

## 🚗 Travel Time Integration

### Travel Time Calculation

```typescript
interface Location {
  name: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  travelTimeFromHome?: number; // minutes
}

function calculateTravelTime(
  from: Location,
  to: Location,
  mode: 'walking' | 'transit' | 'driving' = 'transit'
): number {
  // Use cached travel time if available
  if (to.travelTimeFromHome && from.name === 'Home') {
    return to.travelTimeFromHome;
  }
  
  // Default estimates based on mode
  const defaultTimes = {
    walking: 30,
    transit: 45,
    driving: 20
  };
  
  // In production, integrate with Google Maps API
  // const distance = calculateDistance(from.coordinates, to.coordinates);
  // const time = await googleMaps.getTravelTime(from, to, mode);
  
  return defaultTimes[mode];
}

function addTravelBlocks(
  schedule: TimeBlock[],
  locations: Map<string, Location>
): TimeBlock[] {
  const withTravel: TimeBlock[] = [];
  let currentLocation = 'Home';
  
  for (const block of schedule) {
    if (block.location && block.location !== currentLocation) {
      // Add travel time before this block
      const travelTime = calculateTravelTime(
        locations.get(currentLocation)!,
        locations.get(block.location)!
      );
      
      withTravel.push({
        id: generateId(),
        type: 'travel',
        title: `Travel to ${block.location}`,
        startTime: new Date(block.startTime.getTime() - travelTime * 60000),
        endTime: block.startTime,
        duration: travelTime,
        priority: 'high',
        flexibility: 'fixed',
        energyRequired: 3
      });
      
      currentLocation = block.location;
    }
    
    withTravel.push(block);
  }
  
  return withTravel;
}
```

---

## 😴 Sleep Schedule Protection

### Sleep Time Enforcement

```typescript
interface SleepSchedule {
  targetBedtime: string; // "22:30"
  targetWakeTime: string; // "07:00"
  minimumSleep: number; // hours
  windDownTime: number; // minutes before bed
}

function enforceSleepSchedule(
  schedule: TimeBlock[],
  sleepSchedule: SleepSchedule
): TimeBlock[] {
  const bedtime = parseTime(sleepSchedule.targetBedtime);
  const windDownStart = new Date(bedtime.getTime() - sleepSchedule.windDownTime * 60000);
  
  // Remove any tasks scheduled after wind-down time
  const filtered = schedule.filter(block => {
    if (block.type === 'sleep') return true;
    return block.endTime <= windDownStart;
  });
  
  // Add wind-down block
  filtered.push({
    id: generateId(),
    type: 'break',
    title: 'Wind Down',
    startTime: windDownStart,
    endTime: bedtime,
    duration: sleepSchedule.windDownTime,
    priority: 'high',
    flexibility: 'fixed',
    energyRequired: 1
  });
  
  // Add sleep block
  const wakeTime = parseTime(sleepSchedule.targetWakeTime);
  filtered.push({
    id: generateId(),
    type: 'sleep',
    title: 'Sleep',
    startTime: bedtime,
    endTime: wakeTime,
    duration: (wakeTime.getTime() - bedtime.getTime()) / 60000,
    priority: 'high',
    flexibility: 'fixed',
    energyRequired: 0
  });
  
  return filtered.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}
```

---

## 🔔 Notification System

### Notification Types

```typescript
enum NotificationType {
  TASK_REMINDER = 'task_reminder',
  TASK_DUE_SOON = 'task_due_soon',
  MOOD_CHECK = 'mood_check',
  BREAK_REMINDER = 'break_reminder',
  MOTIVATION = 'motivation',
  HABIT_REMINDER = 'habit_reminder',
  LEARNING_PROMPT = 'learning_prompt',
  ACHIEVEMENT = 'achievement',
  SCHEDULE_UPDATE = 'schedule_update',
  EMOTIONAL_TRADING_ALERT = 'emotional_trading_alert'
}

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
  scheduledTime: Date;
  priority: 'high' | 'normal' | 'low';
  sound?: string;
  vibration?: number[];
}
```

### Notification Scheduling Logic

```typescript
class NotificationScheduler {
  async scheduleTaskReminder(task: Task, mood: MoodState) {
    const strategy = getNotificationStrategy(mood);
    
    if (strategy.frequency === 'minimal' && task.priority !== 'high') {
      return; // Skip non-critical notifications in minimal mode
    }
    
    // Calculate reminder time
    const reminderTime = new Date(task.startTime.getTime() - 15 * 60000); // 15 min before
    
    const notification: Notification = {
      id: generateId(),
      type: NotificationType.TASK_REMINDER,
      title: this.getToneAdjustedTitle(task.title, strategy.tone),
      body: this.getToneAdjustedBody(task, strategy.tone),
      scheduledTime: reminderTime,
      priority: task.priority === 'high' ? 'high' : 'normal',
      data: { taskId: task.id }
    };
    
    await this.scheduleNotification(notification);
  }
  
  getToneAdjustedTitle(title: string, tone: string): string {
    const prefixes = {
      encouraging: '🎯 Time to shine!',
      supportive: '📝 Gentle reminder:',
      gentle: '💙 When you\'re ready:',
      calming: '🧘 No pressure:',
      understanding: '💭 If you can:'
    };
    
    return `${prefixes[tone]} ${title}`;
  }
  
  getToneAdjustedBody(task: Task, tone: string): string {
    const templates = {
      encouraging: `You've got this! ${task.title} is up next.`,
      supportive: `${task.title} is scheduled now. You can do it!`,
      gentle: `${task.title} is ready when you are. No rush.`,
      calming: `${task.title} is available. Take your time.`,
      understanding: `${task.title} is here if you feel up to it.`
    };
    
    return templates[tone];
  }
}
```

### Smart Notification Timing

```typescript
function calculateOptimalNotificationTime(
  event: ScheduledEvent,
  userPreferences: UserPreferences
): Date {
  // Don't notify during sleep hours
  if (isWithinSleepHours(event.time, userPreferences.sleepSchedule)) {
    return getNextWakeTime(userPreferences.sleepSchedule);
  }
  
  // Don't notify during focus mode
  if (userPreferences.focusMode?.enabled) {
    return new Date(userPreferences.focusMode.endTime);
  }
  
  // Batch notifications if many are pending
  const pendingCount = getPendingNotificationCount();
  if (pendingCount > 5) {
    return getNextBatchTime(); // e.g., top of next hour
  }
  
  // Default: notify at event time
  return event.time;
}
```

### Notification Batching

```typescript
class NotificationBatcher {
  private batchWindow = 30 * 60 * 1000; // 30 minutes
  private pendingNotifications: Notification[] = [];
  
  async addNotification(notification: Notification) {
    this.pendingNotifications.push(notification);
    
    // Check if we should send batch
    if (this.shouldSendBatch()) {
      await this.sendBatch();
    }
  }
  
  shouldSendBatch(): boolean {
    if (this.pendingNotifications.length === 0) return false;
    
    // Send if we have 3+ notifications
    if (this.pendingNotifications.length >= 3) return true;
    
    // Send if oldest notification is past batch window
    const oldest = this.pendingNotifications[0];
    const age = Date.now() - oldest.scheduledTime.getTime();
    return age > this.batchWindow;
  }
  
  async sendBatch() {
    if (this.pendingNotifications.length === 1) {
      // Send single notification normally
      await sendNotification(this.pendingNotifications[0]);
    } else {
      // Send as grouped notification
      await sendNotification({
        id: generateId(),
        type: NotificationType.SCHEDULE_UPDATE,
        title: `${this.pendingNotifications.length} updates`,
        body: this.summarizeNotifications(),
        scheduledTime: new Date(),
        priority: 'normal',
        data: { notifications: this.pendingNotifications }
      });
    }
    
    this.pendingNotifications = [];
  }
  
  summarizeNotifications(): string {
    const types = this.pendingNotifications.map(n => n.type);
    const summary = [];
    
    if (types.includes(NotificationType.TASK_REMINDER)) {
      const count = types.filter(t => t === NotificationType.TASK_REMINDER).length;
      summary.push(`${count} task${count > 1 ? 's' : ''}`);
    }
    
    if (types.includes(NotificationType.HABIT_REMINDER)) {
      summary.push('habit check');
    }
    
    return summary.join(', ');
  }
}
```

---

## 📊 Schedule Optimization Pseudocode

### Complete Scheduling Algorithm

```
FUNCTION generateDailySchedule(date, constraints, tasks, mood):
  // Step 1: Initialize
  schedule = []
  availableWindows = calculateAvailableWindows(date, constraints)
  energyPrediction = predictEnergyLevels(mood, constraints)
  
  // Step 2: Add fixed commitments
  FOR EACH commitment IN constraints.fixedCommitments:
    schedule.push(commitment)
    availableWindows = subtractTimeBlock(availableWindows, commitment)
  END FOR
  
  // Step 3: Add travel time
  schedule = addTravelBlocks(schedule, constraints.locations)
  
  // Step 4: Prioritize tasks
  prioritizedTasks = prioritizeTasks(tasks, mood, energyPrediction)
  
  // Step 5: Assign tasks to windows
  FOR EACH task IN prioritizedTasks:
    bestWindow = findBestWindow(task, availableWindows, energyPrediction)
    
    IF bestWindow EXISTS:
      scheduledTask = {
        ...task,
        startTime: bestWindow.start,
        endTime: bestWindow.start + task.duration
      }
      schedule.push(scheduledTask)
      availableWindows = subtractTimeBlock(availableWindows, scheduledTask)
    ELSE:
      // Task doesn't fit today
      suggestReschedule(task, date + 1)
    END IF
  END FOR
  
  // Step 6: Add breaks
  schedule = addBreaksAndBuffers(schedule)
  
  // Step 7: Add learning/entertainment
  IF hasAvailableTime(availableWindows, 30):
    learningBlock = createLearningBlock(mood, energyPrediction)
    schedule.push(learningBlock)
  END IF
  
  // Step 8: Enforce sleep schedule
  schedule = enforceSleepSchedule(schedule, constraints.sleepSchedule)
  
  // Step 9: Sort chronologically
  schedule = sortByTime(schedule)
  
  // Step 10: Validate
  IF isOverloaded(schedule):
    schedule = reduceLoad(schedule, mood)
  END IF
  
  RETURN schedule
END FUNCTION
```

---

## 🎯 Schedule Validation

```typescript
function validateSchedule(schedule: TimeBlock[]): ValidationResult {
  const issues: string[] = [];
  
  // Check for overlaps
  for (let i = 0; i < schedule.length - 1; i++) {
    if (schedule[i].endTime > schedule[i + 1].startTime) {
      issues.push(`Overlap between ${schedule[i].title} and ${schedule[i + 1].title}`);
    }
  }
  
  // Check total work time
  const totalWorkTime = schedule
    .filter(b => b.type === 'work' || b.type === 'task')
    .reduce((sum, b) => sum + b.duration, 0);
  
  if (totalWorkTime > 10 * 60) { // More than 10 hours
    issues.push('Schedule exceeds recommended work time');
  }
  
  // Check break frequency
  const workBlocks = schedule.filter(b => b.type === 'work' || b.type === 'task');
  for (let i = 0; i < workBlocks.length - 1; i++) {
    const gap = workBlocks[i + 1].startTime.getTime() - workBlocks[i].endTime.getTime();
    if (workBlocks[i].duration > 90 && gap < 10 * 60000) {
      issues.push('Missing break after long work session');
    }
  }
  
  // Check sleep time
  const sleepBlock = schedule.find(b => b.type === 'sleep');
  if (sleepBlock && sleepBlock.duration < 7 * 60) {
    issues.push('Insufficient sleep time scheduled');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings: generateWarnings(schedule)
  };
}
```

---

**Echo's scheduling system creates realistic, mood-aware daily plans that respect your energy, time, and well-being—ensuring productivity without burnout.**
