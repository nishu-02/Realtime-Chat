import { Image, View } from "react-native";
import React from 'react';
import useGlobal from '../core/globalStore';
import utils from '../core/utils';

function Thumbnail({ url, size, style }) {
  const user = useGlobal((state) => state.user);
  
  // Use the thumbnail helper from utils which handles the full URL construction
  const imageSource = utils.thumbnail(url || user?.thumbnail);

  return (
    <View style={[{ width: size, height: size, backgroundColor: '#f3f4f6' }, style]}>
      <Image 
        source={imageSource} 
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
}

export default Thumbnail;