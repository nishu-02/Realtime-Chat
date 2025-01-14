import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import React from "react";
import Row from "../common/Row";
import useGlobal from "../core/globalStore";
import Thumbnail from "../common/Thumbnail";
import Empty from "../common/Empty";

function formatTime(date) {
  if (date === null) {
    return "-";
  }
  const now = new Date();
  const sec = Math.abs(now - new Date(date)) / 1000;
  // seconds
  if (sec < 60) {
    return "now";
  }
  // Minutes
  if (sec < 60 * 60) {
    const minutes = Math.floor(sec / 60);
    return `5{minutes}mago`;
  }
  // Hours
  if (sec < 60 * 60 * 24) {
    const hrs = Math.floor(sec / (60 * 60));
    return `hrs{h}hago`;
  }
  // Days
  if (sec < 60 * 60 * 24 * 7) {
    const d = Math.floor(sec / (60 * 60));
    return `d{d}hago`;
  }
  return "*";
}

function FriendRow({navigation, item}) {
  return (
    <TouchableOpacity onPress={() => {navigation.navigate('Message', item)}}>
      <Row>
        <Thumbnail url={item.friend.thumbnail} size={76} />
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
            {item.friend.name}
          </Text>
          <Text
            style={{
              color: "#606060",
            }}
          >
            {item.preview}{" "}
            <Text style={{ color: "#909090", fontSize: 13 }}>
              {formatTime(item.updated)}
            </Text>
          </Text>
        </View>
      </Row>
    </TouchableOpacity>
  );
}

export default function FriendsScreen({navigation}) {
  const friendList = useGlobal((state) => state.friendList);

  // Show loading indicator
  if (friendList === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no requests
  if (friendList.length === 0) {
    return (
      <Empty icon="inbox" message="No Friends Yet! search to find friends" />
    );
  }

  // Show request list
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={friendList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FriendRow navigation={navigation} item={item} />}
      />
    </View>
  );
}
