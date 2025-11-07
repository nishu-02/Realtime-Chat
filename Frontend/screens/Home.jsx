import React, { useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ProfileScreen from "./Profile";
import RequestScreen from "./Requests";
import FriendsScreen from "./Friends";
import Thumbnail from "../common/Thumbnail";
import useGlobal from "../core/globalStore";

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  const user = useGlobal((state) => state.user);
  const socketConnect = useGlobal((state) => state.socketConnect);
  const socketClose = useGlobal((state) => state.socketClose);

  useEffect(() => {
    socketConnect();
    return () => socketClose();
  }, []);

  const onSearch = () => navigation.navigate("Search");

  return (
    <Tab.Navigator
      initialRouteName="Friends"
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: "#202020",
        },
        headerLeft: () => (
          <View style={{ marginLeft: 14 }}>
            <Thumbnail url={user.thumbnail} size={42} />
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={onSearch}>
            <FontAwesomeIcon
              icon="magnifying-glass"
              size={22}
              color="#202020"
              style={{ marginRight: 18 }}
            />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e0e0e0",
          height: 58,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Requests: "bell",
            Friends: "inbox",
            Profile: "user",
          };
          const icon = icons[route.name];
          return (
            <FontAwesomeIcon
              icon={icon}
              size={23}
              color={focused ? "#00796B" : "#909090"}
            />
          );
        },
        tabBarActiveTintColor: "#00796B", // clean teal
        tabBarInactiveTintColor: "#909090",
      })}
    >
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Requests" component={RequestScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
