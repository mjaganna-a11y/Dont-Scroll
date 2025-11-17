# Unfreeze App - Database Schema Documentation

## Overview

The Unfreeze app uses **AsyncStorage** for local data persistence. All data is stored as JSON strings with specific keys. This document outlines the data structure and schema for each entity.

## Storage Keys

```javascript
const KEYS = {
  USER_PROFILE: '@unfreeze:user_profile',
  GAMIFICATION: '@unfreeze:gamification',
  SESSIONS: '@unfreeze:sessions',
  TASKS: '@unfreeze:tasks',
  SCREEN_TIME: '@unfreeze:screen_time',
  SETTINGS: '@unfreeze:settings'
};
```

## Entity Schemas

### 1. User Profile

**Key**: `@unfreeze:user_profile`

**Type**: Single object

**Schema**:
```json
{
  "id": "string (unique identifier)",
  "name": "string",
  "age": "number (13-120)",
  "role": "enum [student, job, business, freelancer, other]",
  "interests": [
    "enum [business, books, finance, coding, fitness, marketing, design, career, personal_growth]"
  ],
  "goals": [
    "enum [exam_prep, startup_building, career_growth, personal_improvement, skill_development, fitness_health]"
  ],
  "distractingApps": [
    "enum [instagram, youtube, tiktok, facebook, twitter, reels, games, other]"
  ],
  "dailyFocusTargetMinutes": "number (5-300)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

**Example**:
```json
{
  "id": "user_1700123456789",
  "name": "John Doe",
  "age": 25,
  "role": "student",
  "interests": ["coding", "business", "career"],
  "goals": ["skill_development", "career_growth"],
  "distractingApps": ["instagram", "youtube"],
  "dailyFocusTargetMinutes": 30,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Validation Rules**:
- `name`: Required, non-empty string
- `age`: Required, 13-120
- `role`: Required, valid enum value
- `interests`: Required, non-empty array
- `goals`: Required, non-empty array
- `dailyFocusTargetMinutes`: Required, 5-300

---

### 2. Gamification Progress

**Key**: `@unfreeze:gamification`

**Type**: Single object

**Schema**:
```json
{
  "userId": "string (reference to user profile)",
  "totalXP": "number",
  "level": "number (calculated from XP)",
  "currentStreak": "number (consecutive days)",
  "longestStreak": "number (best streak ever)",
  "lastActivityDate": "ISO date string (YYYY-MM-DD)",
  "totalTasksCompleted": "number",
  "totalSessionsCompleted": "number",
  "totalFocusMinutes": "number",
  "totalDoomScrollMinutesSaved": "number",
  "badges": [
    {
      "type": "enum [phone_boss, anti_doom_hero, streak_master, task_crusher, learning_champion, week_warrior]",
      "name": "string",
      "description": "string",
      "icon": "string",
      "requirement": "function or description",
      "unlockedAt": "ISO 8601 timestamp or null",
      "isUnlocked": "boolean"
    }
  ],
  "weeklyStats": {
    "focusMinutes": "number",
    "doomScrollMinutes": "number",
    "tasksCompleted": "number"
  },
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

**Level Calculation Formula**:
```
Level = floor(sqrt(totalXP / 100)) + 1
```

**XP for Next Level**:
```
NextLevelXP = (nextLevel - 1)² × 100
```

**Badge Requirements**:
- `phone_boss`: Complete 10 sessions
- `anti_doom_hero`: Save 500 minutes
- `streak_master`: 7-day streak
- `task_crusher`: Complete 50 tasks
- `learning_champion`: Reach level 10
- `week_warrior`: Complete 5 sessions in a week

**Example**:
```json
{
  "userId": "user_1700123456789",
  "totalXP": 250,
  "level": 2,
  "currentStreak": 3,
  "longestStreak": 5,
  "lastActivityDate": "2024-01-15",
  "totalTasksCompleted": 15,
  "totalSessionsCompleted": 5,
  "totalFocusMinutes": 75,
  "totalDoomScrollMinutesSaved": 120,
  "badges": [
    {
      "type": "phone_boss",
      "name": "Phone Boss",
      "description": "Complete 10 focus sessions",
      "icon": "phone_boss",
      "isUnlocked": false,
      "unlockedAt": null
    }
  ],
  "weeklyStats": {
    "focusMinutes": 45,
    "doomScrollMinutes": 60,
    "tasksCompleted": 9
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:45:00.000Z"
}
```

---

### 3. Tasks

**Key**: `@unfreeze:tasks`

**Type**: Array of objects

**Schema**:
```json
[
  {
    "id": "string (unique identifier)",
    "type": "enum [read_quiz, reflection, brainstorming, action_planning, learning_summary]",
    "category": "string (from InterestCategory)",
    "title": "string",
    "description": "string",
    "content": "string or null (content to read or prompt)",
    "questions": [
      {
        "text": "string",
        "options": ["string"],
        "correctAnswer": "number (index)",
        "userAnswer": "number or null"
      }
    ],
    "expectedAnswer": "string or null",
    "difficulty": "enum [easy, medium, hard]",
    "estimatedMinutes": "number",
    "xpReward": "number",
    "status": "enum [pending, in_progress, completed, skipped]",
    "userAnswer": "string or null",
    "completedAt": "ISO 8601 timestamp or null",
    "createdAt": "ISO 8601 timestamp"
  }
]
```

**Task Type Specifics**:

**READ_QUIZ**:
- Has `content` (text to read)
- Has `questions` array (minimum 1)
- Questions have multiple choice options
- XP awarded based on correct answers

**REFLECTION**:
- Has `content` (prompt)
- No questions
- User provides written response
- XP awarded for completion

**BRAINSTORMING**:
- Has `content` (prompt)
- User generates list of ideas
- XP awarded for completion

**ACTION_PLANNING**:
- Has `content` (prompt)
- User creates action steps
- XP awarded for completion

**LEARNING_SUMMARY**:
- Has `content` (text or topic)
- User writes summary
- XP awarded for completion

**XP Calculation**:
- Easy: 10 XP
- Medium: 20 XP
- Hard: 35 XP
- Partial credit: 50% for attempted but incorrect

**Example**:
```json
{
  "id": "task_1700123456789_abc123",
  "type": "read_quiz",
  "category": "coding",
  "title": "Algorithm Complexity",
  "description": "Read the content and answer the questions",
  "content": "Big O notation describes algorithm efficiency...",
  "questions": [
    {
      "text": "Which has the best performance for large datasets?",
      "options": ["O(n²)", "O(n)", "O(log n)", "O(n log n)"],
      "correctAnswer": 2,
      "userAnswer": null
    }
  ],
  "expectedAnswer": null,
  "difficulty": "medium",
  "estimatedMinutes": 4,
  "xpReward": 20,
  "status": "pending",
  "userAnswer": null,
  "completedAt": null,
  "createdAt": "2024-01-15T14:30:00.000Z"
}
```

---

### 4. Sessions

**Key**: `@unfreeze:sessions`

**Type**: Array of objects

**Schema**:
```json
[
  {
    "id": "string (unique identifier)",
    "userId": "string (reference to user profile)",
    "type": "enum [manual, scheduled, triggered]",
    "status": "enum [active, completed, cancelled, emergency_exit]",
    "tasks": ["string (task IDs)"],
    "completedTasks": ["string (task IDs)"],
    "startTime": "ISO 8601 timestamp",
    "endTime": "ISO 8601 timestamp or null",
    "durationMinutes": "number",
    "xpEarned": "number",
    "emergencyExitUsed": "boolean",
    "createdAt": "ISO 8601 timestamp"
  }
]
```

**Session Types**:
- `manual`: User-initiated from app
- `scheduled`: Time-based trigger (future)
- `triggered`: App usage detection (future)

**Session Status**:
- `active`: Currently in progress
- `completed`: All tasks finished
- `cancelled`: User cancelled (reserved)
- `emergency_exit`: Exited early with emergency

**Example**:
```json
{
  "id": "session_1700123456789",
  "userId": "user_1700123456789",
  "type": "manual",
  "status": "completed",
  "tasks": ["task_1", "task_2", "task_3"],
  "completedTasks": ["task_1", "task_2", "task_3"],
  "startTime": "2024-01-15T14:30:00.000Z",
  "endTime": "2024-01-15T14:45:00.000Z",
  "durationMinutes": 15,
  "xpEarned": 60,
  "emergencyExitUsed": false,
  "createdAt": "2024-01-15T14:30:00.000Z"
}
```

---

### 5. Screen Time Data

**Key**: `@unfreeze:screen_time`

**Type**: Array of objects (one per day)

**Schema**:
```json
[
  {
    "userId": "string (reference to user profile)",
    "date": "ISO date string (YYYY-MM-DD)",
    "totalScreenTimeMinutes": "number",
    "productiveTimeMinutes": "number",
    "entertainmentTimeMinutes": "number",
    "appUsages": [
      {
        "appName": "string",
        "packageName": "string",
        "category": "enum [social_media, entertainment, productivity, communication, games, other]",
        "timeSpentMinutes": "number"
      }
    ],
    "topApps": [
      {
        "appName": "string",
        "packageName": "string",
        "category": "string",
        "timeSpentMinutes": "number"
      }
    ],
    "createdAt": "ISO 8601 timestamp"
  }
]
```

**App Categories**:
- `social_media`: Facebook, Instagram, Twitter, etc.
- `entertainment`: YouTube, Netflix, TikTok, etc.
- `productivity`: Work apps, tools, editors
- `communication`: WhatsApp, Messages, Email
- `games`: All games
- `other`: Uncategorized

**Health Assessment Ranges**:
- Excellent: < 2 hours
- Good: 2-4 hours
- Moderate: 4-6 hours
- High: 6-8 hours
- Excessive: > 8 hours

**Example**:
```json
{
  "userId": "user_1700123456789",
  "date": "2024-01-15",
  "totalScreenTimeMinutes": 320,
  "productiveTimeMinutes": 64,
  "entertainmentTimeMinutes": 256,
  "appUsages": [
    {
      "appName": "Instagram",
      "packageName": "com.instagram",
      "category": "social_media",
      "timeSpentMinutes": 150
    },
    {
      "appName": "YouTube",
      "packageName": "com.youtube",
      "category": "entertainment",
      "timeSpentMinutes": 80
    }
  ],
  "topApps": [
    {
      "appName": "Instagram",
      "packageName": "com.instagram",
      "category": "social_media",
      "timeSpentMinutes": 150
    }
  ],
  "createdAt": "2024-01-15T23:59:00.000Z"
}
```

---

## Data Relationships

```
User Profile (1)
    │
    ├─── Gamification Progress (1)
    │
    ├─── Sessions (many)
    │       │
    │       └─── Tasks (many)
    │
    └─── Screen Time Data (many - one per day)
```

## Data Operations

### Create Operations

1. **User Profile**: Created during onboarding
2. **Gamification**: Created with user profile
3. **Session**: Created when starting focus mode
4. **Tasks**: Created when session starts
5. **Screen Time**: Created daily (or mock data)

### Read Operations

- All entities use `StorageService.get*()` methods
- Data loaded on screen mount with `useEffect`
- Cached in component state

### Update Operations

- **User Profile**: Updated via settings
- **Gamification**: Updated after each session
- **Session**: Updated as tasks complete
- **Tasks**: Updated when completed
- **Screen Time**: Updated daily

### Delete Operations

- Individual deletes not implemented
- Full reset via `StorageService.clearAllData()`

## Data Migration Strategy

For future versions:

1. **Version Field**: Add `version` to each entity
2. **Migration Functions**: Create `migrate_v1_to_v2()` functions
3. **Backwards Compatibility**: Always support previous version
4. **Data Export**: Add export to JSON functionality
5. **Cloud Sync**: Add sync with server (future)

## Data Backup

Currently no automatic backup. Future enhancements:

1. Export to JSON file
2. Cloud backup (optional)
3. Device-to-device transfer
4. Restore from backup

## Privacy & Security

- **Local Only**: All data stored on device
- **No Tracking**: No analytics sent to servers
- **User Control**: User can reset all data
- **Transparent**: Clear what data is collected
- **Minimal**: Only collect what's necessary

## Performance Considerations

- **Lazy Loading**: Load data only when needed
- **Caching**: Keep frequently accessed data in memory
- **Batch Operations**: Update multiple items at once
- **Indexing**: Use IDs for quick lookups
- **Cleanup**: Remove old sessions periodically (future)

## Testing Data

For development/testing:

```javascript
// Clear all data
await StorageService.clearAllData();

// Create mock user
const profile = new UserProfile();
profile.name = "Test User";
profile.age = 25;
// ... set other fields
await StorageService.saveUserProfile(profile);

// Create mock session
const session = new Session();
// ... set fields
await StorageService.saveSession(session);
```

## Query Patterns

Common queries implemented:

```javascript
// Get all sessions for date range
getSessionsByDateRange(startDate, endDate)

// Get task by ID
getTaskById(taskId)

// Get screen time for specific date
getScreenTimeDataByDate(date)

// Check if onboarding complete
isOnboardingCompleted()
```

## Future Enhancements

1. **Indexing**: Add indexes for faster queries
2. **Pagination**: For large task/session lists
3. **Search**: Search tasks by title/category
4. **Filtering**: Filter sessions by type/status
5. **Aggregation**: Weekly/monthly statistics
6. **Sync**: Multi-device sync via cloud
7. **Encryption**: Optional data encryption
8. **Compression**: Compress old data

---

This schema provides the foundation for the Unfreeze app's data layer, enabling personalized, gamified learning experiences while maintaining privacy and performance.
