import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../common/Button";

function Input({ title }) {
  return (
    <View>
      <Text style={styles.item}> {title} </Text>
      <TextInput
        style={{
          backgroundColor: "white",
          borderRadius: 18,
          height: 43,
          paddingHorizontal: 34,
          marginLeft: 14,
          marginRight: 14,
        }}
      />
    </View>
  );
}

function SignUp({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 25,
            fontSize: 24,
            fontWeight: "condensedBold",
          }}
        >
          Sign Up
        </Text>
        <Input title="Username" />
        <Input title="First Name" />
        <Input title="Last Name" />
        <Input title="Secret Key" />
        <Input title="Confirm the Key" />

        <Button title="Sign Up" />

        <Text>
          Already have an account?
          <Text
            style={{ color: "black" }}
            onPress={() => navigation.goBack(
              
            )}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "rgba(54, 184, 184, 0.6)",
  },
  item: {
    color: "red",
    fontSize: 19,
    marginVertical: 6,
    paddingLeft: 13,
  },
});
