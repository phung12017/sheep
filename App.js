import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {TabBar} from 'react-native-animated-nav-tab-bar';
import Icon from 'react-native-vector-icons/Feather';

 import Profile from './src/sceens/Profile';
import ChatMain from './src/sceens/ChatMain';
import Login from './src/sceens/Login';
import UploadName from './src/sceens/UploadName';
import UploadCountry from './src/sceens/UploadLocation';
import UploadImage from './src/sceens/UploadImage';
import ChatMessages from './src/sceens/ChatMessages';
import UploadProfile from './src/sceens/UpdateProfile';
import Post from './src/sceens/PostScreen';
import Welcome from './src/sceens/Welcome';
import SignUp from './src/sceens/SignUp';
import Product from './src/components/Product';
import Cart from './src/components/Cart';
import Home from './src/sceens/Home';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppContainer() {
  return (
    <Stack.Navigator headerMode="none">
    
      <Stack.Screen name="LoginStack" component={LoginStack} />

      <Stack.Screen name="Dashboard" component={MyTabs} />

      <Stack.Screen name="ChatMess" component={ChatMessages} />

      <Stack.Screen name="Post" component={Post} />
    </Stack.Navigator>
  );
}



function LoginStack() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="UploadProfile" component={UploadProfile} />
      <Stack.Screen name="UploadName" component={UploadName} />
      <Stack.Screen name="UploadLocation" component={UploadCountry} />
      <Stack.Screen name="UploadImage" component={UploadImage} />
    </Stack.Navigator>
  );
}



function MyTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#2F7C6E',
        inactiveTintColor: '#222222',
      }}
     >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="home"
              size={size ? size : 24}
              color={focused ? color : '#222222'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatMain}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="message-circle"
              size={size ? size : 24}
              color={focused ? color : '#222222'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Me"
        component={Profile}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="user"
              size={size ? size : 24}
              color={focused ? color : '#222222'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

 
 

export default function App() {
  return (
    <NavigationContainer>
      <AppContainer />
    </NavigationContainer>
  );
}
