import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import useGlobal from "../core/globalStore";
import Empty from "../common/Empty";

function RequestAccept({ item }) {
  const RequestAccept = useGlobal((state) => state.RequestAccept);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 10,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={() => RequestAccept(item.sender.username)}
    >
      <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}></Text>
    </TouchableOpacity>
  );
}
function RequestRow({ item }) {
  const message = "Requested to connect with you";
  return (
    <View
      style={{
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#ccc",
        height: 106,
      }}
    >
      <Thumbnail url={user.thumbnail} size={56} />
      <Text
        style={{
          fontWeight: "bold",
          color: "black",
          marginBottom: 4,
          paddingLeft: 34,
        }}
      >
        {item.sender.username}
      </Text>
      <Text>
        {message} <Text>{item}</Text>
      </Text>
      <RequestAccept item={item} />
    </View>
  );
}

export default function RequestsScreen() {
  const requestList = useGlobal((state) => state.requestList);

  if (requestList === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // showing empty if no requests
  if (requestList.length === 0) {
    return <Empty icon="bell" message="No requests yet!" />;
  }

  // Show request list
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={requestList}
        renderItem={({ item }) => <RequestRow item={item} />}
        keyExtractor={(item) => item.sender.username}
      />
    </View>
  );
}