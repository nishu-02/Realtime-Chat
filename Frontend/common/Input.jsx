import {View, Text, TextInput, StyleSheet} from 'react-native';

function Input({ title, value,error, setValue, setError}) {
    return (
      <View>
        <Text style = {styles.item}> { error ? error :title} </Text>
        <TextInput 
          style = {styles.in}
          value={value}
          onChangeText={text => {
            setValue(text)
            if (error) {
                setError(' ')
            }
          }}
        />
      </View>
    )
}

export default Input;

const styles = StyleSheet.create({
    item : {
        color: error ? 'red': 'teal,
        fontSize: 19,
        marginVertical : 6,
        paddingLeft : 13,
    },
    in: {
        backgroundColor: 'white',
        borderRadius:18,
        height:43,
        paddingHorizontal: 34,
        marginLeft:14,
        marginRight:14,
    }
});
