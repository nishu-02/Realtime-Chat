import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import Title from "../common/Title";
import Button from "../common/Button";
import Input from "../common/Input";
import api from "../core/api";
import utils from "../core/utils";
import useGlobal from "../core/globalStore";

function SignInScreen() {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const login = useGlobal(state => state.login);

  function onSignIn() {
    console.log("clicked", username, password);

    // checking the username
    const failUsername = !username;
    if (failUsername) {
      setUsernameError("Username is not provided");
    }

    // checking the password
    const failPassword = !password;
    if (failPassword) {
      setPasswordError("Password is Wrong Folk");
    }
    // Break out of this function if there were any error
    if (failUsername || failPassword) {
      return;
    }
    // Make singIn request
    api({
      method: "POST", // the method
      url: '/main/signin/',
      data: {
        username: username,
        password: password
      }
    })
    .then(response => { // this is a promise
      utils.log('Sign In:', response.data);
      login(response.data)
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }) // the error type if of axios (this is beacuse error can be come in any of the form)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Title text="Realtime Chat" color="Black" />

          <Input
            title="Username"
            value={username}
            error={usernameError}
            setValue={setUsername}
            setError={setUsernameError}
          />
          <Input
            title="Secret Key"
            value={password}
            error={passwordError}
            setValue={setPassword}
            setError={setPasswordError}
          />

          <Button title="Sign In" onPress={onSignIn} />

          <Text>
            Don't have an account yet!
            <Text
              style={{ color: "black" }}
              onPress={() => navigation.navigate("SignUp")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    backgroundColor: "rgba(54, 184, 184, 0.6)",
    flex: 1,
  },
  item: {
    color: "red",
    fontSize: 19,
    marginVertical: 6,
    paddingLeft: 13,
  },
});
