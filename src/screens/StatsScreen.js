/**
 * Stats & Gamification Dashboard Screen
 * Shows user's progress, achievements, badges, and statistics
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { StorageService } from '../services/StorageService';

export default function StatsScreen() {
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await StorageService.getGamificationProgress();
    setGamification(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const summary = gamification.getAchievementSummary();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏆 Stats & Achievements</Text>
          <Text style={styles.headerSubtitle}>Your Progress Dashboard</Text>
        </View>

        <View style={styles.levelCard}>
          <Text style={styles.levelTitle}>Level {summary.level}</Text>
          <View style={styles.xpContainer}>
            <Text style={styles.xpText}>{summary.totalXP} XP</Text>
            <Text style={styles.xpNext}>Next: {summary.xpForNextLevel} XP</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${summary.levelProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {summary.levelProgress}% to Level {summary.level + 1}
          </Text>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View style={styles.streakInfo}>
              <Text style={styles.streakValue}>{summary.currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakValue}>{summary.longestStreak}</Text>
              <Text style={styles.streakLabel}>Best Streak</Text>
            </View>
          </View>
          <Text style={styles.streakMessage}>
            Keep it up! Complete a session today to maintain your streak.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>{summary.totalTasksCompleted}</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>{summary.totalSessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>{summary.totalFocusMinutes}</Text>
            <Text style={styles.statLabel}>Focus Minutes</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💪</Text>
            <Text style={styles.statValue}>{summary.totalDoomScrollMinutesSaved}</Text>
            <Text style={styles.statLabel}>Minutes Saved</Text>
          </View>
        </View>

        <View style={styles.weeklyCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.weeklyStats}>
            <View style={styles.weeklyItem}>
              <Text style={styles.weeklyLabel}>Focus Time</Text>
              <Text style={styles.weeklyValue}>
                {gamification.weeklyStats.focusMinutes} min
              </Text>
            </View>
            <View style={styles.weeklyItem}>
              <Text style={styles.weeklyLabel}>Tasks</Text>
              <Text style={styles.weeklyValue}>
                {gamification.weeklyStats.tasksCompleted}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.badgesCard}>
          <Text style={styles.cardTitle}>
            Badges ({summary.badgesUnlocked} unlocked)
          </Text>
          {gamification.badges.length === 0 ? (
            <Text style={styles.noBadgesText}>
              Complete sessions to unlock badges!
            </Text>
          ) : (
            <View style={styles.badgesGrid}>
              {gamification.badges.map((badge, index) => (
                <View
                  key={index}
                  style={[
                    styles.badgeItem,
                    !badge.isUnlocked && styles.badgeItemLocked
                  ]}
                >
                  <Text style={styles.badgeIcon}>
                    {badge.isUnlocked ? '🏅' : '🔒'}
                  </Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDescription}>{badge.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>Keep Going! 💫</Text>
          <Text style={styles.motivationText}>
            You're building incredible habits. Every session brings you closer to your goals.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  levelCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  xpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  xpNext: {
    fontSize: 14,
    color: '#999',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 14,
    color: '#999',
  },
  streakCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakIcon: {
    fontSize: 48,
    marginRight: 20,
  },
  streakInfo: {
    flex: 1,
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  streakLabel: {
    fontSize: 14,
    color: '#999',
  },
  streakMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 20,
    paddingTop: 0,
  },
  statCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  weeklyCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyItem: {
    alignItems: 'center',
  },
  weeklyLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  weeklyValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  badgesCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  noBadgesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  badgeItemLocked: {
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  motivationCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 24,
  },
});
