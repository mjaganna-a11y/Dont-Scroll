# Unfreeze App - Component Architecture Diagram

## Application Layer Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         Unfreeze App                             │
│                     (React Native 0.72.0)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Presentation │    │   Business   │    │     Data     │
│     Layer     │◄───┤     Logic    │◄───┤    Layer     │
│   (Screens)   │    │   (Services) │    │   (Models)   │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Detailed Component Hierarchy

```
App.js (Entry Point)
│
└─── AppNavigator.js (Navigation Container)
     │
     ├─── Stack Navigator
     │    │
     │    ├─── OnboardingScreen
     │    │    ├─── Uses: UserProfile Model
     │    │    ├─── Uses: StorageService
     │    │    └─── Creates: User + Gamification
     │    │
     │    ├─── MainTabs (Tab Navigator)
     │    │    │
     │    │    ├─── HomeScreen
     │    │    │    ├─── Reads: UserProfile
     │    │    │    ├─── Reads: GamificationProgress
     │    │    │    └─── Navigates to: FocusSession
     │    │    │
     │    │    ├─── ScreenTimeInsightsScreen
     │    │    │    ├─── Reads: ScreenTimeData
     │    │    │    └─── Displays: Analytics
     │    │    │
     │    │    ├─── StatsScreen
     │    │    │    ├─── Reads: GamificationProgress
     │    │    │    └─── Displays: Achievements
     │    │    │
     │    │    └─── SettingsScreen
     │    │         ├─── Reads/Writes: UserProfile
     │    │         └─── Function: Reset Data
     │    │
     │    ├─── FocusSessionScreen
     │    │    ├─── Uses: TaskGenerator
     │    │    ├─── Creates: Session + Tasks
     │    │    ├─── Updates: Tasks (completion)
     │    │    └─── Navigates to: TaskCompletion
     │    │
     │    └─── TaskCompletionScreen
     │         ├─── Reads: Session + Tasks
     │         ├─── Updates: GamificationProgress
     │         └─── Navigates to: Home
     │
     └─── Uses: StorageService for all data operations
```

## Service Layer Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Services Layer                       │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐         ┌──────────────────┐   │
│  │  TaskGenerator   │         │ StorageService   │   │
│  │                  │         │                  │   │
│  │ ┌──────────────┐ │         │ ┌──────────────┐ │   │
│  │ │ Templates    │ │         │ │ AsyncStorage │ │   │
│  │ │ (by category)│ │         │ │   Interface  │ │   │
│  │ └──────────────┘ │         │ └──────────────┘ │   │
│  │                  │         │                  │   │
│  │ • Generate Tasks │         │ • Save Data      │   │
│  │ • Prioritize     │         │ • Load Data      │   │
│  │ • Diversify      │         │ • Clear Data     │   │
│  └──────────────────┘         └──────────────────┘   │
│           │                            │              │
│           └────────────────────────────┘              │
│                        │                              │
└────────────────────────┼──────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ AsyncStorage │
                  │   (Device)   │
                  └──────────────┘
```

## Data Model Structure

```
┌─────────────────────────────────────────────────────────────┐
│                       Data Models                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  UserProfile                  Task                          │
│  ┌──────────────┐            ┌──────────────┐             │
│  │ • id         │            │ • id         │             │
│  │ • name       │            │ • type       │             │
│  │ • age        │            │ • category   │             │
│  │ • role       │            │ • content    │             │
│  │ • interests  │────────────│ • questions  │             │
│  │ • goals      │  influences│ • xpReward   │             │
│  └──────────────┘            └──────────────┘             │
│         │                            │                      │
│         │                            │                      │
│         │     Session                │                      │
│         │     ┌──────────────┐       │                      │
│         │     │ • id         │       │                      │
│         └────►│ • userId     │◄──────┘                      │
│               │ • tasks[]    │                              │
│               │ • xpEarned   │                              │
│               └──────┬───────┘                              │
│                      │                                      │
│                      │ updates                              │
│                      │                                      │
│         GamificationProgress                                │
│         ┌──────────────────┐                               │
│         │ • userId         │                               │
│         │ • totalXP        │                               │
│         │ • level          │                               │
│         │ • currentStreak  │                               │
│         │ • badges[]       │                               │
│         │ • weeklyStats    │                               │
│         └──────────────────┘                               │
│                                                              │
│         ScreenTimeData                                       │
│         ┌──────────────────┐                               │
│         │ • userId         │                               │
│         │ • date           │                               │
│         │ • totalMinutes   │                               │
│         │ • appUsages[]    │                               │
│         └──────────────────┘                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Screen Component Breakdown

### OnboardingScreen
```
OnboardingScreen
├─── Step Management (useState: currentStep)
├─── Form State (useState: profile)
├─── Validation Logic
└─── Components
     ├─── Progress Bar
     ├─── Step Content (dynamic)
     │    ├─── Name Input
     │    ├─── Age Input
     │    ├─── Role Selection
     │    ├─── Interest Selection
     │    ├─── Goal Selection
     │    ├─── App Selection
     │    └─── Focus Target Input
     └─── Navigation Buttons
          ├─── Back Button
          └─── Next/Submit Button
```

### HomeScreen
```
HomeScreen
├─── Data Loading (useEffect)
├─── State
│    ├─── profile
│    ├─── gamification
│    └─── loading
└─── Components
     ├─── Header (greeting)
     ├─── Stats Card
     │    ├─── Level Display
     │    ├─── XP Display
     │    ├─── Streak Display
     │    └─── Progress Bar
     ├─── Main Action Button (Start Session)
     ├─── Quick Actions
     │    ├─── Screen Time Card
     │    ├─── Stats Card
     │    └─── Settings Card
     └─── Motivation Card
```

### FocusSessionScreen
```
FocusSessionScreen
├─── Session Management
│    ├─── Initialize Session
│    ├─── Load Tasks
│    └─── Track Progress
├─── State
│    ├─── session
│    ├─── tasks
│    ├─── currentTaskIndex
│    └─── showEmergencyModal
└─── Components
     ├─── Header
     │    ├─── Lock Icon
     │    ├─── Progress Text
     │    └─── Progress Bar
     ├─── Task Card
     │    ├─── Category Badge
     │    ├─── XP Badge
     │    ├─── Title
     │    ├─── Description
     │    ├─── Content Box
     │    ├─── Questions (if READ_QUIZ)
     │    └─── Complete Button
     ├─── Emergency Exit Button
     └─── Emergency Modal
          ├─── Warning Messages
          └─── Confirmation Buttons
```

### StatsScreen
```
StatsScreen
├─── Data Loading
├─── State: gamification
└─── Components
     ├─── Header
     ├─── Level Card
     │    ├─── Level Display
     │    ├─── XP Display
     │    └─── Progress Bar
     ├─── Streak Card
     │    ├─── Current Streak
     │    ├─── Longest Streak
     │    └─── Streak Message
     ├─── Stats Grid
     │    ├─── Tasks Completed
     │    ├─── Sessions
     │    ├─── Focus Minutes
     │    └─── Minutes Saved
     ├─── Weekly Card
     ├─── Badges Card
     │    ├─── Badge Gallery
     │    └─── Locked Badges
     └─── Motivation Card
```

## Data Flow Diagram

### Focus Session Flow
```
User Taps "Start Session"
         │
         ▼
HomeScreen.startFocusSession()
         │
         ▼
Navigate to FocusSessionScreen
         │
         ▼
FocusSessionScreen.initializeSession()
         │
         ├─── Load UserProfile from Storage
         │
         ├─── TaskGenerator.generateDiverseTasks(profile, 3)
         │    │
         │    ├─── Prioritize Interests based on Goals
         │    ├─── Select Task Types
         │    ├─── Pick Templates
         │    └─── Create Task Objects
         │
         ├─── Create Session Object
         │    ├─── Set session.tasks = task IDs
         │    └─── session.start()
         │
         ├─── Save Tasks to Storage
         └─── Save Session to Storage
         │
         ▼
Display First Task
         │
         ▼
User Completes Task
         │
         ▼
handleTaskComplete()
         │
         ├─── task.complete(answer)
         ├─── Calculate XP
         ├─── session.completeTask(taskId, xp)
         ├─── Save Task
         └─── Save Session
         │
         ▼
More Tasks? ──Yes──► Display Next Task
         │
         No
         │
         ▼
completeSession()
         │
         ├─── session.complete()
         ├─── Save Session
         │
         ├─── Load GamificationProgress
         ├─── gamification.recordSession(session)
         │    ├─── Add XP
         │    ├─── Calculate Level
         │    ├─── Update Streak
         │    └─── Check Badges
         └─── Save GamificationProgress
         │
         ▼
Navigate to TaskCompletionScreen
         │
         ▼
Display Results
```

### Task Generation Logic
```
TaskGenerator.generateTasks(profile, count)
         │
         ▼
prioritizeInterests(interests, goals)
         │
         ├─── Create priority map (goals → interests)
         ├─── Add aligned interests first
         └─── Add remaining interests
         │
         ▼
For each task (count):
         │
         ├─── Select interest (round-robin)
         │
         ├─── Get templates for interest
         │    └─── TASK_TEMPLATES[interest]
         │
         ├─── Random task type from available types
         │
         ├─── Random template for that type
         │
         └─── generateTaskForInterest()
              │
              ├─── Create Task object
              ├─── Set id, type, category
              ├─── Set title from template
              ├─── Set content/questions
              ├─── Calculate difficulty
              ├─── Calculate XP reward
              └─── Return Task
```

## State Management Pattern

```
Component Mount
     │
     ▼
useState: Initialize State
     │
     ▼
useEffect: Load Data
     │
     ├─── await StorageService.get*()
     │
     ├─── setState(data)
     │
     └─── setLoading(false)
     │
     ▼
Component Renders with Data
     │
     ▼
User Interaction
     │
     ├─── Event Handler
     │
     ├─── Update Local State
     │    └─── setState(newValue)
     │
     ├─── Save to Storage
     │    └─── await StorageService.save*(data)
     │
     └─── Re-render (automatic)
```

## Navigation Flow

```
App Launch
     │
     ▼
Check Onboarding Status
     │
     ├─── Not Completed ──► OnboardingScreen
     │                           │
     │                           ▼
     │                      Complete Steps
     │                           │
     │                           ▼
     │                      Save Profile
     │                           │
     └─── Completed ─────────────┘
                                  │
                                  ▼
                           Main Tab Navigator
                                  │
     ┌────────────┬───────────────┼───────────────┬────────────┐
     │            │                │               │            │
     ▼            ▼                ▼               ▼            ▼
  Home      Screen Time        Stats          Settings      (Tab)
  Screen      Insights        Screen          Screen
     │           Screen
     │
     ├─── Start Session ──► FocusSessionScreen (Stack)
     │                             │
     │                             ▼
     │                      Complete Session
     │                             │
     │                             ▼
     │                      TaskCompletionScreen (Stack)
     │                             │
     └─────────────────────────────┘
                                  │
                                  ▼
                          Back to Home (Stack Pop)
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────┐
│              React Native (UI Layer)                 │
│  • Components, Screens, Navigation                   │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│           React Navigation (Routing)                 │
│  • Stack Navigator, Tab Navigator                    │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│           Business Logic (Services)                  │
│  • TaskGenerator, StorageService                     │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│          Data Models (Domain Logic)                  │
│  • UserProfile, Task, Session, Gamification          │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│           AsyncStorage (Persistence)                 │
│  • Local Key-Value Storage                           │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│              Device Storage                          │
│  • iOS Keychain / Android SharedPreferences          │
└─────────────────────────────────────────────────────┘
```

## Component Communication

```
Parent-Child Props:
    HomeScreen ──props──► QuickActionCard

Navigation:
    HomeScreen ──navigate──► FocusSessionScreen

Storage Service (Shared):
    All Screens ──read/write──► StorageService ──► AsyncStorage

Event Callbacks:
    Button ──onPress──► EventHandler ──► UpdateState

Data Flow:
    User Input → State Update → Storage → Re-render
```

This component diagram provides a visual understanding of how all parts of the Unfreeze app work together to create a seamless user experience for reducing phone addiction through personalized learning.
