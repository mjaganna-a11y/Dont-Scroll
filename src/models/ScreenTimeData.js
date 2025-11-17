/**
 * Screen Time Data Model
 * Stores and analyzes user's screen time data
 */

export const AppCategory = {
  SOCIAL_MEDIA: 'social_media',
  ENTERTAINMENT: 'entertainment',
  PRODUCTIVITY: 'productivity',
  COMMUNICATION: 'communication',
  GAMES: 'games',
  OTHER: 'other'
};

/**
 * App Usage Entry
 */
export class AppUsage {
  constructor(appName, packageName, category, timeSpentMinutes) {
    this.appName = appName;
    this.packageName = packageName;
    this.category = category;
    this.timeSpentMinutes = timeSpentMinutes;
  }
}

/**
 * Screen Time Data Schema
 */
export class ScreenTimeData {
  constructor() {
    this.userId = null;
    this.date = null; // ISO date string
    this.totalScreenTimeMinutes = 0;
    this.productiveTimeMinutes = 0;
    this.entertainmentTimeMinutes = 0;
    this.appUsages = []; // Array of AppUsage
    this.topApps = []; // Top 5 most used apps
    this.createdAt = null;
  }

  /**
   * Analyzes screen time data
   */
  analyze() {
    let productive = 0;
    let entertainment = 0;

    this.appUsages.forEach(usage => {
      if (usage.category === AppCategory.PRODUCTIVITY) {
        productive += usage.timeSpentMinutes;
      } else if (
        usage.category === AppCategory.SOCIAL_MEDIA ||
        usage.category === AppCategory.ENTERTAINMENT ||
        usage.category === AppCategory.GAMES
      ) {
        entertainment += usage.timeSpentMinutes;
      }
    });

    this.productiveTimeMinutes = productive;
    this.entertainmentTimeMinutes = entertainment;

    // Calculate top apps
    this.topApps = [...this.appUsages]
      .sort((a, b) => b.timeSpentMinutes - a.timeSpentMinutes)
      .slice(0, 5);
  }

  /**
   * Gets productivity percentage
   */
  getProductivityPercentage() {
    if (this.totalScreenTimeMinutes === 0) return 0;
    return Math.round((this.productiveTimeMinutes / this.totalScreenTimeMinutes) * 100);
  }

  /**
   * Gets entertainment percentage
   */
  getEntertainmentPercentage() {
    if (this.totalScreenTimeMinutes === 0) return 0;
    return Math.round((this.entertainmentTimeMinutes / this.totalScreenTimeMinutes) * 100);
  }

  /**
   * Gets feedback message based on usage
   */
  getFeedbackMessage() {
    const entertainmentPercentage = this.getEntertainmentPercentage();
    const totalHours = Math.floor(this.totalScreenTimeMinutes / 60);
    const totalMinutes = this.totalScreenTimeMinutes % 60;

    let message = `You spent ${totalHours}h ${totalMinutes}m on your phone today. `;

    if (entertainmentPercentage >= 70) {
      message += `${entertainmentPercentage}% was entertainment. Consider redirecting this time to your goals.`;
    } else if (entertainmentPercentage >= 50) {
      message += `${entertainmentPercentage}% was entertainment, ${this.getProductivityPercentage()}% productive. You're making progress!`;
    } else {
      message += `Great balance! ${this.getProductivityPercentage()}% productive, ${entertainmentPercentage}% entertainment.`;
    }

    return message;
  }

  /**
   * Gets health assessment based on research
   */
  getHealthAssessment() {
    const totalHours = this.totalScreenTimeMinutes / 60;
    
    if (totalHours < 2) {
      return {
        level: 'excellent',
        message: 'Excellent! Your screen time is within healthy limits.',
        color: '#4CAF50'
      };
    } else if (totalHours < 4) {
      return {
        level: 'good',
        message: 'Good screen time balance. Keep it up!',
        color: '#8BC34A'
      };
    } else if (totalHours < 6) {
      return {
        level: 'moderate',
        message: 'Moderate usage. Consider setting limits on entertainment apps.',
        color: '#FFC107'
      };
    } else if (totalHours < 8) {
      return {
        level: 'high',
        message: 'High screen time. This may impact your productivity and mental health.',
        color: '#FF9800'
      };
    } else {
      return {
        level: 'excessive',
        message: 'Excessive screen time detected. Time to take action!',
        color: '#F44336'
      };
    }
  }

  /**
   * Formats time for display
   */
  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  toJSON() {
    return {
      userId: this.userId,
      date: this.date,
      totalScreenTimeMinutes: this.totalScreenTimeMinutes,
      productiveTimeMinutes: this.productiveTimeMinutes,
      entertainmentTimeMinutes: this.entertainmentTimeMinutes,
      appUsages: this.appUsages,
      topApps: this.topApps,
      createdAt: this.createdAt
    };
  }

  static fromJSON(json) {
    const data = new ScreenTimeData();
    Object.assign(data, json);
    return data;
  }
}
