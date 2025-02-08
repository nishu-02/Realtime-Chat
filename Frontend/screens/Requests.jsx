import { ActivityIndicator, FlatList, View, Text, TouchableOpacity } from "react-native"
import useGlobal from "../core/globalStore"
import Empty from "../common/Empty"
import Row from "../common/Row"
import Thumbnail from "../common/Thumbnail"
import React from "react"
import {formatTime} from "../core/utils"

function RequestAccept({ item }) {
	const requestAccept = useGlobal(state => state.requestAccept)

	return (
		<TouchableOpacity
			style={{
				backgroundColor: '#202020',
				paddingHorizontal: 14,
				height: 36,
				borderRadius: 18,
				alignItems: 'center',
				justifyContent: 'center'
			}}
			onPress={() => requestAccept(item.sender.username)}
		>
			<Text style={{ color: 'white', fontWeight: 'bold' }}>Accept</Text>
		</TouchableOpacity>
	)
}

function RequestRow({ item }) {
	const message = 'Requested to connect with you'
	//const time = '7m ago'

	return (
		<Row>
			<Thumbnail
				url={item.sender.thumbnail}
				size={76}
			/>
			<View
				style={{
					flex: 1,
					paddingHorizontal: 16
				}}
			>
				<Text
					style={{
						fontWeight: 'bold',
						color: '#202020',
						marginBottom: 4
					}}
				>
					{item.sender.name}
				</Text>
				<Text
					style={{
						color: '#606060',
					}}
				>
					{message} <Text style={{ color: '#909090', fontSize: 13 }}>
						{formatTime(item.created)}
					</Text>
				</Text>
			</View>

			<RequestAccept item={item} />
		</Row>
	)
}



function RequestsScreen() {
	const requestList = useGlobal(state => state.requestList)

	// Show loading indicator
	if (requestList === null) {
		return  (
			<ActivityIndicator style={{ flex: 1 }} />
		)
	}

	// Show empty if no requests
	if (requestList.length === 0) {
		return (
			<Empty icon='bell' message='No requests' />
		)
	}

	// Show request list
	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={requestList}
        keyExtractor={item => item.sender.username}
				renderItem={({ item }) => (
					<RequestRow item={item} />
				)}
				
			/>
		</View>
	)
}

export default RequestsScreen