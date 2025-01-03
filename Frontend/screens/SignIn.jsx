import { View, Text, StyleSheet, TextInput, TouchableOpacity, onPress } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import Title from '../common/Title';
import Button from '../common/Button';

function Input({ title}) {
  return (
    <View>
      <Text style = {styles.item}> {title} </Text>
      <TextInput 
        style = {{
          backgroundColor: 'white',
          borderRadius:18,
          height:43,
          paddingHorizontal: 34,
          marginLeft:14,
          marginRight:14,
        }}
      />
    </View>
  )
};

function SignIn() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style = {{ flex: 1}}>
      <View style = { styles.content }>

      <Title text = 'Realtime Chat' color= "Black" />
      
      <Input title = 'Username' />
      <Input title = 'Secret Key' />
      
      <Button title = 'Sign In' />
      
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
