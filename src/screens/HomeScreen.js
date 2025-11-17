/**
 * Home Screen
 * Main dashboard showing quick actions and daily overview
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { StorageService } from '../services/StorageService';

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userProfile = await StorageService.getUserProfile();
    const gamificationData = await StorageService.getGamificationProgress();
    setProfile(userProfile);
    setGamification(gamificationData);
    setLoading(false);
  };

  const startFocusSession = () => {
    navigation.navigate('FocusSession');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {profile?.name}! 👋</Text>
          <Text style={styles.subtitle}>Ready to beat doom scrolling?</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gamification?.level || 1}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gamification?.totalXP || 0}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gamification?.currentStreak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <Text style={styles.progressLabel}>Level Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${gamification?.getLevelProgress() || 0}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {gamification?.getLevelProgress() || 0}% to Level {(gamification?.level || 1) + 1}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.mainActionButton}
          onPress={startFocusSession}
        >
          <Text style={styles.mainActionIcon}>🔒</Text>
          <Text style={styles.mainActionTitle}>Start Focus Session</Text>
          <Text style={styles.mainActionSubtitle}>
            Lock your phone and complete tasks
          </Text>
        </TouchableOpacity>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('ScreenTimeInsights')}
          >
            <Text style={styles.quickActionIcon}>📊</Text>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Screen Time</Text>
              <Text style={styles.quickActionSubtitle}>View your usage stats</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Stats')}
          >
            <Text style={styles.quickActionIcon}>🏆</Text>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Stats & Achievements</Text>
              <Text style={styles.quickActionSubtitle}>Track your progress</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.quickActionIcon}>⚙️</Text>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Settings</Text>
              <Text style={styles.quickActionSubtitle}>Manage your profile</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            💡 "Every minute you focus is a step toward your goals!"
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  statsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  mainActionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    marginTop: 0,
    alignItems: 'center',
  },
  mainActionIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  mainActionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  mainActionSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  quickActionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  quickActionCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  motivationCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  motivationText: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
});
