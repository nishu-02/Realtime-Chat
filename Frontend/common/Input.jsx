import { View, Text, TextInput, StyleSheet } from 'react-native';
import React from 'react';

function Input({ title, value, error, setValue, setError, secureTextEntry }) {
  return (
    <View>
      <Text style={styles.item}>
        {error ? error : title}
      </Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          if (error) {
            setError('');
          }
        }}
        secureTextEntry={secureTextEntry} // Secure text entry logic
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  item: {
    color: 'teal',
    fontSize: 19,
    borderWidth: 1,
    borderColor: 'transparent',
    marginVertical: 6,
    paddingLeft: 13,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 18,
    height: 43,
    paddingHorizontal: 34,
    marginLeft: 14,
    marginRight: 14,
  },
});
