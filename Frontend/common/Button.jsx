import {TouchableOpacity, Text,} from 'react-native';

function Button({ title}) {
    return (
      <TouchableOpacity
        style = {{
          backgroundColor: 'teal',
          height: 53,
          borderRadius: 34,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft : 34,
          marginRight: 34,
          marginTop:23,
        }}
      >
        <Text 
            style = {{
                color: 'red',
                fontSize: 19,
                marginVertical : 6,
            paddingLeft : 13,
            }}
        >
            {title}
        </Text>
      </TouchableOpacity>
    )
};

export default Button;