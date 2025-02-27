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

  const login = useGlobal((state) => state.login);

  function onSignIn() {
    console.log("clicked", username, password);

    setUsernameError("");
    setPasswordError("");
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
    // Proceed with SignIn request
    console.log(
      "Sending request with username and password:",
      username,
      password
    );
    api({
      method: "POST",
      url: "signin/",
      data: {
        username: username,
        password: password,
      },
    })
      .then((response) => {
        const credentials = {
          username: username,
          password: password,
        };

        const tokens = response.data.tokens; // Assuming tokens are returned in response
        utils.log("Sign In:", response.data);

        // Pass credentials, user, and tokens to the login function
        login(credentials, response.data.user, response.data.tokens);

        // navigation.navigate("Home"); // Navigate to Home page after successful login
      })
      .catch((error) => {
        // Handle any errors during the API request
        if (error.response) {
          console.log("Error response:", error.response.data);
          console.log("Status:", error.response.status);
          setPasswordError(error.response.data.error || "Invalid credentials");
        } else if (error.request) {
          console.log("Request error:", error.request);
          setPasswordError("Network error. Please try again.");
        } else {
          console.log("Error:", error.message);
          setPasswordError("An unexpected error occurred.");
        }
      });
    // the error type if of axios (this is beacuse error can be come in any of the form)
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
            secureTextEntry={true}
          />
  
          <Button title="Sign In" onPress={onSignIn} />
  
          <Text>
            Don't have an account yet!
            <Text
              style={{ color: "blue", marginLeft:12 }}
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
