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
import Row from "../common/Row";

function RequestAccept({ item }) {
  const requestAccept = useGlobal((state) => state.requestAccept);

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
      onPress={() => requestAccept(item.sender.username)}
    >
      <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}></Text>
    </TouchableOpacity>
  );
}

function RequestRow({ item }) {
  const message = "Requested to connect with you";
  return (
    <Row>
      <Thumbnail url={item.sender.thumbnail} size={76} />
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
          {item.sender.name}
        </Text>
        <Text
          style={{
            color: "#606060",
          }}
        >
          {message}{" "}
          <Text style={{ color: "#909090", fontSize: 13 }}>
            {utils.formatTime(item.created)}
          </Text>
        </Text>
      </View>

      <RequestAccept item={item} />
    </Row>
  );
}

function RequestsScreen() {
  const requestList = useGlobal((state) => state.requestList);

  // Show loading indicator
	if (requestList === null) {
		return  (
			<ActivityIndicator style={{ flex: 1 }} />
		)
	}

 // Show empty if no requests
 if (requestList.length === 0) {
  return (
    <Empty icon='bell' message='No requests' />
  )
 }
  // Show request list
  // Show request list
	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={requestList}
				renderItem={({ item }) => (
					<RequestRow item={item} />
				)}
				keyExtractor={item => item.sender.username}
			/>
		</View>
	)
}

export default RequestsScreen;