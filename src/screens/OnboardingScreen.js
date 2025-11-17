/**
 * Onboarding Screen
 * Multi-step onboarding flow to collect user information
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { UserProfile, UserRole, InterestCategory, GoalType, DistractingApp } from '../models/UserProfile';
import { StorageService } from '../services/StorageService';
import { GamificationProgress } from '../models/Gamification';

const STEPS = {
  NAME: 0,
  AGE: 1,
  ROLE: 2,
  INTERESTS: 3,
  GOALS: 4,
  APPS: 5,
  FOCUS_TARGET: 6
};

export default function OnboardingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(STEPS.NAME);
  const [profile, setProfile] = useState(new UserProfile());
  const [errors, setErrors] = useState([]);

  const handleNext = async () => {
    setErrors([]);

    if (currentStep === STEPS.NAME) {
      if (!profile.name || profile.name.trim().length === 0) {
        setErrors(['Please enter your name']);
        return;
      }
      setCurrentStep(STEPS.AGE);
    } else if (currentStep === STEPS.AGE) {
      if (!profile.age || profile.age < 13 || profile.age > 120) {
        setErrors(['Please enter a valid age (13-120)']);
        return;
      }
      setCurrentStep(STEPS.ROLE);
    } else if (currentStep === STEPS.ROLE) {
      if (!profile.role) {
        setErrors(['Please select your role']);
        return;
      }
      setCurrentStep(STEPS.INTERESTS);
    } else if (currentStep === STEPS.INTERESTS) {
      if (profile.interests.length === 0) {
        setErrors(['Please select at least one interest']);
        return;
      }
      setCurrentStep(STEPS.GOALS);
    } else if (currentStep === STEPS.GOALS) {
      if (profile.goals.length === 0) {
        setErrors(['Please select at least one goal']);
        return;
      }
      setCurrentStep(STEPS.APPS);
    } else if (currentStep === STEPS.APPS) {
      setCurrentStep(STEPS.FOCUS_TARGET);
    } else if (currentStep === STEPS.FOCUS_TARGET) {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.NAME) {
      setCurrentStep(currentStep - 1);
      setErrors([]);
    }
  };

  const completeOnboarding = async () => {
    profile.id = `user_${Date.now()}`;
    profile.createdAt = new Date().toISOString();
    profile.updatedAt = profile.createdAt;

    const validation = profile.validate();
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    await StorageService.saveUserProfile(profile);
    
    const gamificationProgress = new GamificationProgress();
    gamificationProgress.userId = profile.id;
    gamificationProgress.createdAt = new Date().toISOString();
    await StorageService.saveGamificationProgress(gamificationProgress);

    navigation.replace('Home');
  };

  const toggleSelection = (field, value) => {
    const newProfile = { ...profile };
    const array = newProfile[field];
    const index = array.indexOf(value);
    
    if (index >= 0) {
      array.splice(index, 1);
    } else {
      array.push(value);
    }
    
    setProfile(newProfile);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.NAME:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Welcome to Unfreeze! 👋</Text>
            <Text style={styles.subtitle}>Let's get to know you</Text>
            <Text style={styles.label}>What's your name?</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>
        );

      case STEPS.AGE:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>How old are you?</Text>
            <Text style={styles.subtitle}>This helps us personalize your experience</Text>
            <TextInput
              style={styles.input}
              value={profile.age ? profile.age.toString() : ''}
              onChangeText={(text) => setProfile({ ...profile, age: parseInt(text) || null })}
              placeholder="Enter your age"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>
        );

      case STEPS.ROLE:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>What describes you best?</Text>
            <Text style={styles.subtitle}>Select your current role</Text>
            {Object.entries(UserRole).map(([key, value]) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.optionButton,
                  profile.role === value && styles.selectedOption
                ]}
                onPress={() => setProfile({ ...profile, role: value })}
              >
                <Text style={[
                  styles.optionText,
                  profile.role === value && styles.selectedOptionText
                ]}>
                  {key.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case STEPS.INTERESTS:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>What are you interested in?</Text>
            <Text style={styles.subtitle}>Select all that apply</Text>
            <ScrollView style={styles.scrollContent}>
              {Object.entries(InterestCategory).map(([key, value]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.optionButton,
                    profile.interests.includes(value) && styles.selectedOption
                  ]}
                  onPress={() => toggleSelection('interests', value)}
                >
                  <Text style={[
                    styles.optionText,
                    profile.interests.includes(value) && styles.selectedOptionText
                  ]}>
                    {key.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case STEPS.GOALS:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>What are your goals?</Text>
            <Text style={styles.subtitle}>Select all that apply</Text>
            <ScrollView style={styles.scrollContent}>
              {Object.entries(GoalType).map(([key, value]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.optionButton,
                    profile.goals.includes(value) && styles.selectedOption
                  ]}
                  onPress={() => toggleSelection('goals', value)}
                >
                  <Text style={[
                    styles.optionText,
                    profile.goals.includes(value) && styles.selectedOptionText
                  ]}>
                    {key.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case STEPS.APPS:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Which apps do you spend time on?</Text>
            <Text style={styles.subtitle}>Select the apps you want to reduce usage of</Text>
            <ScrollView style={styles.scrollContent}>
              {Object.entries(DistractingApp).map(([key, value]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.optionButton,
                    profile.distractingApps.includes(value) && styles.selectedOption
                  ]}
                  onPress={() => toggleSelection('distractingApps', value)}
                >
                  <Text style={[
                    styles.optionText,
                    profile.distractingApps.includes(value) && styles.selectedOptionText
                  ]}>
                    {key.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case STEPS.FOCUS_TARGET:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Daily Focus Target</Text>
            <Text style={styles.subtitle}>How many minutes do you want to focus daily?</Text>
            <TextInput
              style={styles.input}
              value={profile.dailyFocusTargetMinutes ? profile.dailyFocusTargetMinutes.toString() : '30'}
              onChangeText={(text) => setProfile({ ...profile, dailyFocusTargetMinutes: parseInt(text) || 30 })}
              placeholder="Enter target minutes (20-60)"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
            <Text style={styles.helperText}>Recommended: 20-60 minutes per day</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / 7) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>Step {currentStep + 1} of 7</Text>
      </View>

      {renderStepContent()}

      {errors.length > 0 && (
        <View style={styles.errorContainer}>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>{error}</Text>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        {currentStep > STEPS.NAME && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === STEPS.FOCUS_TARGET ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  progressContainer: {
    padding: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  helperText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#333',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ff4444',
    margin: 20,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
