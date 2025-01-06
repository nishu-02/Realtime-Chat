import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';

function Button({ title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'teal',
    height: 53,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 34,
    marginRight: 34,
    marginTop: 23,
  },
  buttonText: {
    color: 'red',
    fontSize: 19,
    marginVertical: 6,
    paddingLeft: 13,
  },
});

export default Button;
