import { View, Text, StyleSheet, TouchableOpacity, onPress } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import Title from '../common/Title';
import Button from '../common/Button';
import Input from '../common/Input';

function SignIn() {
  const navigation = useNavigation();

  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');

  const[usernameError, setUsernameError] = useState('');
  const[passwordError, setPasswordError] = useState('');

  function onSignIn() {
    console.log("clicked" , username, password);
  
    // checking the username
    const failUsername = !username;
    if(failUsername) {
      setUsernameError('Username is not provided');
    }
    
    // checking the password
    const failPassword = !password;
    if(failPassword) {
      setPasswordError('Password is Wrong Folk');
    }
    // Break out of this function if there were any error
    if (failUsername || failPassword) {
      return
    }
    // Make singIn request
  }

  return (
    <SafeAreaView style = {{ flex: 1}}>
      <View style = { styles.content }>

      <Title text = 'Realtime Chat' color= "Black" />
      
      <Input 
        title = 'Username'
        value={username}
        error={usernameError}
        setValue={setUsername}
        setError={setUsernameError}
      />
      <Input 
        title = 'Secret Key'
        value={password}
        error={passwordError}
        setValue={setPassword}
        setError={setPasswordError}
      />
      
      <Button title = 'Sign In' onPress={onSignIn} />
      
      <Text>Don't have an account yet!
        <Text style = {{color:'black'}} onPress={ () => navigation.navigate('SignUp')}>
          Sign up
        </Text>
      </Text>
      
      </View>
    </SafeAreaView>
  )
}

export default SignIn;

const styles = StyleSheet.create({
  content : {
    justifyContent:'center',
    backgroundColor: 'rgba(54, 184, 184, 0.6)',
    flex : 1,    
  },
  item : {
    color: 'red',
    fontSize: 19,
    marginVertical : 6,
    paddingLeft : 13,
  }
});
