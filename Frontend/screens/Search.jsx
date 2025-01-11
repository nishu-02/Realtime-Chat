import { View, TextInput, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

function SearchScreen() {
  const [query, setQuery] = useState("");

  const searchList = null;
  return (
    <SafeAreaView>
      <View
        style={{
          padding: 18,
          borderBottomWidth: 1,
          borderBottomColor: "beige",
        }}
      >
        <View>
          <TextInput
            style={{
              backgroundColor: "thistle",
              height: 54,
              borderRadius: 25,
              padding: 16,
              fontSize: 16,
              paddingLeft: 50,
            }}
            Value={query}
            onChangeText={setQuery}
            placeholder="Search...."
            placeholderTextColor="teal"
          />
          <FontAwesomeIcon
            icon="search"
            size={22}
            color={"#000000"}
            style={{
              position: "absolute",
              left: 12,
              top: 17,
            }}
          />
        </View>
      </View>

      {searchList === null ? (
        <Empty
          icon="triangle-excalmation"
          message={"No Users found for " + query + ""}
          centered={false}
        />
      ) : (
        <View />
      )}
    </SafeAreaView>
  );
}

export default SearchScreen;
