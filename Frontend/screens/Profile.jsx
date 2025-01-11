import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { launchImageLibrary } from 'react-native-image-picker'
import useGlobal from '../core/globalStore';
import React from 'react';
import utils from '../core/utils';

function ProfileImage() {
  // const user = useGlobal(state => state.user)
  const UploadThumbnail = useGlobal(state => state.UploadThumbnail);
	return (
		<TouchableOpacity 
			style={{ marginBottom: 20 }}
			onPress={() => {
				launchImageLibrary({ includeBase64: true }, (response) => {
					utils.log('launchImageLibrary', response)
					if (response.didCancel) return
					const file = response.assets[0]
					uploadThumbnail(file)
				})
			}}
		>
      <Image
        source={require('../assets/thumbnail.png')}
        style ={{ width:100, height:100, borderRadius: 50 , marginBottom:18}}
        />
			{/* <Thumbnail */}
			<View
				style={{
					position: 'absolute',
					bottom: 0,
					right: 0,
					backgroundColor: '#202020',
					width: 40,
					height: 40,
					borderRadius: 20,
					alignItems: 'center',
					justifyContent: 'center',
					borderWidth: 3,
					borderColor: 'white'
				}}
			>
				<FontAwesomeIcon
					icon='pencil'
					size={15}
					color='#d0d0d0'
				/>
			</View>
		</TouchableOpacity>
	)
}

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
    <ProfileImage/>
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