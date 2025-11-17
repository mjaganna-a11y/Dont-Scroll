/**
 * Screen Time Insights Screen
 * Shows user's screen time data and usage patterns
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { ScreenTimeData, AppUsage, AppCategory } from '../models/ScreenTimeData';
import { StorageService } from '../services/StorageService';

export default function ScreenTimeInsightsScreen() {
  const [screenTimeData, setScreenTimeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScreenTimeData();
  }, []);

  const loadScreenTimeData = async () => {
    const today = new Date().toISOString().split('T')[0];
    let data = await StorageService.getScreenTimeDataByDate(today);

    // If no data, create mock data for demonstration
    if (!data) {
      data = createMockScreenTimeData();
      await StorageService.saveScreenTimeData(data);
    }

    setScreenTimeData(data);
    setLoading(false);
  };

  const createMockScreenTimeData = () => {
    const data = new ScreenTimeData();
    data.userId = 'user_1';
    data.date = new Date().toISOString().split('T')[0];
    data.totalScreenTimeMinutes = 320; // 5h 20m
    data.appUsages = [
      new AppUsage('Instagram', 'com.instagram', AppCategory.SOCIAL_MEDIA, 150),
      new AppUsage('YouTube', 'com.youtube', AppCategory.ENTERTAINMENT, 80),
      new AppUsage('WhatsApp', 'com.whatsapp', AppCategory.COMMUNICATION, 40),
      new AppUsage('Chrome', 'com.chrome', AppCategory.PRODUCTIVITY, 30),
      new AppUsage('Games', 'com.games', AppCategory.GAMES, 20)
    ];
    data.createdAt = new Date().toISOString();
    data.analyze();
    return data;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const healthAssessment = screenTimeData.getHealthAssessment();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 Screen Time Insights</Text>
          <Text style={styles.headerSubtitle}>Today's Usage</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.totalTime}>
            {screenTimeData.formatTime(screenTimeData.totalScreenTimeMinutes)}
          </Text>
          <Text style={styles.totalLabel}>Total Screen Time</Text>

          <View style={[styles.healthBadge, { backgroundColor: healthAssessment.color }]}>
            <Text style={styles.healthLevel}>{healthAssessment.level.toUpperCase()}</Text>
          </View>
          <Text style={styles.healthMessage}>{healthAssessment.message}</Text>
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.cardTitle}>Time Breakdown</Text>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownLabel}>🎯 Productive</Text>
              <Text style={styles.breakdownValue}>
                {screenTimeData.getProductivityPercentage()}%
              </Text>
            </View>
            <View style={styles.breakdownBar}>
              <View
                style={[
                  styles.breakdownFill,
                  {
                    width: `${screenTimeData.getProductivityPercentage()}%`,
                    backgroundColor: '#4CAF50'
                  }
                ]}
              />
            </View>
            <Text style={styles.breakdownTime}>
              {screenTimeData.formatTime(screenTimeData.productiveTimeMinutes)}
            </Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownLabel}>🎮 Entertainment</Text>
              <Text style={styles.breakdownValue}>
                {screenTimeData.getEntertainmentPercentage()}%
              </Text>
            </View>
            <View style={styles.breakdownBar}>
              <View
                style={[
                  styles.breakdownFill,
                  {
                    width: `${screenTimeData.getEntertainmentPercentage()}%`,
                    backgroundColor: '#FF9800'
                  }
                ]}
              />
            </View>
            <Text style={styles.breakdownTime}>
              {screenTimeData.formatTime(screenTimeData.entertainmentTimeMinutes)}
            </Text>
          </View>
        </View>

        <View style={styles.topAppsCard}>
          <Text style={styles.cardTitle}>Top Apps</Text>
          {screenTimeData.topApps.map((app, index) => (
            <View key={index} style={styles.appItem}>
              <View style={styles.appRank}>
                <Text style={styles.appRankText}>{index + 1}</Text>
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>{app.appName}</Text>
                <Text style={styles.appCategory}>
                  {app.category.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.appTime}>
                {screenTimeData.formatTime(app.timeSpentMinutes)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>💡 Insights</Text>
          <Text style={styles.feedbackText}>
            {screenTimeData.getFeedbackMessage()}
          </Text>
        </View>

        <View style={styles.educationCard}>
          <Text style={styles.educationTitle}>📚 Did You Know?</Text>
          <Text style={styles.educationText}>
            Research shows that excessive screen time (over 6 hours daily) can lead to:
          </Text>
          <Text style={styles.educationBullet}>• Reduced productivity and focus</Text>
          <Text style={styles.educationBullet}>• Sleep disruption and fatigue</Text>
          <Text style={styles.educationBullet}>• Increased stress and anxiety</Text>
          <Text style={styles.educationBullet}>• Less time for meaningful activities</Text>
          <Text style={styles.educationFooter}>
            The recommended healthy screen time is 2-4 hours per day for adults.
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
  summaryCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  totalTime: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  healthBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  healthLevel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  healthMessage: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  breakdownCard: {
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
  breakdownItem: {
    marginBottom: 20,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 16,
    color: '#fff',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  breakdownBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  breakdownFill: {
    height: '100%',
  },
  breakdownTime: {
    fontSize: 14,
    color: '#999',
  },
  topAppsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  appRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appRankText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
  },
  appCategory: {
    fontSize: 12,
    color: '#999',
  },
  appTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  feedbackCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 24,
  },
  educationCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  educationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  educationText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 12,
  },
  educationBullet: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 24,
    paddingLeft: 8,
  },
  educationFooter: {
    fontSize: 14,
    color: '#4CAF50',
    lineHeight: 24,
    marginTop: 12,
    fontWeight: '600',
  },
});
