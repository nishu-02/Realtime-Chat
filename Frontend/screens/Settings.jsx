import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import useGlobal from '../core/globalStore';

function SettingsSection({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function SettingsItem({ icon, label, value, onPress, rightComponent }) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.itemLeft}>
        {icon && (
          <FontAwesomeIcon icon={icon} size={18} color="#4F46E5" style={{ marginRight: 12 }} />
        )}
        <View>
          <Text style={styles.itemLabel}>{label}</Text>
          {value && <Text style={styles.itemValue}>{value}</Text>}
        </View>
      </View>
      {rightComponent || (
        <FontAwesomeIcon icon="chevron-right" size={16} color="#cbd5e1" />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const user = useGlobal(state => state.user);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert('Success', `Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleOnlineStatusToggle = () => {
    setOnlineStatus(!onlineStatus);
    Alert.alert('Success', `Online status ${!onlineStatus ? 'visible' : 'hidden'}`);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    Alert.alert('Info', 'Dark mode will be applied after restart');
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile feature coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Change password feature coming soon!');
  };

  const handleBlockedUsers = () => {
    Alert.alert('Blocked Users', 'No users blocked yet');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy & Security', 'Privacy settings feature coming soon!');
  };

  const handleAbout = () => {
    Alert.alert(
      'About',
      'Realtime Chat v1.0.0\n\n© 2025 Realtime Chat. All rights reserved.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="user"
            label="Edit Profile"
            value={user.name}
            onPress={handleEditProfile}
          />
          <SettingsItem
            icon="lock"
            label="Change Password"
            onPress={handleChangePassword}
          />
          <SettingsItem
            icon="shield"
            label="Two-Factor Authentication"
            onPress={() => Alert.alert('2FA', '2FA feature coming soon!')}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications & Sounds">
          <SettingsItem
            icon="bell"
            label="Enable Notifications"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#cbd5e1', true: '#a5f3fc' }}
                thumbColor={notificationsEnabled ? '#4F46E5' : '#94a3b8'}
              />
            }
          />
          <SettingsItem
            icon="volume"
            label="Notification Sound"
            rightComponent={
              <Switch
                value={soundEnabled}
                onValueChange={handleSoundToggle}
                trackColor={{ false: '#cbd5e1', true: '#a5f3fc' }}
                thumbColor={soundEnabled ? '#4F46E5' : '#94a3b8'}
              />
            }
          />
          <SettingsItem
            icon="vibrate"
            label="Vibration"
            rightComponent={
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#cbd5e1', true: '#a5f3fc' }}
                thumbColor={'#4F46E5'}
              />
            }
          />
        </SettingsSection>

        {/* Privacy Section */}
        <SettingsSection title="Privacy & Security">
          <SettingsItem
            icon="eye"
            label="Online Status"
            value={onlineStatus ? 'Visible' : 'Hidden'}
            rightComponent={
              <Switch
                value={onlineStatus}
                onValueChange={handleOnlineStatusToggle}
                trackColor={{ false: '#cbd5e1', true: '#a5f3fc' }}
                thumbColor={onlineStatus ? '#4F46E5' : '#94a3b8'}
              />
            }
          />
          <SettingsItem
            icon="ban"
            label="Blocked Users"
            onPress={handleBlockedUsers}
          />
          <SettingsItem
            icon="lock"
            label="Privacy Settings"
            onPress={handlePrivacy}
          />
        </SettingsSection>

        {/* Display Section */}
        <SettingsSection title="Display & Appearance">
          <SettingsItem
            icon="moon"
            label="Dark Mode"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: '#cbd5e1', true: '#a5f3fc' }}
                thumbColor={darkMode ? '#4F46E5' : '#94a3b8'}
              />
            }
          />
          <SettingsItem
            icon="text"
            label="Text Size"
            value="Medium"
            onPress={() => Alert.alert('Text Size', 'Text size settings coming soon!')}
          />
          <SettingsItem
            icon="palette"
            label="Color Theme"
            value="Default"
            onPress={() => Alert.alert('Theme', 'Theme customization coming soon!')}
          />
        </SettingsSection>

        {/* Storage Section */}
        <SettingsSection title="Storage & Data">
          <SettingsItem
            icon="database"
            label="Storage Usage"
            value="242 MB"
            onPress={() => Alert.alert('Storage', 'Clear cache feature coming soon!')}
          />
          <SettingsItem
            icon="download"
            label="Auto-Download Media"
            value="WiFi only"
            onPress={() => Alert.alert('Auto-Download', 'Coming soon!')}
          />
          <SettingsItem
            icon="trash"
            label="Clear Cache"
            onPress={() => {
              Alert.alert(
                'Clear Cache',
                'Are you sure you want to clear the cache? This will free up storage.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    onPress: () => Alert.alert('Success', 'Cache cleared'),
                    style: 'destructive',
                  },
                ]
              );
            }}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsItem
            icon="circle-info"
            label="About Realtime Chat"
            onPress={handleAbout}
          />
          <SettingsItem
            icon="file-contract"
            label="Terms of Service"
            onPress={() => Alert.alert('Terms', 'Terms of Service page would open here')}
          />
          <SettingsItem
            icon="shield-halved"
            label="Privacy Policy"
            onPress={() => Alert.alert('Privacy', 'Privacy Policy page would open here')}
          />
          <SettingsItem
            icon="star"
            label="Rate Us"
            onPress={() => Alert.alert('Rate', 'Redirect to app store')}
          />
        </SettingsSection>

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  itemValue: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  spacing: {
    height: 40,
  },
});
