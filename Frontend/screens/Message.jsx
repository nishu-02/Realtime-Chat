import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import Thumbnail from '../common/Thumbnail';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import useGlobal from '../core/globalStore';

function MessageHeader({ friend }) {
  return (
    <View style={{
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <Thumbnail
        url={friend.thumbnail}
        size={30}
      />
      <Text
        style={{
          color: 'teal',
          marginLeft: 5,
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {friend.name}
      </Text>
    </View>
  );
}

function MessageInput({ message, setMessage, onSend }) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TextInput
        placeholder="Message..."
        placeholderTextColor="beige"
        value={message}
        onChangeText={setMessage}
        style={{
          flex: 1,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderRadius: 25,
          backgroundColor: 'thistle',
          height: 50,
        }}
      />
      <TouchableOpacity onPress={onSend}>
        <FontAwesomeIcon
          icon={faPaperPlane} 
          size={22}
          color={'#303040'}
          style={{
            marginHorizontal: 12,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

function MessageScreen({ navigation, route }) {
  const [message, setMessage] = useState('');

  const messageSend = useGlobal(state => state.messageSend);
  const connectionId = route.params.id
  const friend = route.params.friend;

  // Update the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <MessageHeader friend={friend} />
      ),
    });
  }, [navigation, friend]);

  function onSend() {
    console.log(message);
    if(message.length === 0) {
      return
    }
    messageSend(connectionId, message);
    setMessage('')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          borderWidth: 6,
          borderColor: 'red',
        }}>
      </View>
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={onSend}
      />
    </SafeAreaView>
  );
}

export default MessageScreen;
