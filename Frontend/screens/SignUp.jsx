import { View, Text, StyleSheet } from "react-native";
import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../common/Button";
import Input from "../common/Input";

function SignUp({ navigation }) {

  const[username, setUsername] = useState('');
  const[firstName, setFirstName] = useState('');
  const[lastName, setlastName] = useState('');
  const[password1, setPassword1] = useState('');
  const[password2, setPassword2] = useState('');

  const[usernameError, setUsernameError] = useState('');
  const[firstNameError, setFirstNameError] = useState('');
  const[lastNameError, setLastNameError] = useState('');
  const[password1Error, setPassword1Error] = useState('');
  const[password2Error, setPassword2Error] = useState('');
 

  function onSignUp() {
    // check username
    const failUsername = !username || username.length < 5 || username.length > 20;
    if(failUsername) {
      setUsernameError('Username must be longer');
    }

    // check first Name
    const failFirstName = !firstName || firstName.length < 2 || firstName.length > 20;
    if(failFirstName) {
      setFirstNameError('First name must be longer');
    }

    // check last Name
    const failLastName = !lastName || lastName.length < 2 || lastName.length > 20;
    if(failLastName) {
      setLastNameError('Last name must be longer');
    }

    // check password1
    const failPassword1 = !password1 || password1.length < 8;
    if(failPassword1) {
      setPassword1Error('Password must be longer than 8 characters');
    }

    // check password2
    const failPassword2 = password1 !== password2;
    if(failPassword2) {
      setPassword2Error('Passwords dont match each other');
    }

    if(failUsername || failFirstName || failLastName || failPassword1 || failPassword2) {
      return
    }
    
    console.log('On Sign Up')
  };

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
        <Input title="Username"
          value={username}
          error={usernameError}
          setValue={setUsername}
          setError={setUsernameError}
         />

        <Input title="First Name"
        value={firstName}
        error={firstNameError}
        setValue={setFirstName}
        setError={setFirstNameError}
         />

        <Input title="Last Name"
        value={lastName}
        error={lastNameError}
        setValue={setlastName}
        setError={setLastNameError}
         />

        <Input title="Secret Key"
        value={password1}
        error={password1Error}
        setValue={setPassword1}
        setError={setPassword1Error}
         />

        <Input title="Confirm the Key"
        value={password2}
        error={password2Error}
        setValue={setPassword2}
        setError={setPassword2Error}
        />

        <Button title="Sign Up" onPress={onSignUp}/>

        <Text>
          Already have an account?
          <Text
            style={{ color: "black" }}
            onPress={() => navigation.goBack()}
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
