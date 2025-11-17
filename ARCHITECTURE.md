# Unfreeze App Architecture Documentation

## Overview

Unfreeze is a mobile application built with React Native designed to help users reduce phone addiction by converting doom-scrolling time into productive learning tasks.

## Architecture Components

### 1. Data Models (`src/models/`)

#### UserProfile.js
- **Purpose**: Stores user information collected during onboarding
- **Key Properties**:
  - `name`, `age`, `role`: Basic user information
  - `interests`: Array of user interests (business, coding, fitness, etc.)
  - `goals`: Array of user goals (exam prep, career growth, etc.)
  - `distractingApps`: Apps user wants to reduce usage of
  - `dailyFocusTargetMinutes`: Daily focus target (20-60 minutes)

#### Task.js
- **Purpose**: Represents personalized learning/productivity tasks
- **Task Types**:
  - `READ_QUIZ`: Read content and answer questions
  - `REFLECTION`: Write reflections on prompts
  - `BRAINSTORMING`: Generate ideas
  - `ACTION_PLANNING`: Create action plans
  - `LEARNING_SUMMARY`: Summarize learning
- **Key Properties**:
  - `type`, `category`, `title`, `description`
  - `content`: Text to read or prompt
  - `questions`: Array of questions (for READ_QUIZ)
  - `difficulty`: Easy, Medium, Hard
  - `xpReward`: Points earned for completion

#### Session.js
- **Purpose**: Tracks focus/freeze sessions
- **Session Types**:
  - `MANUAL`: User-initiated
  - `SCHEDULED`: Time-based
  - `TRIGGERED`: App-usage triggered
- **Key Properties**:
  - `tasks`: Array of task IDs in session
  - `completedTasks`: Completed task IDs
  - `xpEarned`: Total XP from session
  - `durationMinutes`: Session length
  - `emergencyExitUsed`: Whether user exited early

#### Gamification.js
- **Purpose**: Manages user progress and achievements
- **Key Properties**:
  - `totalXP`, `level`: Progression system
  - `currentStreak`, `longestStreak`: Daily streak tracking
  - `badges`: Unlocked achievements
  - `weeklyStats`: Weekly focus/doom-scroll comparison
- **Badge Types**:
  - Phone Boss (10 sessions)
  - Anti-Doom Hero (500 min saved)
  - Streak Master (7-day streak)
  - Task Crusher (50 tasks)
  - Learning Champion (Level 10)

#### ScreenTimeData.js
- **Purpose**: Analyzes screen time and app usage
- **Key Features**:
  - Categorizes apps (social, entertainment, productivity)
  - Calculates productivity vs entertainment percentage
  - Provides health assessment
  - Generates feedback messages

### 2. Services (`src/services/`)

#### TaskGenerator.js
- **Purpose**: AI-powered task generation based on user profile
- **Key Methods**:
  - `generateTasks(userProfile, count)`: Creates personalized tasks
  - `prioritizeInterests(interests, goals)`: Aligns interests with goals
  - `generateDiverseTasks()`: Ensures task variety
- **Task Templates**: Pre-defined templates for each interest category
  - Business: Pricing strategies, market analysis
  - Coding: Algorithm complexity, best practices
  - Fitness: Nutrition, workout planning
  - Finance: Investment basics, savings strategies
  - Books: Speed reading, insights reflection
  - Marketing: Digital channels, campaign ideas
  - Personal Growth: Gratitude, habit building
  - Career: Networking, development planning

#### StorageService.js
- **Purpose**: Data persistence using AsyncStorage
- **Key Methods**:
  - `saveUserProfile()`, `getUserProfile()`
  - `saveGamificationProgress()`, `getGamificationProgress()`
  - `saveSession()`, `getAllSessions()`
  - `saveTask()`, `getAllTasks()`
  - `saveScreenTimeData()`, `getScreenTimeDataByDate()`
  - `clearAllData()`: Reset functionality

### 3. Screens (`src/screens/`)

#### OnboardingScreen.js
- **7-Step Flow**:
  1. Name collection
  2. Age input
  3. Role selection (student, job, business, freelancer)
  4. Interests selection (multiple choice)
  5. Goals selection (multiple choice)
  6. Distracting apps identification
  7. Daily focus target setting
- **Features**: Progress indicator, validation, back navigation

#### HomeScreen.js
- **Main Dashboard**:
  - Greeting and daily overview
  - Level, XP, and streak display
  - Level progress bar
  - Quick action cards
  - Start focus session button
  - Navigation to other screens

#### FocusSessionScreen.js
- **Freeze Mode**:
  - Full-screen lock interface
  - Task display with progress indicator
  - Question answering for READ_QUIZ tasks
  - Task completion tracking
  - Emergency exit (3-step confirmation)
  - No exit until tasks complete

#### TaskCompletionScreen.js
- **Session Results**:
  - Celebration UI
  - Session summary (tasks, duration, XP)
  - Individual task breakdown
  - Motivation message

#### ScreenTimeInsightsScreen.js
- **Screen Time Analysis**:
  - Total screen time display
  - Health assessment (excellent to excessive)
  - Productivity vs entertainment breakdown
  - Top 5 apps list
  - Educational insights on healthy usage

#### StatsScreen.js
- **Progress Dashboard**:
  - Level and XP display with progress
  - Streak tracking (current and best)
  - Task/session/focus time statistics
  - Weekly stats
  - Badges and achievements
  - Motivation messages

#### SettingsScreen.js
- **Profile Management**:
  - View/edit profile information
  - Update daily focus target
  - App settings (notifications, theme)
  - Privacy information
  - Reset all data option

### 4. Navigation (`src/navigation/`)

#### AppNavigator.js
- **Navigation Structure**:
  - Stack Navigator: Main navigation
  - Tab Navigator: Bottom tabs for main screens
  - Initial route based on onboarding status
- **Routes**:
  - Onboarding → Main Tabs → Home
  - Home → Focus Session → Task Completion → Home
  - Tab screens: Home, Screen Time, Stats, Settings

## Data Flow

### 1. Onboarding Flow
```
User Input → UserProfile Model → Validation → Storage
→ Create GamificationProgress → Navigate to Home
```

### 2. Focus Session Flow
```
Start Session → Load UserProfile → Generate Tasks (TaskGenerator)
→ Create Session → Display Tasks → User Completes Tasks
→ Update Session → Update Gamification → Save All → Show Results
```

### 3. Task Generation Flow
```
UserProfile (interests + goals) → TaskGenerator.prioritizeInterests()
→ Select Templates → Create Task Objects → Assign XP/Difficulty
→ Return Task Array
```

### 4. Gamification Flow
```
Complete Session → Update totalXP → Calculate Level
→ Update Streak → Check Badge Requirements → Unlock Badges
→ Update Weekly Stats → Save Progress
```

## Key Design Decisions

### 1. Local-First Storage
- Uses AsyncStorage for data persistence
- No backend required initially
- Privacy-focused: all data stays on device
- Easy migration to cloud storage later

### 2. Personalization Engine
- Interest-based task selection
- Goal-aligned content prioritization
- Diverse task types for engagement
- Difficulty scaling based on user level

### 3. Gamification System
- XP and levels for long-term motivation
- Streaks for daily consistency
- Badges for milestone achievements
- Visual progress indicators

### 4. User Experience
- Dark theme for reduced eye strain
- Clear visual hierarchy
- Minimal friction for focus sessions
- Emergency exit for real emergencies
- Motivational messaging throughout

### 5. Freeze Mode Design
- Full-screen lock prevents exit
- Clear progress indication
- Engaging task presentation
- 3-step emergency exit confirmation
- Immediate XP feedback

## Technology Stack

- **Framework**: React Native 0.72.0
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Storage**: AsyncStorage
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: React Native StyleSheet

## Future Enhancements

1. **Scheduled Sessions**: Automatic session triggers at set times
2. **App Usage Detection**: Monitor and trigger sessions on distracting app usage
3. **Advanced Analytics**: Weekly/monthly trends and insights
4. **Social Features**: Share progress, compete with friends
5. **Custom Tasks**: User-created task templates
6. **Integration**: Calendar, habit tracking apps
7. **Cloud Sync**: Multi-device support
8. **AI Enhancement**: GPT-powered task generation
9. **Notifications**: Reminders and motivational messages
10. **Widget Support**: Home screen widgets for quick stats

## Security & Privacy

- Local storage only (no data sent to servers)
- No access to messages or personal content
- Usage data for personalization only
- Transparent data collection policy
- User control over all data (reset option)

## Performance Considerations

- Lazy loading for screens
- Efficient AsyncStorage usage
- Minimal re-renders with proper state management
- Optimized image assets
- Battery-friendly background processing
