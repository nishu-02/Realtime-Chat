import { Image, View } from "react-native";
import React from 'react';
import useGlobal from '../core/globalStore';

function Thumbnail({ url, size, style }) {
  const user = useGlobal((state) => state.user);
  const baseUrl = 'http://192.168.1.4:5000';
  
  const thumbnailUrl = url || user?.thumbnail;
  const fullUrl = thumbnailUrl?.startsWith('http') ? thumbnailUrl : `${baseUrl}${thumbnailUrl}`;

  return (
    <View style={[{ width: size, height: size, backgroundColor: '#f3f4f6' }, style]}>
      <Image 
        source={{ uri: fullUrl }} 
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
}

export default Thumbnail;