/**
 * Storage Service
 * Handles data persistence using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../models/UserProfile';
import { Session } from '../models/Session';
import { Task } from '../models/Task';
import { GamificationProgress } from '../models/Gamification';
import { ScreenTimeData } from '../models/ScreenTimeData';

const KEYS = {
  USER_PROFILE: '@unfreeze:user_profile',
  GAMIFICATION: '@unfreeze:gamification',
  SESSIONS: '@unfreeze:sessions',
  TASKS: '@unfreeze:tasks',
  SCREEN_TIME: '@unfreeze:screen_time',
  SETTINGS: '@unfreeze:settings'
};

export class StorageService {
  /**
   * Save user profile
   */
  static async saveUserProfile(userProfile) {
    try {
      const json = JSON.stringify(userProfile.toJSON());
      await AsyncStorage.setItem(KEYS.USER_PROFILE, json);
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile() {
    try {
      const json = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      if (json) {
        return UserProfile.fromJSON(JSON.parse(json));
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  /**
   * Save gamification progress
   */
  static async saveGamificationProgress(progress) {
    try {
      const json = JSON.stringify(progress.toJSON());
      await AsyncStorage.setItem(KEYS.GAMIFICATION, json);
      return true;
    } catch (error) {
      console.error('Error saving gamification progress:', error);
      return false;
    }
  }

  /**
   * Get gamification progress
   */
  static async getGamificationProgress() {
    try {
      const json = await AsyncStorage.getItem(KEYS.GAMIFICATION);
      if (json) {
        return GamificationProgress.fromJSON(JSON.parse(json));
      }
      return new GamificationProgress();
    } catch (error) {
      console.error('Error loading gamification progress:', error);
      return new GamificationProgress();
    }
  }

  /**
   * Save session
   */
  static async saveSession(session) {
    try {
      const sessions = await this.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session.toJSON();
      } else {
        sessions.push(session.toJSON());
      }

      const json = JSON.stringify(sessions);
      await AsyncStorage.setItem(KEYS.SESSIONS, json);
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  }

  /**
   * Get all sessions
   */
  static async getAllSessions() {
    try {
      const json = await AsyncStorage.getItem(KEYS.SESSIONS);
      if (json) {
        const sessionsData = JSON.parse(json);
        return sessionsData.map(s => Session.fromJSON(s));
      }
      return [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  /**
   * Get sessions by date range
   */
  static async getSessionsByDateRange(startDate, endDate) {
    try {
      const sessions = await this.getAllSessions();
      return sessions.filter(session => {
        const sessionDate = new Date(session.createdAt);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
    } catch (error) {
      console.error('Error loading sessions by date:', error);
      return [];
    }
  }

  /**
   * Save task
   */
  static async saveTask(task) {
    try {
      const tasks = await this.getAllTasks();
      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex >= 0) {
        tasks[existingIndex] = task.toJSON();
      } else {
        tasks.push(task.toJSON());
      }

      const json = JSON.stringify(tasks);
      await AsyncStorage.setItem(KEYS.TASKS, json);
      return true;
    } catch (error) {
      console.error('Error saving task:', error);
      return false;
    }
  }

  /**
   * Get all tasks
   */
  static async getAllTasks() {
    try {
      const json = await AsyncStorage.getItem(KEYS.TASKS);
      if (json) {
        const tasksData = JSON.parse(json);
        return tasksData.map(t => Task.fromJSON(t));
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  /**
   * Get task by ID
   */
  static async getTaskById(taskId) {
    try {
      const tasks = await this.getAllTasks();
      return tasks.find(t => t.id === taskId) || null;
    } catch (error) {
      console.error('Error loading task:', error);
      return null;
    }
  }

  /**
   * Save screen time data
   */
  static async saveScreenTimeData(data) {
    try {
      const allData = await this.getAllScreenTimeData();
      const existingIndex = allData.findIndex(d => d.date === data.date);
      
      if (existingIndex >= 0) {
        allData[existingIndex] = data.toJSON();
      } else {
        allData.push(data.toJSON());
      }

      const json = JSON.stringify(allData);
      await AsyncStorage.setItem(KEYS.SCREEN_TIME, json);
      return true;
    } catch (error) {
      console.error('Error saving screen time data:', error);
      return false;
    }
  }

  /**
   * Get all screen time data
   */
  static async getAllScreenTimeData() {
    try {
      const json = await AsyncStorage.getItem(KEYS.SCREEN_TIME);
      if (json) {
        const dataArray = JSON.parse(json);
        return dataArray.map(d => ScreenTimeData.fromJSON(d));
      }
      return [];
    } catch (error) {
      console.error('Error loading screen time data:', error);
      return [];
    }
  }

  /**
   * Get screen time data for a specific date
   */
  static async getScreenTimeDataByDate(date) {
    try {
      const allData = await this.getAllScreenTimeData();
      return allData.find(d => d.date === date) || null;
    } catch (error) {
      console.error('Error loading screen time data by date:', error);
      return null;
    }
  }

  /**
   * Clear all data (for testing or reset)
   */
  static async clearAllData() {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  /**
   * Check if onboarding is completed
   */
  static async isOnboardingCompleted() {
    const profile = await this.getUserProfile();
    return profile !== null;
  }
}
