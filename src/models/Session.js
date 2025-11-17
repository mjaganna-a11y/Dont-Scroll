/**
 * Focus Session Data Model
 * Represents a freeze/focus session where user completes tasks
 */

export const SessionType = {
  MANUAL: 'manual',
  SCHEDULED: 'scheduled',
  TRIGGERED: 'triggered' // Triggered by app usage detection
};

export const SessionStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EMERGENCY_EXIT: 'emergency_exit'
};

/**
 * Session Schema
 */
export class Session {
  constructor() {
    this.id = null;
    this.userId = null;
    this.type = SessionType.MANUAL;
    this.status = SessionStatus.ACTIVE;
    this.tasks = []; // Array of Task IDs
    this.completedTasks = [];
    this.startTime = null;
    this.endTime = null;
    this.durationMinutes = 0;
    this.xpEarned = 0;
    this.emergencyExitUsed = false;
    this.createdAt = null;
  }

  /**
   * Starts the session
   */
  start() {
    this.status = SessionStatus.ACTIVE;
    this.startTime = new Date().toISOString();
    this.createdAt = this.startTime;
  }

  /**
   * Completes the session
   */
  complete() {
    this.status = SessionStatus.COMPLETED;
    this.endTime = new Date().toISOString();
    this.calculateDuration();
  }

  /**
   * Cancels the session with emergency exit
   */
  emergencyExit() {
    this.status = SessionStatus.EMERGENCY_EXIT;
    this.emergencyExitUsed = true;
    this.endTime = new Date().toISOString();
    this.calculateDuration();
  }

  /**
   * Calculates session duration
   */
  calculateDuration() {
    if (this.startTime && this.endTime) {
      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      this.durationMinutes = Math.round((end - start) / 60000);
    }
  }

  /**
   * Adds XP earned from a task
   */
  addXP(xp) {
    this.xpEarned += xp;
  }

  /**
   * Marks a task as completed in the session
   */
  completeTask(taskId, xp) {
    if (!this.completedTasks.includes(taskId)) {
      this.completedTasks.push(taskId);
      this.addXP(xp);
    }
  }

  /**
   * Checks if all tasks are completed
   */
  areAllTasksCompleted() {
    return this.tasks.length > 0 && this.completedTasks.length === this.tasks.length;
  }

  /**
   * Gets progress percentage
   */
  getProgress() {
    if (this.tasks.length === 0) return 0;
    return Math.round((this.completedTasks.length / this.tasks.length) * 100);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      status: this.status,
      tasks: this.tasks,
      completedTasks: this.completedTasks,
      startTime: this.startTime,
      endTime: this.endTime,
      durationMinutes: this.durationMinutes,
      xpEarned: this.xpEarned,
      emergencyExitUsed: this.emergencyExitUsed,
      createdAt: this.createdAt
    };
  }

  static fromJSON(json) {
    const session = new Session();
    Object.assign(session, json);
    return session;
  }
}
