# Unfreeze App Flow Documentation

## User Journey Flowchart

### Initial Launch Flow

```
┌─────────────────┐
│  App Launch     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check           │
│ Onboarding      │
│ Status          │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Completed   Not Completed
    │         │
    │         ▼
    │    ┌─────────────┐
    │    │ Onboarding  │
    │    │ Screen      │
    │    └──────┬──────┘
    │           │
    │           ▼
    │    [7 Steps Flow]
    │           │
    └───────────┴──────────┐
                           │
                           ▼
                    ┌─────────────┐
                    │ Home Screen │
                    └─────────────┘
```

### Onboarding Flow (7 Steps)

```
Step 1: Name
    │
    ▼
Step 2: Age
    │
    ▼
Step 3: Role Selection
    │
    ▼
Step 4: Interests (Multi-select)
    │
    ▼
Step 5: Goals (Multi-select)
    │
    ▼
Step 6: Distracting Apps (Multi-select)
    │
    ▼
Step 7: Daily Focus Target
    │
    ▼
Validate Profile
    │
    ├─── Invalid ──→ Show Errors ──→ Fix & Retry
    │
    ▼ Valid
Save Profile & Create Gamification Record
    │
    ▼
Navigate to Home Screen
```

### Main Navigation Flow

```
┌──────────────────────────────────────────────────────┐
│              Bottom Tab Navigation                    │
├──────────┬──────────┬──────────┬────────────────────┤
│          │          │          │                     │
▼          ▼          ▼          ▼                     │
Home    Screen     Stats    Settings                  │
Screen   Time      Screen   Screen                    │
│       Insights                                       │
│       Screen                                         │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Stack Navigation (Overlays)                        │
│  ├─ Focus Session Screen                            │
│  └─ Task Completion Screen                          │
└──────────────────────────────────────────────────────┘
```

### Focus Session Flow (Core Feature)

```
┌──────────────────┐
│ User Clicks      │
│ "Start Focus"    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Load User        │
│ Profile          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ TaskGenerator:   │
│ Generate 3 Tasks │
│ Based on Profile │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Create Session   │
│ Object           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Save Tasks &     │
│ Session to       │
│ Storage          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Display Task 1   │
│ (Freeze Screen)  │
└────────┬─────────┘
         │
         ▼
    ┌────┴─────┐
    │          │
    ▼          ▼
Emergency   Complete
Exit        Task
    │          │
    │          ▼
    │    ┌─────────────┐
    │    │ Mark Task   │
    │    │ Complete    │
    │    └──────┬──────┘
    │           │
    │           ▼
    │    ┌─────────────┐
    │    │ Award XP    │
    │    └──────┬──────┘
    │           │
    │           ▼
    │      More Tasks?
    │           │
    │      ┌────┴────┐
    │      │         │
    │      Yes       No
    │      │         │
    │      ▼         ▼
    │   Display   Complete
    │   Next      Session
    │   Task        │
    │      │        ▼
    │      └───┐  Update
    │          │  Gamification
    │          │    │
    ▼          ▼    ▼
┌──────────────────────┐
│ 3-Step Confirmation  │
│ (Are you sure?)      │
└────────┬─────────────┘
         │
    ┌────┴────┐
    │         │
    Yes       No
    │         │
    │         └──→ Return to Task
    │
    ▼
Cancel Session
(No XP)
    │
    ▼
Return to Home
```

```
                           ▼
                    ┌─────────────┐
                    │ Task        │
                    │ Completion  │
                    │ Screen      │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Show:       │
                    │ - XP Earned │
                    │ - Tasks     │
                    │ - Duration  │
                    │ - Level Up? │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Continue to │
                    │ Home Screen │
                    └─────────────┘
```

### Task Generation Logic Flow

```
┌──────────────────┐
│ User Profile     │
│ - Interests      │
│ - Goals          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Prioritize       │
│ Interests Based  │
│ on Goals         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ For Each Task:   │
│ 1. Pick Interest │
│ 2. Pick Type     │
│ 3. Pick Template │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Create Task      │
│ Object with:     │
│ - Title          │
│ - Content        │
│ - Questions      │
│ - XP Reward      │
│ - Difficulty     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Return Array of  │
│ 3 Tasks          │
└──────────────────┘
```

### Gamification Update Flow

```
┌──────────────────┐
│ Session          │
│ Completed        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Load             │
│ Gamification     │
│ Progress         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Add XP from      │
│ Session          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Recalculate      │
│ Level            │
│ (sqrt formula)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update Streak    │
│ - Check date     │
│ - Increment or   │
│   Reset          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update Stats:    │
│ - Total Tasks    │
│ - Total Sessions │
│ - Focus Minutes  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Check Badge      │
│ Requirements     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Unlock New       │
│ Badges (if any)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Save Updated     │
│ Progress         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Display Results  │
└──────────────────┘
```

### Settings & Profile Edit Flow

```
┌──────────────────┐
│ Settings Screen  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Display Profile  │
│ (Read Mode)      │
└────────┬─────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
Edit      Reset Data
Profile      │
    │         ▼
    │    ┌──────────┐
    │    │ Confirm? │
    │    └────┬─────┘
    │         │
    │    ┌────┴────┐
    │    │         │
    │    Yes       No
    │    │         │
    │    │         └──→ Cancel
    │    ▼
    │  Clear All
    │  Storage
    │    │
    │    ▼
    │  Return to
    │  Onboarding
    │
    ▼
┌──────────────────┐
│ Enable Edit Mode │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User Edits       │
│ Fields           │
└────────┬─────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
  Save      Cancel
    │          │
    │          └──→ Reload Original
    │
    ▼
┌──────────────────┐
│ Validate         │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    Valid   Invalid
    │         │
    │         └──→ Show Errors
    │
    ▼
Save Profile
    │
    ▼
Show Success
    │
    ▼
Return to Read Mode
```

### Screen Time Insights Flow

```
┌──────────────────┐
│ Load Screen Time │
│ Data for Today   │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    Exists   Not Exists
    │         │
    │         ▼
    │    ┌──────────────┐
    │    │ Create Mock  │
    │    │ Data (Demo)  │
    │    └──────┬───────┘
    │           │
    └───────────┴──────┐
                       │
                       ▼
                ┌─────────────┐
                │ Analyze     │
                │ Data:       │
                │ - Calculate │
                │   %'s       │
                │ - Get Top 5 │
                │ - Health    │
                │   Score     │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │ Display:    │
                │ - Total     │
                │ - Breakdown │
                │ - Top Apps  │
                │ - Insights  │
                │ - Education │
                └─────────────┘
```

## Conditional Logic

### Task Type Selection
```
IF user.interests includes 'coding'
  AND user.goals includes 'skill_development'
THEN
  Prioritize coding tasks
  Select from: READ_QUIZ (algorithms) or ACTION_PLANNING (learning)
```

### Level Calculation
```
Level = floor(sqrt(totalXP / 100)) + 1

Examples:
- 0 XP → Level 1
- 100 XP → Level 2
- 400 XP → Level 3
- 900 XP → Level 4
```

### Streak Update Logic
```
today = current_date
last_activity = user.lastActivityDate

days_diff = today - last_activity

IF days_diff == 0:
  // Same day, no change
  currentStreak = currentStreak
ELSE IF days_diff == 1:
  // Consecutive day
  currentStreak = currentStreak + 1
  IF currentStreak > longestStreak:
    longestStreak = currentStreak
ELSE:
  // Streak broken
  currentStreak = 1
```

### Badge Unlock Conditions
```
Phone Boss: totalSessionsCompleted >= 10
Anti-Doom Hero: totalDoomScrollMinutesSaved >= 500
Streak Master: currentStreak >= 7
Task Crusher: totalTasksCompleted >= 50
Learning Champion: level >= 10
Week Warrior: weeklyStats.tasksCompleted >= 5
```

## Error Handling

### Validation Errors
```
User Input → Validate → Error?
                │
           ┌────┴────┐
           │         │
           Yes       No
           │         │
           ▼         ▼
    Show Error   Continue
    Message         │
       │            │
       └────────────┘
         Retry
```

### Storage Errors
```
Save Operation
    │
    ▼
Try/Catch
    │
┌───┴───┐
│       │
Success Fail
│       │
│       ▼
│   Log Error
│   Return false
│       │
└───────┴──→ Handle Gracefully
```

## State Management

### Screen State Flow
```
Component Mount
    │
    ▼
Initialize State
    │
    ▼
useEffect → Load Data
    │
    ▼
Update State
    │
    ▼
Re-render
    │
    ▼
User Interaction
    │
    ▼
Update State
    │
    ▼
Save to Storage
    │
    ▼
Re-render
```
