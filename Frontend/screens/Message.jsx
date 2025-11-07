import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  InputAccessoryView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LinearGradient } from "expo-linear-gradient";
import Thumbnail from "../common/Thumbnail";
import UserProfile from "../common/UserProfile";
import useGlobal from "../core/globalStore";

const COLORS = {
  me: "#4B7BEC",
  friend: "#E4E6EB",
  background: "#F8F9FB",
  text: "#202020",
  gray: "#909090",
};

// 🧑‍💬 Header (friend info)
function MessageHeader({ friend, onProfilePress }) {
  return (
    <TouchableOpacity 
      onPress={onProfilePress}
      style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
    >
      <Thumbnail url={friend.thumbnail} size={32} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: "600" }}>
          {friend.name}
        </Text>
        <Text style={{ color: COLORS.gray, fontSize: 12 }}>
          @{friend.username}
        </Text>
      </View>
      <FontAwesomeIcon icon="chevron-right" size={16} color={COLORS.gray} />
    </TouchableOpacity>
  );
}

// 💬 My message bubble
function MessageBubbleMe({ message }) {
  const messageDelete = useGlobal((state) => state.messageDelete);

  const getStatusCheckmark = () => {
    if (message.is_deleted) return "🗑️";
    if (message.is_read) return "✓✓"; // Double checkmark for read
    if (message.status === "read") return "✓✓";
    return "✓"; // Single checkmark for sent/delivered
  };

  const handleLongPress = () => {
    Alert.alert(
      "Delete Message",
      "Do you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => messageDelete(message.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity 
      onLongPress={handleLongPress}
      delayLongPress={500}
      style={{ flexDirection: "row", justifyContent: "flex-end", marginVertical: 4, paddingHorizontal: 10 }}
    >
      <LinearGradient
        colors={[COLORS.me, "#3867D6"]}
        style={{
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
          maxWidth: "75%",
          minHeight: 42,
        }}
      >
        {message.is_deleted ? (
          <Text style={{ color: "white", fontSize: 14, fontStyle: "italic", opacity: 0.7 }}>
            Message deleted
          </Text>
        ) : (
          <Text style={{ color: "white", fontSize: 16, lineHeight: 20 }}>
            {message.text}
          </Text>
        )}
      </LinearGradient>
      <View style={{ marginLeft: 8, justifyContent: "flex-end" }}>
        <Text style={{ color: message.is_read ? COLORS.me : COLORS.gray, fontSize: 12 }}>
          {getStatusCheckmark()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// 🟡 Typing animation (three dots)
function MessageTypingAnimation({ offset }) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const total = 1000;
    const bump = 200;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(bump * offset),
        Animated.timing(y, {
          toValue: 1,
          duration: bump,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: bump,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(total - bump * 2 - bump * offset),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateY = y.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        marginHorizontal: 2,
        borderRadius: 4,
        backgroundColor: COLORS.gray,
        transform: [{ translateY }],
      }}
    />
  );
}

// 👥 Friend bubble (text or typing indicator)
function MessageBubbleFriend({ message = null, text = "", friend, typing = false }) {
  const displayText = message?.text || text;
  const isDeleted = message?.is_deleted || false;

  return (
    <View style={{ flexDirection: "row", marginVertical: 4, paddingHorizontal: 10 }}>
      <Thumbnail url={friend.thumbnail} size={36} />
      <View
        style={{
          backgroundColor: COLORS.friend,
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
          marginLeft: 8,
          maxWidth: "75%",
          minHeight: 42,
        }}
      >
        {typing ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MessageTypingAnimation offset={0} />
            <MessageTypingAnimation offset={1} />
            <MessageTypingAnimation offset={2} />
          </View>
        ) : isDeleted ? (
          <Text style={{ color: COLORS.text, fontSize: 14, fontStyle: "italic", opacity: 0.7 }}>
            Message deleted
          </Text>
        ) : (
          <Text style={{ color: COLORS.text, fontSize: 16, lineHeight: 20 }}>
            {displayText}
          </Text>
        )}
      </View>
    </View>
  );
}

// 🧩 Bubble renderer
function MessageBubble({ index, message, friend }) {
  const [showTyping, setShowTyping] = useState(false);
  const messagesTyping = useGlobal((state) => state.messagesTyping);

  useEffect(() => {
    if (index !== 0) return;
    if (messagesTyping === null) return setShowTyping(false);
    setShowTyping(true);
    const check = setInterval(() => {
      if (new Date() - messagesTyping > 10000) setShowTyping(false);
    }, 1000);
    return () => clearInterval(check);
  }, [messagesTyping]);

  if (index === 0 && showTyping) {
    return <MessageBubbleFriend friend={friend} typing />;
  }

  if (index === 0) return null;
  
  // Handle deleted messages
  if (message.is_deleted) {
    return message.is_me ? (
      <MessageBubbleMe message={message} />
    ) : (
      <MessageBubbleFriend message={message} friend={friend} />
    );
  }

  return message.is_me ? (
    <MessageBubbleMe message={message} />
  ) : (
    <MessageBubbleFriend message={message} friend={friend} />
  );
}

// ✏️ Input field & send button
function MessageInput({ message, setMessage, onSend }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderColor: "#E0E0E0",
      }}
    >
      <TextInput
        placeholder="Type a message..."
        placeholderTextColor={COLORS.gray}
        value={message}
        onChangeText={setMessage}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#E0E0E0",
          borderRadius: 25,
          paddingHorizontal: 16,
          paddingVertical: 10,
          fontSize: 16,
          color: COLORS.text,
          backgroundColor: "#fff",
        }}
      />
      <TouchableOpacity onPress={onSend} activeOpacity={0.8}>
        <LinearGradient
          colors={["#4B7BEC", "#3867D6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginLeft: 10,
            borderRadius: 25,
            padding: 12,
          }}
        >
          <FontAwesomeIcon icon="paper-plane" size={18} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// 🧠 Main screen
export default function MessagesScreen({ navigation, route }) {
  const [message, setMessage] = useState("");
  const [profileVisible, setProfileVisible] = useState(false);

  const messagesList = useGlobal((state) => state.messagesList);
  const messagesNext = useGlobal((state) => state.messagesNext);

  const messageList = useGlobal((state) => state.messageList);
  const messageSend = useGlobal((state) => state.messageSend);
  const messageType = useGlobal((state) => state.messageType);

  const connectionId = route.params.id;
  const friend = route.params.friend;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <MessageHeader 
          friend={friend} 
          onProfilePress={() => setProfileVisible(true)}
        />
      ),
    });
  }, []);

  useEffect(() => {
    messageList(connectionId);
  }, []);

  const onSend = () => {
    const cleaned = message.replace(/\s+/g, " ").trim();
    if (!cleaned) return;
    messageSend(connectionId, cleaned);
    setMessage("");
  };

  const onType = (value) => {
    setMessage(value);
    messageType(friend.username);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={{ paddingTop: 30 }}
          data={[{ id: -1 }, ...messagesList]}
          inverted
          keyExtractor={(item, index) => `message-${item.id}-${index}`}
          onEndReached={() => {
            if (messagesNext) messageList(connectionId, messagesNext);
          }}
          renderItem={({ item, index }) => (
            <MessageBubble index={index} message={item} friend={friend} />
          )}
        />

        {Platform.OS === "ios" ? (
          <InputAccessoryView>
            <MessageInput
              message={message}
              setMessage={onType}
              onSend={onSend}
            />
          </InputAccessoryView>
        ) : (
          <MessageInput message={message} setMessage={onType} onSend={onSend} />
        )}
      </KeyboardAvoidingView>

      <UserProfile
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        user={friend}
      />
    </SafeAreaView>
  );
}
