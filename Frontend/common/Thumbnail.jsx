import utils from '../core/utils.js';
import { Image} from "react-native";
import React from 'react';

import useGlobal from '../core/globalStore';
function Thumbnail({url, size}) {
    const user = useGlobal((state) => state.user);
    return(
        <Image 
        source= {utils.thumbnail(user.thumbnail)}
        style = {{ width:size, height:size, borderRadius: size / 2  }}
      />
    )
}

export default Thumbnail;
