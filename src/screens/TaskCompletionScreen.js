/**
 * Task Completion Screen
 * Shows results after completing a focus session
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';

export default function TaskCompletionScreen({ route, navigation }) {
  const { session, tasks } = route.params;

  const handleContinue = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationIcon}>🎉</Text>
          <Text style={styles.celebrationTitle}>Session Complete!</Text>
          <Text style={styles.celebrationSubtitle}>
            You've conquered doom scrolling!
          </Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Session Summary</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Tasks Completed</Text>
            <Text style={styles.statValue}>{session.completedTasks.length}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{session.durationMinutes} min</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>XP Earned</Text>
            <Text style={styles.statValueHighlight}>+{session.xpEarned} XP</Text>
          </View>
        </View>

        <View style={styles.tasksCard}>
          <Text style={styles.tasksTitle}>Completed Tasks</Text>
          {tasks.map((task, index) => (
            <View key={task.id} style={styles.taskItem}>
              <Text style={styles.taskIcon}>✅</Text>
              <View style={styles.taskInfo}>
                <Text style={styles.taskName}>{task.title}</Text>
                <Text style={styles.taskXP}>+{task.xpReward} XP</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            🌟 Great job! You're building better habits one session at a time.
          </Text>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 20,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  celebrationIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 18,
    color: '#999',
  },
  statsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statLabel: {
    fontSize: 16,
    color: '#999',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statValueHighlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tasksCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
  },
  taskXP: {
    fontSize: 14,
    color: '#4CAF50',
  },
  motivationCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  motivationText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
