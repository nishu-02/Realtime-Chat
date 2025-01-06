import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import useGlobal from "../core/globalStore";
import utils from "../core/utils";

function ProfileImage() {
  return (
    <TouchableOpacity
      style={{ marginBottom: 10 }}
      onPress={() => {
        launchImageLibrary({ includeBase64 : true }, (response) => { // this allows to data send as stream
          utils.log("launchImageLibrary", response);
          if (response.didCancel) return
          const file = response.assets[0];
          
          
        });
      }}
    >
      <Image
        source={require("../assets/thumbnail.png")}
        style={{
          width: 30,
          height: 30,
          borderRadius: 10,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "#202020",
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 3,
          borderColor: "teal",
        }}
      >
        <FontAwesomeIcon icon="pencil" size={14} color="#d0d0d0" />
      </View>
    </TouchableOpacity>
  );
}

function ProfileLogout() {
  const logout = useGlobal((state) => state.logout);

  return (
    <TouchableOpacity
      onPress={logout}
      style={{
        flexDirection: "row",
        height: 52,
        width: 120,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        paddingHorizontal: "#202020",
        marginTop: 24,
        padding: 12,
      }}
    >
      <FontAwesomeIcon icon="sign-out-alt" color="white" size={14} />
      <Text
        style={[
          styles.content,
          { fontSize: 14, color: "white", alignSelf: "center" },
        ]}
      >
        {" "}
        Logout?{" "}
      </Text>
    </TouchableOpacity>
  );
}

function ProfileScreen() {
  const user = useGlobal((state) => state.user);

  return (
    <View style={styles.container}>
      <ProfileImage />

      <Text style={styles.content}> {user.name} </Text>
      <Text style={styles.username}>@{user.username}</Text>

      <ProfileLogout />
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
  },
  content: {
    textAlign: "center",
    color: "#303030",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 2,
  },
  username: {
    textAlign: "center",
    color: "#606060",
    fontSize: 14,
  },
});
