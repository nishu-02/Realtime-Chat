import { View, TextInput, SafeAreaView, FlatList, Text } from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Empty from "../common/Empty";
import Thumbnail from "../common/Thumbnail";


function SearchRow({ user }) {
  return (
    <View 
     style = {{
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      height:106,
     }}
    >
      <Thumbnail
        path = {user.thumbnail}
        size = {56}
      />
      <Text 
        style = {{
          fontWeight: 'bold',
          color: 'black',
          marginBottom : 4,
          paddingLeft:34,
        }}>
        {user.username}
      </Text>
    </View>
  )
}
function SearchScreen() {
  const [query, setQuery] = useState("");

  const searchList = [
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
      status: "not-connected",
    },
  ];
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
          renderItem={({item}) => (
            <SearchRow user={item} />
          )}
          keyExtractor={item => item.username}
        />
      )}
    </SafeAreaView>
  );
}

export default SearchScreen;
