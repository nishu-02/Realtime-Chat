import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Thumbnail from './Thumbnail';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    maxHeight: '80%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202020',
  },
  closeButton: {
    padding: 8,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  thumbnailWrapper: {
    marginBottom: 16,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#202020',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 16,
    color: '#606060',
    marginBottom: 12,
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 24,
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#606060',
  },
});

export default function UserProfile({ visible, onClose, user }) {
  if (!user) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <FontAwesomeIcon icon="times" size={20} color="#606060" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.profileContainer}>
              <View style={styles.thumbnailWrapper}>
                <Thumbnail url={user.thumbnail} size={120} />
              </View>
              <Text style={styles.nameText}>{user.name || 'User'}</Text>
              <Text style={styles.usernameText}>@{user.username}</Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <FontAwesomeIcon icon="user" size={16} color="#4F46E5" />
                </View>
                <Text style={styles.infoText}>
                  <Text style={{ fontWeight: '600' }}>Username: </Text>
                  {user.username}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <FontAwesomeIcon icon="id-card" size={16} color="#4F46E5" />
                </View>
                <Text style={styles.infoText}>
                  <Text style={{ fontWeight: '600' }}>Name: </Text>
                  {user.name || 'Not set'}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
