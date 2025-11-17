/**
 * Settings & Profile Edit Screen
 * Allows users to view and edit their profile and app settings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { StorageService } from '../services/StorageService';

export default function SettingsScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await StorageService.getUserProfile();
    setProfile(userProfile);
    setLoading(false);
  };

  const handleSave = async () => {
    const validation = profile.validate();
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    profile.updatedAt = new Date().toISOString();
    await StorageService.saveUserProfile(profile);
    setEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure? This will delete all your progress, sessions, and stats. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAllData();
            navigation.replace('Onboarding');
          }
        }
      ]
    );
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
          <Text style={styles.headerTitle}>⚙️ Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your profile and preferences</Text>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Profile Information</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="Your name"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.name}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Age</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={profile.age?.toString()}
                onChangeText={(text) => setProfile({ ...profile, age: parseInt(text) || null })}
                placeholder="Your age"
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.age}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Role</Text>
            <Text style={styles.fieldValue}>
              {profile.role?.replace('_', ' ').toUpperCase()}
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Interests</Text>
            <View style={styles.tagsContainer}>
              {profile.interests.map((interest, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>
                    {interest.replace('_', ' ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Goals</Text>
            <View style={styles.tagsContainer}>
              {profile.goals.map((goal, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>
                    {goal.replace('_', ' ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Daily Focus Target</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={profile.dailyFocusTargetMinutes?.toString()}
                onChangeText={(text) =>
                  setProfile({ ...profile, dailyFocusTargetMinutes: parseInt(text) || 30 })
                }
                placeholder="Target minutes"
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profile.dailyFocusTargetMinutes} minutes
              </Text>
            )}
          </View>

          {editing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditing(false);
                  loadProfile();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>App Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>Coming Soon</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Scheduled Sessions</Text>
            <Text style={styles.settingValue}>Coming Soon</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Theme</Text>
            <Text style={styles.settingValue}>Dark</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.privacyCard}>
          <Text style={styles.cardTitle}>Privacy & Data</Text>
          <Text style={styles.privacyText}>
            Unfreeze only collects usage data to personalize your experience. We don't read
            your messages or access personal content. All data is stored locally on your device.
          </Text>
        </View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetData}
          >
            <Text style={styles.resetButtonText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Unfreeze - Anti Doom Scroll App</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  profileCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 10,
  },
  settingsCard: {
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
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
  },
  privacyCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  privacyText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 22,
  },
  dangerZone: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
  },
});
