import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useGlobal from '../core/globalStore';
import React from 'react';

function ProfileLogout() {

  const logout = useGlobal(state => state.logout);

  return (
    <TouchableOpacity 
      onPress={logout}
      style = {{
        flexDirection: 'row',
        height: 52,
        width:120,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        paddingHorizontal: '#202020',
        marginTop: 24,
        padding:12
      }}
    >
      <FontAwesomeIcon icon="sign-out-alt" color="white" size={14} />
      <Text style = {[styles.content, { fontSize: 14 , color: 'red', alignSelf: 'center'}]}> Logout? </Text>

    </TouchableOpacity>
  )
}

function ProfileScreen() {

  const user = useGlobal((state) => state.user);

  if (!user || Object.keys(user).length === 0) {
      console.log("User data not available in global store");
      return <Text>Loading or User not authenticated...</Text>;
  }

  return (
    <View style = { styles.container}>
    <Image source = { require('../assets/thumbnail.png')} 
      style = {{
        width: 90, height: 90, borderRadius: 89, backgroundColor: 'e0e0e0', marginBottom:20,
      }}
    />   
      <Text style={styles.content}>{user.name || "No Name Available"}</Text>
      <Text style={styles.username}>@{user.username || "No Username"}</Text>

      <ProfileLogout />
    </View>
  )
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container : {
    flex : 1,
    alignItems: 'center',
    paddingTop: 100,
  },
  content : {
    textAlign: 'center',
    color: '#303030',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom:2,
    color:'red',
  },
  username: {
    textAlign: 'center',
    color: 'red',
    fontSize: 14,
  }
});