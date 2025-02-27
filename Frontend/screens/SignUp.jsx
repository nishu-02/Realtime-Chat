import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../common/Button";
import Input from "../common/Input";
import api from "../core/api";
import utils from "../core/utils";
import useGlobal from "@/core/globalStore";

function SignUp({ navigation }) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const [password2Error, setPassword2Error] = useState("");

  const login = useGlobal(state => state.login);

  function onSignUp() {
    setUsernameError("");
    setFirstNameError("");
    setLastNameError("");
    setPassword1Error("");
    setPassword2Error("");

    let hasError = false;

    // Username validation
    if (!username || username.length < 5 || username.length > 20) {
      setUsernameError("Username must be between 5 and 20 characters");
      hasError = true;
    }

    // First name validation
    if (!firstName || firstName.length < 2 || firstName.length > 20) {
      setFirstNameError("First name must be between 2 and 20 characters");
      hasError = true;
    }

    // Last name validation
    if (!lastName || lastName.length < 2 || lastName.length > 20) {
      setLastNameError("Last name must be between 2 and 20 characters");
      hasError = true;
    }

    // Password validation
    if (!password1 || password1.length < 8) {
      setPassword1Error("Password must be at least 8 characters");
      hasError = true;
    }

    // Password confirmation validation
    if (password1 !== password2) {
      setPassword2Error("Passwords do not match");
      hasError = true;
    }

    // If any errors exist, prevent form submission
    if (hasError) return;

    api({
      method: "POST", // the method
      url: 'signup/',
      data: {
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: password1,
      }
    })
    .then(response => { // this is a promise
      utils.log('Sign Up:', response.data);
      
      const credentials = {
        username: username,
        password: password
      }
      login(
        credentials,
        response.data.user,
        response.data.tokens
      );
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
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

          <Input
            title="Username"
            value={username}
            error={usernameError}
            setValue={setUsername}
            setError={setUsernameError}
          />

          <Input
            title="First Name"
            value={firstName}
            error={firstNameError}
            setValue={setFirstName}
            setError={setFirstNameError}
          />

          <Input
            title="Last Name"
            value={lastName}
            error={lastNameError}
            setValue={setLastName}
            setError={setLastNameError}
          />

          <Input
            title="Password"
            value={password1}
            error={password1Error}
            setValue={setPassword1}
            setError={setPassword1Error}
          />

          <Input
            title="Confirm Password"
            value={password2}
            error={password2Error}
            setValue={setPassword2}
            setError={setPassword2Error}
          />

          <Button title="Sign Up" onPress={onSignUp} />

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.linkText} onPress={() => navigation.goBack()}>
              Log in
            </Text>
          </Text>
        </View>
      </TouchableWithoutFeedback>
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
  title: {
    textAlign: "center",
    marginBottom: 25,
    fontSize: 24,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
