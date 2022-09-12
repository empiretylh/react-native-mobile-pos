/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import Product from './Product';
import Expense from './Expense';
import Sales from './Sales';
import Report from './Report';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();
const Container = () => {
  const bottomIconsize = 25;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          padding: 10,
          paddingBottom: 15,
        },
      }}>
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <Icon
                name={focused ? 'home-sharp' : 'home-outline'}
                size={bottomIconsize}
                color={'#0f0f0f'}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: focused ? 'bold' : '200',
                  color: 'black',
                }}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="product"
        component={Product}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <MIcon
                name={focused ? 'shopping' : 'shopping-outline'}
                size={bottomIconsize}
                color={'#0f0f0f'}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: focused ? 'bold' : '200',
                  color: 'black',
                }}>
                Products
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="sales"
        component={Sales}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <Icon
                name={focused ? 'cart-sharp' : 'cart-outline'}
                size={bottomIconsize}
                color={'#0f0f0f'}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: focused ? 'bold' : '200',
                  color: 'black',
                }}>
                Sales
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="expense"
        component={Expense}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <Icon
                name={focused ? 'albums' : 'albums-outline'}
                size={bottomIconsize}
                color={'#0f0f0f'}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: focused ? 'bold' : '200',
                  color: 'black',
                }}>
                Expenses
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="report"
        component={Report}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <MIcon
                name={focused ? 'file-chart' : 'file-chart-outline'}
                size={bottomIconsize}
                color={'#0f0f0f'}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: focused ? 'bold' : '200',
                  color: 'black',
                }}>
                Report
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Container;
