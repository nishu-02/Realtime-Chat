import { View, Text, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import useGlobal from '../core/globalStore';
import Thumbnail from '../common/Thumbnail';

const colors = {
  bg: '#FFFFFF',
  inputBg: '#beige',
  text: '#1A1A1A',
  accent: '#7C3AED',
  subtle: '#E5E7EB'
};

function MessageHeader({ friend }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    }}>
      <Thumbnail url={friend?.thumbnail} size={38} />
      <Text style={{ marginLeft: 12, fontSize: 16, color: colors.text }}>
        {friend?.name || 'Chat'}
      </Text>
    </View>
  );
}

function MessageBox({ message, friend }) {
  const isMe = message.is_me;
  return (
    <View style={{
      alignItems: isMe ? 'flex-end' : 'flex-start',
      paddingHorizontal: 16,
      marginVertical: 4
    }}>
      <View style={{
        backgroundColor: isMe ? colors.accent : colors.inputBg,
        borderRadius: 20,
        maxWidth: '80%',
        minWidth: 60,
        padding: 12,
        paddingHorizontal: 16
      }}>
        <Text style={{
          color: isMe ? '#FFF' : colors.text,
          fontSize: 15,
          lineHeight: 22
        }}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

function MessageInput({ message, setMessage, onSend }) {
  return (
    <View style={{
      padding: 16,
      paddingTop: 12,
      flexDirection: 'row',
      borderTopColor: colors.subtle,
      borderTopWidth: 1
    }}>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Message"
        style={{
          flex: 1,
          height: 44,
          backgroundColor: colors.inputBg,
          borderRadius: 22,
          paddingHorizontal: 20,
          fontSize: 16,
          marginRight: 12
        }}
      />
      <TouchableOpacity 
        onPress={onSend}
        style={{
          width: 44,
          height: 44,
          backgroundColor: colors.accent,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FontAwesomeIcon icon={faPaperPlane} size={18} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

function MessageScreen({ navigation, route }) {
  const [message, setMessage] = useState('');
  const messagesList = useGlobal(state => state.messagesList);
  const messageList = useGlobal(state => state.messageList);
  const messageSend = useGlobal(state => state.messageSend);
  const { id: connectionId, friend } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <MessageHeader friend={friend} />,
      headerShadowVisible: false
    });
  }, [navigation, friend]);

  useEffect(() => {
    messageList(connectionId);
  }, []);

  function onSend() {
    if (!message.trim()) return;
    messageSend(connectionId, message);
    setMessage('');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={messagesList}
        inverted
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MessageBox message={item} friend={friend} />
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={onSend}
      />
    </SafeAreaView>
  );
}

export default MessageScreen;