/**
 * User Profile Data Model
 * Stores user information collected during onboarding and used throughout the app
 */

export const UserRole = {
  STUDENT: 'student',
  JOB: 'job',
  BUSINESS: 'business',
  FREELANCER: 'freelancer',
  OTHER: 'other'
};

export const InterestCategory = {
  BUSINESS: 'business',
  BOOKS: 'books',
  FINANCE: 'finance',
  CODING: 'coding',
  FITNESS: 'fitness',
  MARKETING: 'marketing',
  DESIGN: 'design',
  CAREER: 'career',
  PERSONAL_GROWTH: 'personal_growth'
};

export const GoalType = {
  EXAM_PREP: 'exam_prep',
  STARTUP_BUILDING: 'startup_building',
  CAREER_GROWTH: 'career_growth',
  PERSONAL_IMPROVEMENT: 'personal_improvement',
  SKILL_DEVELOPMENT: 'skill_development',
  FITNESS_HEALTH: 'fitness_health'
};

export const DistractingApp = {
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  REELS: 'reels',
  GAMES: 'games',
  OTHER: 'other'
};

/**
 * User Profile Schema
 */
export class UserProfile {
  constructor() {
    this.id = null;
    this.name = '';
    this.age = null;
    this.role = null; // UserRole enum
    this.interests = []; // Array of InterestCategory
    this.goals = []; // Array of GoalType
    this.distractingApps = []; // Array of DistractingApp
    this.dailyFocusTargetMinutes = 30; // Default 30 minutes
    this.createdAt = null;
    this.updatedAt = null;
  }

  /**
   * Validates the user profile
   * @returns {Object} { isValid: boolean, errors: Array<string> }
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!this.age || this.age < 13 || this.age > 120) {
      errors.push('Age must be between 13 and 120');
    }

    if (!this.role || !Object.values(UserRole).includes(this.role)) {
      errors.push('Valid role is required');
    }

    if (!this.interests || this.interests.length === 0) {
      errors.push('At least one interest is required');
    }

    if (!this.goals || this.goals.length === 0) {
      errors.push('At least one goal is required');
    }

    if (!this.dailyFocusTargetMinutes || this.dailyFocusTargetMinutes < 5 || this.dailyFocusTargetMinutes > 300) {
      errors.push('Daily focus target must be between 5 and 300 minutes');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converts to JSON-serializable object
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      role: this.role,
      interests: this.interests,
      goals: this.goals,
      distractingApps: this.distractingApps,
      dailyFocusTargetMinutes: this.dailyFocusTargetMinutes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Creates instance from JSON object
   */
  static fromJSON(json) {
    const profile = new UserProfile();
    Object.assign(profile, json);
    return profile;
  }
}
