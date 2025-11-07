import { ActivityIndicator, FlatList, View, Text, TouchableOpacity } from "react-native"
import useGlobal from "../core/globalStore"
import Empty from "../common/Empty"
import Row from "../common/Row"
import Thumbnail from "../common/Thumbnail"
import UserProfile from "../common/UserProfile"
import React, { useState } from "react"
import {formatTime} from "../core/utils"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"

function RequestAccept({ item, onProfilePress }) {
	const requestAccept = useGlobal(state => state.requestAccept)

	return (
		<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
			<TouchableOpacity
				style={{
					backgroundColor: '#4F46E5',
					paddingHorizontal: 12,
					height: 36,
					borderRadius: 18,
					alignItems: 'center',
					justifyContent: 'center'
				}}
				onPress={() => onProfilePress(item.sender)}
			>
				<FontAwesomeIcon icon="user" size={14} color="white" />
			</TouchableOpacity>
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
		</View>
	)
}

function RequestRow({ item, onProfilePress }) {
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

			<RequestAccept item={item} onProfilePress={onProfilePress} />
		</Row>
	)
}



function RequestsScreen() {
	const requestList = useGlobal(state => state.requestList)
	const [selectedUser, setSelectedUser] = useState(null)
	const [profileVisible, setProfileVisible] = useState(false)

	const handleProfilePress = (user) => {
		setSelectedUser(user)
		setProfileVisible(true)
	}

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
					<RequestRow item={item} onProfilePress={handleProfilePress} />
				)}
				
			/>
			<UserProfile 
				visible={profileVisible}
				onClose={() => setProfileVisible(false)}
				user={selectedUser}
			/>
		</View>
	)
}

export default RequestsScreen