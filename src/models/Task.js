/**
 * Task Data Model
 * Represents personalized learning/productivity tasks
 */

export const TaskType = {
  READ_QUIZ: 'read_quiz',
  REFLECTION: 'reflection',
  BRAINSTORMING: 'brainstorming',
  ACTION_PLANNING: 'action_planning',
  LEARNING_SUMMARY: 'learning_summary'
};

export const TaskDifficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped'
};

/**
 * Task Schema
 */
export class Task {
  constructor() {
    this.id = null;
    this.type = null; // TaskType enum
    this.category = null; // From InterestCategory
    this.title = '';
    this.description = '';
    this.content = null; // Content to read or learn
    this.questions = []; // Array of questions for read_quiz
    this.expectedAnswer = null; // For reflection/brainstorming
    this.difficulty = TaskDifficulty.MEDIUM;
    this.estimatedMinutes = 5;
    this.xpReward = 10;
    this.status = TaskStatus.PENDING;
    this.userAnswer = null;
    this.completedAt = null;
    this.createdAt = null;
  }

  /**
   * Calculates XP based on difficulty and completion
   */
  calculateXP(isCorrect = true) {
    let baseXP = this.xpReward;
    
    if (this.difficulty === TaskDifficulty.EASY) {
      baseXP = 10;
    } else if (this.difficulty === TaskDifficulty.MEDIUM) {
      baseXP = 20;
    } else if (this.difficulty === TaskDifficulty.HARD) {
      baseXP = 35;
    }

    return isCorrect ? baseXP : Math.floor(baseXP * 0.5);
  }

  /**
   * Marks task as completed
   */
  complete(userAnswer = null) {
    this.status = TaskStatus.COMPLETED;
    this.userAnswer = userAnswer;
    this.completedAt = new Date().toISOString();
  }

  /**
   * Validates the task structure
   */
  validate() {
    const errors = [];

    if (!this.type || !Object.values(TaskType).includes(this.type)) {
      errors.push('Valid task type is required');
    }

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (this.type === TaskType.READ_QUIZ && (!this.questions || this.questions.length === 0)) {
      errors.push('READ_QUIZ tasks must have questions');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      category: this.category,
      title: this.title,
      description: this.description,
      content: this.content,
      questions: this.questions,
      expectedAnswer: this.expectedAnswer,
      difficulty: this.difficulty,
      estimatedMinutes: this.estimatedMinutes,
      xpReward: this.xpReward,
      status: this.status,
      userAnswer: this.userAnswer,
      completedAt: this.completedAt,
      createdAt: this.createdAt
    };
  }

  static fromJSON(json) {
    const task = new Task();
    Object.assign(task, json);
    return task;
  }
}

/**
 * Question Schema for READ_QUIZ tasks
 */
export class Question {
  constructor(text, options, correctAnswer) {
    this.text = text;
    this.options = options; // Array of strings
    this.correctAnswer = correctAnswer; // Index of correct option
    this.userAnswer = null;
  }

  isCorrect() {
    return this.userAnswer === this.correctAnswer;
  }
}
