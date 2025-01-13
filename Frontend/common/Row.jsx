import { View } from "react-native"


function Row({ children }) {
	return (
		<View
			style={{
				paddingHorizontal: 20,
				flexDirection: 'row',
				alignItems: 'center',
				borderBottomWidth: 1,
				borderColor: '#f0f0f0',
				height: 106
			}}
		>
			{children}
		</View>
	)
}


export default Row