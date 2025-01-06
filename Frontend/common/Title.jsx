import { View, Text } from 'react-native';
import React from 'react';

export default function Title( {text}) {
  return (
    <View>
      <Text style = {{ 
        color: 'white',
        textAlign: 'center',
        fontSize: 42,
        fontWeight: '400',
        fontFamily: 'Rubik Vinyl',
        marginBottom:40
        }}
      >
        {text}
      </Text>
      {/* <Text style = {{color:'white'}}>                                                        --By Nishant Garg</Text> */}
    </View>
  )
}