/**
 * Task Generator Service
 * Generates personalized tasks based on user profile, interests, and goals
 */

import { Task, TaskType, TaskDifficulty, Question } from '../models/Task';
import { InterestCategory, GoalType } from '../models/UserProfile';

/**
 * Task templates organized by interest category
 */
const TASK_TEMPLATES = {
  [InterestCategory.BUSINESS]: {
    [TaskType.READ_QUIZ]: [
      {
        title: 'Pricing Strategies',
        content: 'Cost-plus pricing adds a markup to costs. Value-based pricing charges based on customer perceived value. Competitive pricing matches or undercuts competitors. Penetration pricing starts low to gain market share. Premium pricing positions as high-quality.',
        questions: [
          new Question(
            'Which pricing strategy focuses on customer perception?',
            ['Cost-plus', 'Value-based', 'Competitive', 'Penetration'],
            1
          ),
          new Question(
            'What is the goal of penetration pricing?',
            ['High profit margins', 'Premium positioning', 'Gain market share', 'Cover costs only'],
            2
          )
        ]
      },
      {
        title: 'Market Analysis',
        content: 'Market analysis involves studying your target audience, competitors, and industry trends. Key components include: market size, customer demographics, buying behavior, competition strength, and growth opportunities.',
        questions: [
          new Question(
            'What is NOT typically part of market analysis?',
            ['Customer demographics', 'Product development', 'Competition strength', 'Market size'],
            1
          )
        ]
      }
    ],
    [TaskType.REFLECTION]: [
      {
        title: 'Business Opportunity Reflection',
        description: 'Identify a problem in your daily life that could be solved with a business solution.',
        prompt: 'Write down one problem you\'ve noticed recently and how it could be turned into a business opportunity.'
      }
    ],
    [TaskType.BRAINSTORMING]: [
      {
        title: 'Revenue Stream Ideas',
        description: 'Generate ideas for monetizing a skill or hobby.',
        prompt: 'List 5 ways you could generate income from a skill you already have.'
      }
    ]
  },

  [InterestCategory.CODING]: {
    [TaskType.READ_QUIZ]: [
      {
        title: 'Algorithm Complexity',
        content: 'Big O notation describes algorithm efficiency. O(1) is constant time, O(n) is linear, O(n²) is quadratic, O(log n) is logarithmic. Lower complexity means better performance for large inputs.',
        questions: [
          new Question(
            'Which has the best performance for large datasets?',
            ['O(n²)', 'O(n)', 'O(log n)', 'O(n log n)'],
            2
          ),
          new Question(
            'What does O(1) represent?',
            ['Linear time', 'Constant time', 'Logarithmic time', 'Quadratic time'],
            1
          )
        ]
      }
    ],
    [TaskType.REFLECTION]: [
      {
        title: 'Code Review Reflection',
        description: 'Think about your recent code and how to improve it.',
        prompt: 'Write down one coding practice you want to improve and why it matters.'
      }
    ],
    [TaskType.ACTION_PLANNING]: [
      {
        title: 'Learning Plan',
        description: 'Create a structured learning plan for a new technology.',
        prompt: 'Choose a technology you want to learn and write 3 specific steps to start learning it this week.'
      }
    ]
  },

  [InterestCategory.FITNESS]: {
    [TaskType.READ_QUIZ]: [
      {
        title: 'Nutrition Basics',
        content: 'Macronutrients include proteins (4 cal/g), carbohydrates (4 cal/g), and fats (9 cal/g). Proteins build muscle, carbs provide energy, fats support hormones. A balanced diet includes all three in appropriate ratios.',
        questions: [
          new Question(
            'Which macronutrient has the most calories per gram?',
            ['Protein', 'Carbohydrates', 'Fats', 'All are equal'],
            2
          )
        ]
      }
    ],
    [TaskType.REFLECTION]: [
      {
        title: 'Fitness Goals Reflection',
        description: 'Reflect on your fitness journey and set clear goals.',
        prompt: 'Write down your primary fitness goal and one specific action you can take today to move toward it.'
      }
    ],
    [TaskType.ACTION_PLANNING]: [
      {
        title: 'Weekly Workout Plan',
        description: 'Plan your exercise routine for the week.',
        prompt: 'Create a simple 3-day workout plan with specific exercises for each day.'
      }
    ]
  },

  [InterestCategory.FINANCE]: {
    [TaskType.READ_QUIZ]: [
      {
        title: 'Investment Basics',
        content: 'Stocks represent ownership in companies. Bonds are loans to companies/governments. Index funds diversify across many stocks. Risk and return are correlated - higher potential returns usually mean higher risk.',
        questions: [
          new Question(
            'What does a stock represent?',
            ['A loan', 'Ownership', 'Insurance', 'Savings'],
            1
          ),
          new Question(
            'What is the relationship between risk and return?',
            ['Inverse', 'No relationship', 'Correlated', 'Random'],
            2
          )
        ]
      }
    ],
    [TaskType.BRAINSTORMING]: [
      {
        title: 'Savings Strategies',
        description: 'Brainstorm ways to reduce expenses and increase savings.',
        prompt: 'List 5 specific ways you could reduce monthly expenses without major lifestyle changes.'
      }
    ]
  },

  [InterestCategory.BOOKS]: {
    [TaskType.READ_QUIZ]: [
      {
        title: 'Speed Reading Techniques',
        content: 'Speed reading techniques include: chunking (reading groups of words), minimizing subvocalization (inner speech), using a pointer to guide eyes, and eliminating regression (re-reading). Practice improves reading speed while maintaining comprehension.',
        questions: [
          new Question(
            'What is subvocalization?',
            ['Reading aloud', 'Inner speech while reading', 'Skipping words', 'Re-reading text'],
            1
          )
        ]
      }
    ],
    [TaskType.REFLECTION]: [
      {
        title: 'Book Insights',
        description: 'Reflect on what you\'ve learned from recent reading.',
        prompt: 'Write down one key insight from something you recently read and how you can apply it.'
      }
    ]
  },

  [InterestCategory.MARKETING]: {
    [TaskType.READ_QUIZ]: [
      {
        title: 'Digital Marketing Channels',
        content: 'Key digital marketing channels: SEO (organic search), SEM (paid search), Social Media, Email Marketing, Content Marketing, and Influencer Marketing. Each has unique strengths for different business goals.',
        questions: [
          new Question(
            'Which channel focuses on organic search results?',
            ['SEM', 'SEO', 'Email', 'Social Media'],
            1
          )
        ]
      }
    ],
    [TaskType.BRAINSTORMING]: [
      {
        title: 'Campaign Ideas',
        description: 'Generate creative marketing campaign ideas.',
        prompt: 'Choose a product and write down 3 creative ways to market it on social media.'
      }
    ]
  },

  [InterestCategory.PERSONAL_GROWTH]: {
    [TaskType.REFLECTION]: [
      {
        title: 'Daily Gratitude',
        description: 'Practice gratitude to improve mental well-being.',
        prompt: 'Write down 3 things you\'re grateful for today and why they matter to you.'
      },
      {
        title: 'Goal Progress',
        description: 'Reflect on your progress toward personal goals.',
        prompt: 'Choose one personal goal and write about one small step you took toward it recently.'
      }
    ],
    [TaskType.BRAINSTORMING]: [
      {
        title: 'Habit Building',
        description: 'Identify habits that could improve your life.',
        prompt: 'List 5 small habits you could start that would make a positive impact on your daily life.'
      }
    ]
  },

  [InterestCategory.CAREER]: {
    [TaskType.READ_QUIZ]: [
      {
        title: 'Professional Networking',
        content: 'Effective networking involves: building genuine relationships, offering value before asking, following up consistently, attending industry events, and maintaining an updated professional profile. Quality matters more than quantity.',
        questions: [
          new Question(
            'What is most important in networking?',
            ['Quantity of connections', 'Genuine relationships', 'Asking for favors', 'Self-promotion'],
            1
          )
        ]
      }
    ],
    [TaskType.ACTION_PLANNING]: [
      {
        title: 'Career Development Plan',
        description: 'Plan specific actions for career growth.',
        prompt: 'Write down 3 concrete actions you can take this month to advance your career.'
      }
    ]
  }
};

/**
 * TaskGenerator class
 */
export class TaskGenerator {
  /**
   * Generates tasks based on user profile
   * @param {UserProfile} userProfile
   * @param {number} count - Number of tasks to generate
   * @returns {Array<Task>} Array of generated tasks
   */
  static generateTasks(userProfile, count = 3) {
    const tasks = [];
    const interests = userProfile.interests;
    const goals = userProfile.goals;

    // Prioritize interests based on goals
    const prioritizedInterests = this.prioritizeInterests(interests, goals);

    for (let i = 0; i < count; i++) {
      const interest = prioritizedInterests[i % prioritizedInterests.length];
      const task = this.generateTaskForInterest(interest, userProfile);
      if (task) {
        tasks.push(task);
      }
    }

    return tasks;
  }

  /**
   * Prioritizes interests based on user goals
   */
  static prioritizeInterests(interests, goals) {
    const priorityMap = {
      [GoalType.EXAM_PREP]: [InterestCategory.BOOKS, InterestCategory.PERSONAL_GROWTH],
      [GoalType.STARTUP_BUILDING]: [InterestCategory.BUSINESS, InterestCategory.MARKETING],
      [GoalType.CAREER_GROWTH]: [InterestCategory.CAREER, InterestCategory.PERSONAL_GROWTH],
      [GoalType.SKILL_DEVELOPMENT]: [InterestCategory.CODING, InterestCategory.CAREER],
      [GoalType.FITNESS_HEALTH]: [InterestCategory.FITNESS, InterestCategory.PERSONAL_GROWTH]
    };

    const prioritized = new Set();
    
    // Add interests aligned with goals first
    goals.forEach(goal => {
      const relatedInterests = priorityMap[goal] || [];
      relatedInterests.forEach(interest => {
        if (interests.includes(interest)) {
          prioritized.add(interest);
        }
      });
    });

    // Add remaining interests
    interests.forEach(interest => prioritized.add(interest));

    return Array.from(prioritized);
  }

  /**
   * Generates a single task for a specific interest
   */
  static generateTaskForInterest(interest, userProfile) {
    const templates = TASK_TEMPLATES[interest];
    if (!templates) return null;

    // Select task type based on variety
    const taskTypes = Object.keys(templates);
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const typeTemplates = templates[taskType];
    
    if (!typeTemplates || typeTemplates.length === 0) return null;

    const template = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
    
    const task = new Task();
    task.id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    task.type = taskType;
    task.category = interest;
    task.title = template.title;
    task.createdAt = new Date().toISOString();

    if (taskType === TaskType.READ_QUIZ) {
      task.description = 'Read the content and answer the questions';
      task.content = template.content;
      task.questions = template.questions;
      task.difficulty = template.questions.length > 2 ? TaskDifficulty.MEDIUM : TaskDifficulty.EASY;
      task.estimatedMinutes = 3 + template.questions.length;
    } else if (taskType === TaskType.REFLECTION) {
      task.description = template.description;
      task.content = template.prompt;
      task.difficulty = TaskDifficulty.EASY;
      task.estimatedMinutes = 5;
    } else if (taskType === TaskType.BRAINSTORMING) {
      task.description = template.description;
      task.content = template.prompt;
      task.difficulty = TaskDifficulty.MEDIUM;
      task.estimatedMinutes = 7;
    } else if (taskType === TaskType.ACTION_PLANNING) {
      task.description = template.description;
      task.content = template.prompt;
      task.difficulty = TaskDifficulty.MEDIUM;
      task.estimatedMinutes = 8;
    }

    task.xpReward = task.calculateXP();

    return task;
  }

  /**
   * Generates a diverse set of tasks ensuring variety
   */
  static generateDiverseTasks(userProfile, count = 3) {
    const tasks = [];
    const usedTypes = new Set();
    const interests = this.prioritizeInterests(userProfile.interests, userProfile.goals);

    for (let i = 0; i < count && i < interests.length * 3; i++) {
      const interest = interests[i % interests.length];
      const task = this.generateTaskForInterest(interest, userProfile);
      
      if (task && !usedTypes.has(task.type)) {
        tasks.push(task);
        usedTypes.add(task.type);
      } else if (task && tasks.length < count) {
        tasks.push(task);
      }

      if (tasks.length >= count) break;
    }

    return tasks;
  }
}
