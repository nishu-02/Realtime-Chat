import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import React from "react";
import useGlobal from "../core/globalStore";
import Thumbnail from "../common/Thumbnail";
import Empty from "../common/Empty";
import { formatTime } from "../core/utils";

const colors = {
  primary: '#4F46E5',
  background: '#F3F4F6',
  card: '#FFFFFF',
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#6B7280'
  },
  shadow: {
    color: '#000000',
    opacity: 0.08
  }
};


function FriendRow({ navigation, item }) {
  const { friend, preview, updated } = item;

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Message', item)}
      style={{
        marginBottom: 12,
        marginHorizontal: 16,
        borderRadius: 12,
        backgroundColor: colors.card,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: colors.shadow.opacity,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', padding: 14, alignItems: 'center' }}>
        <Thumbnail 
          url={friend.thumbnail}
          size={48} 
          style={{ 
            borderRadius: 24,
            backgroundColor: colors.background
          }}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
            {friend.name}
          </Text>
          <Text 
            numberOfLines={1}
            style={{ 
              fontSize: 14,
              color: colors.text.secondary,
              marginTop: 2
            }}
          >
            {preview}
          </Text>
          <Text style={{ fontSize: 12, color: colors.text.tertiary, marginTop: 2 }}>
            {formatTime(updated)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function FriendsScreen({ navigation }) {
  const friendList = useGlobal((state) => state.friendList);

  if (friendList === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (friendList.length === 0) {
    return <Empty icon="inbox" message="No Friends Yet! Search to find friends" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={friendList}
        keyExtractor={(item, index) => `${item.id}-${item.friend.id}-${index}`}
        renderItem={({ item }) => (
          <FriendRow navigation={navigation} item={item} />
        )}
        contentContainerStyle={{ 
          paddingVertical: 12
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}