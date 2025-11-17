/**
 * Gamification Data Model
 * Manages user progress, XP, levels, streaks, and achievements
 */

export const BadgeType = {
  PHONE_BOSS: 'phone_boss',
  ANTI_DOOM_HERO: 'anti_doom_hero',
  STREAK_MASTER: 'streak_master',
  TASK_CRUSHER: 'task_crusher',
  LEARNING_CHAMPION: 'learning_champion',
  EARLY_BIRD: 'early_bird',
  NIGHT_OWL: 'night_owl',
  WEEK_WARRIOR: 'week_warrior'
};

/**
 * Badge Schema
 */
export class Badge {
  constructor(type, name, description, icon, requirement) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.requirement = requirement;
    this.unlockedAt = null;
    this.isUnlocked = false;
  }

  unlock() {
    this.isUnlocked = true;
    this.unlockedAt = new Date().toISOString();
  }
}

/**
 * Gamification Progress Schema
 */
export class GamificationProgress {
  constructor() {
    this.userId = null;
    this.totalXP = 0;
    this.level = 1;
    this.currentStreak = 0;
    this.longestStreak = 0;
    this.lastActivityDate = null;
    this.totalTasksCompleted = 0;
    this.totalSessionsCompleted = 0;
    this.totalFocusMinutes = 0;
    this.totalDoomScrollMinutesSaved = 0;
    this.badges = [];
    this.weeklyStats = {
      focusMinutes: 0,
      doomScrollMinutes: 0,
      tasksCompleted: 0
    };
    this.createdAt = null;
    this.updatedAt = null;
  }

  /**
   * Calculates level based on XP
   * Level formula: Level = floor(sqrt(totalXP / 100)) + 1
   */
  calculateLevel() {
    this.level = Math.floor(Math.sqrt(this.totalXP / 100)) + 1;
    return this.level;
  }

  /**
   * Gets XP required for next level
   */
  getXPForNextLevel() {
    const nextLevel = this.level + 1;
    return (nextLevel - 1) * (nextLevel - 1) * 100;
  }

  /**
   * Gets current level progress percentage
   */
  getLevelProgress() {
    const currentLevelXP = (this.level - 1) * (this.level - 1) * 100;
    const nextLevelXP = this.getXPForNextLevel();
    const xpInCurrentLevel = this.totalXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    return Math.round((xpInCurrentLevel / xpNeededForLevel) * 100);
  }

  /**
   * Adds XP and recalculates level
   */
  addXP(xp) {
    this.totalXP += xp;
    const oldLevel = this.level;
    this.calculateLevel();
    return {
      leveledUp: this.level > oldLevel,
      newLevel: this.level,
      totalXP: this.totalXP
    };
  }

  /**
   * Updates streak based on activity
   */
  updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    
    if (!this.lastActivityDate) {
      this.currentStreak = 1;
      this.lastActivityDate = today;
      return;
    }

    const lastDate = new Date(this.lastActivityDate);
    const currentDate = new Date(today);
    const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Same day, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      this.currentStreak++;
      if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
      }
    } else {
      // Streak broken
      this.currentStreak = 1;
    }

    this.lastActivityDate = today;
  }

  /**
   * Records a completed session
   */
  recordSession(session) {
    this.totalSessionsCompleted++;
    this.totalFocusMinutes += session.durationMinutes;
    this.totalTasksCompleted += session.completedTasks.length;
    this.addXP(session.xpEarned);
    this.updateStreak();
    this.checkBadges();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Records doom scroll time saved
   */
  recordDoomScrollSaved(minutes) {
    this.totalDoomScrollMinutesSaved += minutes;
  }

  /**
   * Updates weekly stats
   */
  updateWeeklyStats(focusMinutes, doomScrollMinutes, tasksCompleted) {
    this.weeklyStats.focusMinutes += focusMinutes;
    this.weeklyStats.doomScrollMinutes += doomScrollMinutes;
    this.weeklyStats.tasksCompleted += tasksCompleted;
  }

  /**
   * Resets weekly stats (called at the start of each week)
   */
  resetWeeklyStats() {
    this.weeklyStats = {
      focusMinutes: 0,
      doomScrollMinutes: 0,
      tasksCompleted: 0
    };
  }

  /**
   * Checks and unlocks badges based on achievements
   */
  checkBadges() {
    const badgeDefinitions = [
      {
        type: BadgeType.PHONE_BOSS,
        name: 'Phone Boss',
        description: 'Complete 10 focus sessions',
        requirement: () => this.totalSessionsCompleted >= 10
      },
      {
        type: BadgeType.ANTI_DOOM_HERO,
        name: 'Anti-Doom Hero',
        description: 'Save 500 minutes from doom scrolling',
        requirement: () => this.totalDoomScrollMinutesSaved >= 500
      },
      {
        type: BadgeType.STREAK_MASTER,
        name: 'Streak Master',
        description: 'Maintain a 7-day streak',
        requirement: () => this.currentStreak >= 7
      },
      {
        type: BadgeType.TASK_CRUSHER,
        name: 'Task Crusher',
        description: 'Complete 50 tasks',
        requirement: () => this.totalTasksCompleted >= 50
      },
      {
        type: BadgeType.LEARNING_CHAMPION,
        name: 'Learning Champion',
        description: 'Reach level 10',
        requirement: () => this.level >= 10
      },
      {
        type: BadgeType.WEEK_WARRIOR,
        name: 'Week Warrior',
        description: 'Complete 5 sessions in a week',
        requirement: () => this.weeklyStats.tasksCompleted >= 5
      }
    ];

    badgeDefinitions.forEach(def => {
      const existingBadge = this.badges.find(b => b.type === def.type);
      if (!existingBadge && def.requirement()) {
        const badge = new Badge(def.type, def.name, def.description, def.type, def.requirement);
        badge.unlock();
        this.badges.push(badge);
      }
    });
  }

  /**
   * Gets achievement summary
   */
  getAchievementSummary() {
    return {
      level: this.level,
      totalXP: this.totalXP,
      xpForNextLevel: this.getXPForNextLevel(),
      levelProgress: this.getLevelProgress(),
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      totalTasksCompleted: this.totalTasksCompleted,
      totalSessionsCompleted: this.totalSessionsCompleted,
      totalFocusMinutes: this.totalFocusMinutes,
      totalDoomScrollMinutesSaved: this.totalDoomScrollMinutesSaved,
      badgesUnlocked: this.badges.filter(b => b.isUnlocked).length,
      totalBadges: this.badges.length
    };
  }

  toJSON() {
    return {
      userId: this.userId,
      totalXP: this.totalXP,
      level: this.level,
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      lastActivityDate: this.lastActivityDate,
      totalTasksCompleted: this.totalTasksCompleted,
      totalSessionsCompleted: this.totalSessionsCompleted,
      totalFocusMinutes: this.totalFocusMinutes,
      totalDoomScrollMinutesSaved: this.totalDoomScrollMinutesSaved,
      badges: this.badges,
      weeklyStats: this.weeklyStats,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(json) {
    const progress = new GamificationProgress();
    Object.assign(progress, json);
    return progress;
  }
}
