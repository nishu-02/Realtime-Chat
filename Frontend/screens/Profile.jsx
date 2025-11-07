import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import useGlobal from '../core/globalStore';
import Thumbnail from '../common/Thumbnail';

function ProfileImage() {
  const uploadThumbnail = useGlobal(state => state.uploadThumbnail);
  const user = useGlobal(state => state.user);
  const [showOptions, setShowOptions] = useState(false);

  const handleImagePick = () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true },
      response => {
        if (response.didCancel) return;
        const file = response.assets?.[0];
        if (!file) return;
        uploadThumbnail(file);
      }
    );
    setShowOptions(false);
  };

  const handleRemoveDP = () => {
    Alert.alert(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          onPress: () => {
            // TODO: Implement remove DP functionality
            Alert.alert('Success', 'Profile picture removed');
            setShowOptions(false);
          }, 
          style: 'destructive' 
        },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.thumbnailContainer} onPress={() => setShowOptions(true)}>
        <Thumbnail url={user.thumbnail} size={200} />
        <View style={styles.editIconContainer}>
          <FontAwesomeIcon icon="camera" size={18} color="#fff" />
        </View>
      </TouchableOpacity>

      <Modal transparent visible={showOptions} animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={handleImagePick}>
              <FontAwesomeIcon icon="image" size={20} color="#4F46E5" style={{ marginRight: 12 }} />
              <Text style={styles.modalOptionText}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleRemoveDP}>
              <FontAwesomeIcon icon="trash" size={20} color="#dc3545" style={{ marginRight: 12 }} />
              <Text style={[styles.modalOptionText, { color: '#dc3545' }]}>Remove Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalOption, { borderTopWidth: 1, borderTopColor: '#e9ecef' }]} 
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function ProfileInfo() {
  const user = useGlobal(state => state.user);

  return (
    <View style={styles.infoSection}>
      <View style={styles.infoCard}>
        <Text style={styles.nameText}>{user.name || 'User'}</Text>
        <Text style={styles.usernameText}>@{user.username}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <FontAwesomeIcon icon="envelope" size={16} color="#6c757d" style={{ marginRight: 10 }} />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email || 'N/A'}</Text>
        </View>

        {user.phone && (
          <View style={styles.infoRow}>
            <FontAwesomeIcon icon="phone" size={16} color="#6c757d" style={{ marginRight: 10 }} />
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <FontAwesomeIcon icon="calendar" size={16} color="#6c757d" style={{ marginRight: 10 }} />
          <Text style={styles.infoLabel}>Joined</Text>
          <Text style={styles.infoValue}>{user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
}

function ProfileActions() {
  const navigation = useNavigation();
  const logout = useGlobal(state => state.logout);

  const confirmLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.actionSection}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <FontAwesomeIcon icon="gear" size={20} color="#fff" style={{ marginRight: 12 }} />
        <Text style={styles.actionText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
        <FontAwesomeIcon icon="right-from-bracket" size={20} color="#fff" style={{ marginRight: 12 }} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ProfileImage />
      <ProfileInfo />
      <ProfileActions />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  thumbnailContainer: {
    marginTop: 40,
    marginBottom: 30,
    position: 'relative',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#4F46E5',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 6,
  },
  infoSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  nameText: {
    textAlign: 'center',
    color: '#101010',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  usernameText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    flex: 0.3,
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  infoValue: {
    flex: 0.7,
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  actionSection: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  logoutButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#dc3545',
    shadowColor: '#dc3545',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4F46E5',
  },
});
