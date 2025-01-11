import utils from '../core/utils.js';
import { Image } from "react-native";
import React from 'react';

import useGlobal from '../core/globalStore';

function Thumbnail({ url, size }) {
  const user = useGlobal((state) => state.user);

  const thumbnailSource = utils.thumbnail(url || user.thumbnail);

  return (
    <Image 
      source={thumbnailSource} 
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}

export default Thumbnail;
