import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useGlobal from '../core/globalStore';

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
      <Text style = {[styles.content, { fontSize: 14 , color: 'white', alignSelf: 'center'}]}> Logout? </Text>

    </TouchableOpacity>
  )
}

function ProfileScreen() {
  return (
    <View style = { styles.container}>
    <Image source = { require('../assets/thumbnail.png')} 
      style = {{
        width: 90, height: 90, borderRadius: 89, backgroundColor: 'e0e0e0', marginBottom:20,
      }}
    />   
      <Text style = { styles.content }>Nishant Garg</Text>
      <Text style = { styles.username }>@nishu__0264</Text>

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
  },
  username: {
    textAlign: 'center',
    color: '#606060',
    fontSize: 14,
  }
});