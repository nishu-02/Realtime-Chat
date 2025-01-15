import { TouchableOpacity, View} from "react-native";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ProfileScreen from "./Profile";
import RequestScreen from "./Requests";
import FriendsScreen from "./Friends";
import useGlobal from "../core/globalStore";
import Thumbnail from "../common/Thumbnail";
const Tab = createBottomTabNavigator();

function HomeScreen({navigation}) {
  const user = useGlobal((state) => state.user);
  const socketConnect = useGlobal((state) => state.socketConnect);
  const socketClose = useGlobal((state) => state.socketClose);

  useEffect(() => {
    socketConnect();
    return () => {
      socketClose();
    };
  }, []);

  function onSearch() {
    navigation.navigate('Search')
  }

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerLeft: () => (
          <View
            style={{
              margin: 14,
            }}
          >
            <Thumbnail url={user.thumbnail} size={45} />
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity 
          onPress= {onSearch}

          >
            <FontAwesomeIcon
              style={{ marginRight: 18 }}
              icon="magnifying-glass"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Requests: "bell",
            Friends: "inbox",
            Profile: "user",
          };
          const icon = icons[route.name];
          return <FontAwesomeIcon icon={icon} size={27} color={color} />;
        },
        tabBarActiveTintColor: "teal",
        tabBarInactiveTintColor: "thistle",
      })}
    >
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Requests" component={RequestScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
