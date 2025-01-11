import { TouchableOpacity, View, Image } from "react-native";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ProfileScreen from "./Profile";
import RequestScreen from "./Requests";
import FriendsScreen from "./Friends";
import useGlobal from "../core/globalStore";
import utils from "../core/utils";

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const user = useGlobal((state) => state.user);
  const socketConnect = useGlobal((state) => state.socketConnect);
  const socketClose = useGlobal((state) => state.socketClose);

  useEffect(() => {
    socketConnect();
    return () => {
      socketClose;
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerLeft: () => (
          <View
            style={{
              marginLeft: 10,
              width: 50,
              height: 40,
              borderRadius: 10,
              backgroundColor: "e0e0e0",
            }}
          >
            <Image
              source={utils.thumbnail(user.thumbnail)}
              style={{ width: 40, height: 40, borderRadius: 45 }}
            />
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity>
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
