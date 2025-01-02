import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Title from '../common/Title';

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
  return (
    <SafeAreaView style = {{ flex: 1}}>
      <View style = { styles.content }>
      <Title text = 'Realtime Chat' color= "Black" />
      <Input title = 'Username' />
      <Input title = 'Secret Key' />
      </View>
    </SafeAreaView>
  )
}

export default SignIn;

const styles = StyleSheet.create({
  content : {
    justifyContent:'center',
    // alignItems: 'center',
    backgroundColor: 'thistle',
    flex : 1,    
  },
  item : {
    color: 'red',
    fontSize: 19,
    marginVertical : 6,
    paddingLeft : 10,
  }

});
