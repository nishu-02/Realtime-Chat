import { View, TextInput, SafeAreaView, FlatList, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Empty from "../common/Empty";
import Thumbnail from "../common/Thumbnail";
import useGlobal from "../core/globalStore";

function SearchButton({ user }) {
  // Add tick if user is already connected
  if (user.status === "connected") {
    return (
      <FontAwesomeIcon
        icon='circle-chevron-down'
        size={28}
        color='#20d080'
        style={{
          marginLeft: 220,
        }}
      />
    )
  }

  const data = {};

  switch (user.status) {
    case 'no-connection':
      data.text = 'Connect'
      data.disabled = false
      data.OnPress = () => { }
      break

    case 'pending-them':
      data.text = 'Pending'
      data.disabled = true
      data.OnPress = () => { }
      break

    case 'pending-me':
      data.text = 'Accept'
      data.disabled = false
      data.OnPress = () => { }
      break

    default: break
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: data.disabled ? '#ccc' : '#20d080',
        paddingHorizontal: 16,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
      }}
      disabled={data.disabled}
      onPress={data.OnPress}
    >
      <Text
        style={{
          color: data.disabled ? '#fff' : '#fff',
          fontWeight: 'bold',
        }}
      >
        {data.text}
      </Text>
    </TouchableOpacity>
  )
}

function SearchRow({ user }) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
        height: 106,
      }}
    >
      <Thumbnail
        path={user.thumbnail}
        size={56}
      />
      <Text
        style={{
          fontWeight: 'bold',
          color: 'black',
          marginBottom: 4,
          paddingLeft: 34,
        }}>
        {user.username}
      </Text>
      <SearchButton  user={user}/>
    </View>
  )
}

function SearchScreen() {
  const [query, setQuery] = useState("");

  const searchList = useGlobal(state => state.searchList);
  const searchUsers = useGlobal(state => state.searchUsers);

  useEffect(() => {
    searchUsers(query)
  },[query])

  // so what it does it refrehes the results everytime query is changed

  /*const searchList = [
    {
      thumbnail: null,
      name: "hola",
      username: "arthur",
      status: "pending-them",
    },
    {
      thumbnail: null,
      name: "hola amigo",
      username: "sadie",
      status: "pending-me",
    },
    {
      thumbnail: null,
      name: "sun",
      username: "dutch",
      status: "connected",
    },
    {
      thumbnail: null,
      name: "sun flower",
      username: "micah",
      status: "no-connection",
    },
  ];*/

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          icon="magnifying-glass"
          message="Search for folks"
          centered={false}
        />
      ) : searchList.length === 0 ? (
        <Empty
          icon="triangle-exclamation"
          message={"No Users found for " + query + ""}
          centered={false}
        />
      ) : (
        <FlatList
          data={searchList}
          renderItem={({ item }) => (
            <SearchRow user={item} />
          )}
          keyExtractor={item => item.username}
        />
      )}
    </SafeAreaView>
  );
}

export default SearchScreen;
