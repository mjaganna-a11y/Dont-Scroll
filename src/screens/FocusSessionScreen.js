/**
 * Focus Session Screen
 * Freeze screen that displays tasks and prevents exit until completion
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert
} from 'react-native';
import { Session, SessionStatus, SessionType } from '../models/Session';
import { TaskGenerator } from '../services/TaskGenerator';
import { StorageService } from '../services/StorageService';
import { TaskStatus } from '../models/Task';

export default function FocusSessionScreen({ navigation }) {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyStep, setEmergencyStep] = useState(0);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    const profile = await StorageService.getUserProfile();
    
    // Generate tasks
    const generatedTasks = TaskGenerator.generateDiverseTasks(profile, 3);
    setTasks(generatedTasks);

    // Create session
    const newSession = new Session();
    newSession.id = `session_${Date.now()}`;
    newSession.userId = profile.id;
    newSession.type = SessionType.MANUAL;
    newSession.tasks = generatedTasks.map(t => t.id);
    newSession.start();

    setSession(newSession);
    setLoading(false);

    // Save tasks
    for (const task of generatedTasks) {
      await StorageService.saveTask(task);
    }
    await StorageService.saveSession(newSession);
  };

  const handleTaskComplete = async (taskId, answer) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const updatedTasks = [...tasks];
    const task = updatedTasks[taskIndex];
    task.complete(answer);

    // Calculate XP
    const xpEarned = task.calculateXP(true);
    session.completeTask(taskId, xpEarned);

    // Update storage
    await StorageService.saveTask(task);
    await StorageService.saveSession(session);

    setTasks(updatedTasks);

    // Move to next task or complete session
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    session.complete();
    await StorageService.saveSession(session);

    // Update gamification
    const gamification = await StorageService.getGamificationProgress();
    gamification.recordSession(session);
    await StorageService.saveGamificationProgress(gamification);

    // Navigate to completion screen
    navigation.replace('TaskCompletion', { session, tasks });
  };

  const handleEmergencyExit = () => {
    setShowEmergencyModal(true);
    setEmergencyStep(0);
  };

  const confirmEmergencyExit = async () => {
    if (emergencyStep < 2) {
      setEmergencyStep(emergencyStep + 1);
      return;
    }

    session.emergencyExit();
    await StorageService.saveSession(session);
    
    Alert.alert(
      'Session Cancelled',
      'You used emergency exit. No XP was earned.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  if (loading || !session || tasks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Preparing your tasks...</Text>
      </SafeAreaView>
    );
  }

  const currentTask = tasks[currentTaskIndex];
  const progress = session.getProgress();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔒 Focus Mode Active</Text>
        <Text style={styles.progressText}>
          Task {currentTaskIndex + 1} of {tasks.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskCategory}>
              {currentTask.category.replace('_', ' ').toUpperCase()}
            </Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{currentTask.xpReward} XP</Text>
            </View>
          </View>

          <Text style={styles.taskTitle}>{currentTask.title}</Text>
          <Text style={styles.taskDescription}>{currentTask.description}</Text>

          {currentTask.content && (
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{currentTask.content}</Text>
            </View>
          )}

          {currentTask.questions && currentTask.questions.length > 0 && (
            <View style={styles.questionsContainer}>
              {currentTask.questions.map((question, qIndex) => (
                <View key={qIndex} style={styles.questionBox}>
                  <Text style={styles.questionText}>
                    Q{qIndex + 1}. {question.text}
                  </Text>
                  {question.options.map((option, oIndex) => (
                    <TouchableOpacity
                      key={oIndex}
                      style={[
                        styles.optionButton,
                        question.userAnswer === oIndex && styles.selectedOption
                      ]}
                      onPress={() => {
                        question.userAnswer = oIndex;
                        setTasks([...tasks]);
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        question.userAnswer === oIndex && styles.selectedOptionText
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleTaskComplete(currentTask.id, 'completed')}
          >
            <Text style={styles.completeButtonText}>
              {currentTaskIndex < tasks.length - 1 ? 'Next Task' : 'Complete Session'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.estimatedTime}>
          ⏱️ Estimated time: {currentTask.estimatedMinutes} minutes
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergencyExit}
      >
        <Text style={styles.emergencyButtonText}>🚨 Emergency Exit</Text>
      </TouchableOpacity>

      <Modal
        visible={showEmergencyModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Emergency Exit</Text>
            {emergencyStep === 0 && (
              <Text style={styles.modalText}>
                Are you sure you want to exit? You'll lose all progress and XP from this session.
              </Text>
            )}
            {emergencyStep === 1 && (
              <Text style={styles.modalText}>
                This will break your streak. Are you really sure?
              </Text>
            )}
            {emergencyStep === 2 && (
              <Text style={styles.modalText}>
                Final confirmation: Exit session now?
              </Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEmergencyModal(false)}
              >
                <Text style={styles.modalCancelText}>Stay in Session</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmEmergencyExit}
              >
                <Text style={styles.modalConfirmText}>
                  {emergencyStep < 2 ? 'Continue' : 'Exit Now'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  taskCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskCategory: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  xpBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  contentBox: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  contentText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 24,
  },
  questionsContainer: {
    marginBottom: 20,
  },
  questionBox: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    fontWeight: '600',
  },
  optionButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 15,
    color: '#fff',
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  estimatedTime: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
  emergencyButton: {
    backgroundColor: '#ff4444',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
