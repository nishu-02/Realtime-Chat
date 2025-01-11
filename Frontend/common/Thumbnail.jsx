import utils from '../core/utils.js';
import { Image} from "react-native";
import React from 'react';

function Thumbnail({url, size}) {
    return(
        <Image 
        source= {utils.thumbnail(user.thumbnail)}
        style = {{ width:180, height:180, borderRadius: size / 2  }}
      />
    )
}

export default Thumbnail;
