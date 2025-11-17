# Unfreeze – Anti Doom Scroll App

<div align="center">

🔒 **Turn Doom Scrolling into Productive Learning** 🌟

A mobile app that helps users reduce phone addiction by converting wasted screen time into personalized learning and growth sessions.

</div>

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Documentation](#documentation)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**The Problem**: People waste hours scrolling social media and watching short videos, harming productivity, mental health, and long-term goals.

**The Solution**: Unfreeze locks your screen with a full-screen focus mode that displays productive, personalized tasks. To unlock your phone, you must complete these tasks—converting wasted time into meaningful learning.

### Core Concept

When you're about to waste time or at scheduled intervals, the app:
1. Freezes your screen in full-screen mode
2. Shows personalized learning tasks based on your goals and interests
3. Requires task completion to unlock (with emergency exit for real emergencies)
4. Rewards you with XP, levels, and badges for building better habits

## ✨ Key Features

### 🎓 Intelligent Onboarding
- Collects user information: name, age, role, interests, goals
- Identifies apps to reduce usage of
- Sets daily focus targets
- 7-step guided flow with progress tracking

### 🧠 AI-Powered Task Generation
Personalized tasks based on your profile:
- **Read + Quiz**: Learn concepts and answer questions
- **Reflection**: Write thoughtful responses to prompts
- **Brainstorming**: Generate creative ideas
- **Action Planning**: Create concrete action steps
- **Learning Summary**: Summarize key insights

Task categories include:
- Business (pricing, market analysis)
- Coding (algorithms, best practices)
- Fitness (nutrition, workout planning)
- Finance (investing, budgeting)
- Books (reading techniques, insights)
- Marketing (campaigns, strategies)
- Personal Growth (habits, gratitude)
- Career (networking, development)

### 🔒 Focus/Freeze Mode
- Full-screen lock prevents exit until tasks complete
- Progress tracking (Task X of Y)
- Visual XP rewards
- 3-step emergency exit confirmation
- Task variety keeps sessions engaging

### 📊 Screen Time Insights
- Daily usage tracking
- Productivity vs entertainment breakdown
- Top apps analysis
- Health assessment (excellent to excessive)
- Educational insights on healthy screen time

### 🏆 Gamification System
- **XP & Levels**: Progressive achievement system
- **Daily Streaks**: Build consistency habits
- **Badges**: Milestone achievements
  - Phone Boss (10 sessions)
  - Anti-Doom Hero (500 min saved)
  - Streak Master (7-day streak)
  - Task Crusher (50 tasks)
  - Learning Champion (Level 10)
  - Week Warrior (weekly goals)
- **Weekly Stats**: Focus vs doom-scroll comparison

### ⚙️ Settings & Profile
- Edit profile information
- Update interests and goals
- Adjust daily focus targets
- Privacy-focused (local storage only)
- Reset option for fresh start

## 🔄 How It Works

### User Journey

1. **Onboarding**
   - User provides name, age, role
   - Selects interests (business, coding, fitness, etc.)
   - Chooses goals (exam prep, career growth, etc.)
   - Identifies distracting apps
   - Sets daily focus target (20-60 minutes)

2. **Task Generation**
   - App analyzes user profile
   - Prioritizes interests based on goals
   - Generates 3 diverse, personalized tasks
   - Assigns appropriate difficulty and XP

3. **Focus Session**
   - User starts session (manual or scheduled)
   - Screen locks in full-screen mode
   - User completes tasks one by one
   - Each completion awards XP
   - Session ends when all tasks done

4. **Progress Tracking**
   - XP accumulates to unlock levels
   - Daily activity builds streaks
   - Achievements unlock badges
   - Stats show improvement over time

### Task Personalization Example

**Profile**: Student interested in coding and career growth, goal: skill development

**Generated Tasks**:
1. **Read + Quiz**: Algorithm complexity concepts with questions
2. **Action Planning**: Create a 3-step learning plan for a new technology
3. **Reflection**: Write about one coding practice to improve

## 🛠 Tech Stack

- **Framework**: React Native 0.72.0
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Storage**: AsyncStorage (local-first, privacy-focused)
- **State Management**: React Hooks
- **Styling**: React Native StyleSheet

## 📁 Project Structure

```
Dont-Scroll/
├── src/
│   ├── models/              # Data models
│   │   ├── UserProfile.js   # User data structure
│   │   ├── Task.js          # Task structure
│   │   ├── Session.js       # Focus session tracking
│   │   ├── Gamification.js  # Progress & achievements
│   │   └── ScreenTimeData.js # Usage analytics
│   │
│   ├── services/            # Business logic
│   │   ├── TaskGenerator.js # AI task generation
│   │   └── StorageService.js # Data persistence
│   │
│   ├── screens/             # UI screens
│   │   ├── OnboardingScreen.js
│   │   ├── HomeScreen.js
│   │   ├── FocusSessionScreen.js
│   │   ├── TaskCompletionScreen.js
│   │   ├── ScreenTimeInsightsScreen.js
│   │   ├── StatsScreen.js
│   │   └── SettingsScreen.js
│   │
│   └── navigation/          # App navigation
│       └── AppNavigator.js
│
├── App.js                   # App entry point
├── package.json             # Dependencies
├── ARCHITECTURE.md          # Technical documentation
├── FLOWCHART.md            # User flows & logic
├── UX_EXPLANATION.md       # UX design decisions
└── README.md               # This file
```

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- React Native development environment
- iOS Simulator (Mac) or Android Emulator

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mjaganna-a11y/Dont-Scroll.git
   cd Dont-Scroll
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (Mac only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Run the app**

   For iOS:
   ```bash
   npm run ios
   ```

   For Android:
   ```bash
   npm run android
   ```

5. **Start Metro bundler** (if not auto-started)
   ```bash
   npm start
   ```

## 📚 Documentation

Comprehensive documentation is available:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture, data models, and design decisions
- **[FLOWCHART.md](./FLOWCHART.md)** - User flows, navigation logic, and conditional flows
- **[UX_EXPLANATION.md](./UX_EXPLANATION.md)** - UX design philosophy, screen breakdowns, and psychology

## 📸 Screenshots

> Note: Add screenshots here once the app is running

## 🔮 Future Enhancements

### High Priority
- [ ] Scheduled automatic sessions
- [ ] App usage detection triggers
- [ ] Advanced analytics dashboard
- [ ] Notification system
- [ ] Widget support

### Medium Priority
- [ ] Social features (share progress, compete)
- [ ] Custom task templates
- [ ] Cloud sync for multi-device
- [ ] Theme customization
- [ ] Export data/reports

### Low Priority
- [ ] Integration with calendar apps
- [ ] GPT-powered task generation
- [ ] Community task library
- [ ] Habit tracking integration
- [ ] Parental controls

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the need to combat phone addiction and doom scrolling
- Built with the goal of turning wasted time into personal growth
- Designed with user psychology and behavior change principles

## 📧 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

<div align="center">

**"Every minute you focus is a step toward your goals!"** 💪

Made with ❤️ to help people build better phone habits

</div>