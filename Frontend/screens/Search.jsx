import {
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Empty from "../common/Empty";
import Thumbnail from "../common/Thumbnail";
import useGlobal from "../core/globalStore";
import Row from "../common/Row";

function SearchButton({ user }) {
  if (user.status === "connected") {
    return (
      <FontAwesomeIcon
        icon="circle-chevron-down"
        size={28}
        color="#20d080"
        style={{ marginLeft: 220 }}
      />
    );
  }

  const requestConnect = useGlobal((state) => state.requestConnect);

  const data = {};

  switch (user.status) {
    case "no-connection":
      data.text = "Connect";
      data.disabled = false;
      data.onPress = () => requestConnect(user.username);
      break;
    case "pending-them":
      data.text = "Pending";
      data.disabled = true;
      break;
    case "pending-me":
      data.text = "Accept";
      data.disabled = false;
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: data.disabled ? "#ccc" : "#20d080",
        paddingHorizontal: 16,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
      }}
      disabled={data.disabled}
      onPress={data.onPress}
    >
      <Text
        style={{
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {data.text}
      </Text>
    </TouchableOpacity>
  );
}

function SearchRow({ user }) {
  return (
    <Row>
      <Thumbnail url={user.thumbnail} size={76} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "#202020",
            marginBottom: 4,
          }}
        >
          {user.name}
        </Text>
        <Text
          style={{
            color: "#606060",
          }}
        >
          {user.username}
        </Text>
      </View>
      <SearchButton user={user} />
    </Row>
  );
}

function SearchScreen() {
  const [query, setQuery] = useState("");

  const searchList = useGlobal((state) => state.searchList);
  const searchUsers = useGlobal((state) => state.searchUsers);

  useEffect(() => {
		searchUsers(query)
	}, [query, searchUsers]) 

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderColor: "#f0f0f0",
        }}
      >
        <View>
          <TextInput
            style={{
              backgroundColor: "#e1e2e4",
              height: 52,
              borderRadius: 26,
              padding: 16,
              fontSize: 16,
              paddingLeft: 50,
            }}
            value={query}
            onChangeText={setQuery}
            placeholder="Search..."
            placeholderTextColor="#b0b0b0"
          />
          <FontAwesomeIcon
            icon="magnifying-glass"
            size={20}
            color="#505050"
            style={{
              position: "absolute",
              left: 18,
              top: 17,
            }}
          />
        </View>
      </View>

      {searchList === null ? (
        <Empty
          icon="magnifying-glass"
          message="Search for friends"
          centered={false}
        />
      ) : searchList.length === 0 ? (
        <Empty
          icon="triangle-exclamation"
          message={'No users found for "' + query + '"'}
          centered={false}
        />
      ) : (
        <FlatList
          data={searchList}
          renderItem={({ item }) => <SearchRow user={item} />}
          keyExtractor={(item) => item.username}
        />
      )}
    </SafeAreaView>
  );
}

export default SearchScreen;