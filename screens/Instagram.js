/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './ig_compnent/Home';
import Profile from './ig_compnent/Profile';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {View, Text, Image} from 'react-native';
import {IMAGE} from '../Database';
const Tab = createBottomTabNavigator();

const Container = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="Feed"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <Icon
                  name={focused ? 'home' : 'home-outline'}
                  size={20}
                  color={'#000'}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="search"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <Icon
                  name={focused ? 'search' : 'search-outline'}
                  size={25}
                  color={'#000'}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="post"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <Icon
                  name={focused ? 'add-circle' : 'add-circle-outline'}
                  size={25}
                  color={'#000'}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="shop"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <Icon
                  name={focused ? 'cart' : 'cart-outline'}
                  size={25}
                  color={'#000'}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <View
                  style={{
                    padding: 4,
                    borderRadius: 25,
                    backgroundColor: 'black',
                  }}>
                  <Image source={IMAGE.thura} style={{width: 25, height: 25}} />
                </View>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Container;
