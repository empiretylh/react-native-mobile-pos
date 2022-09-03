import React from 'react';
import {View, Text} from 'react-native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './components/CustomDrawer';
import Home from './Home';
import Setting from './Setting';

const Drawer = createDrawerNavigator();

const Container = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      initialRouteName="main"
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Add Shop" component={Setting} />
      <Drawer.Screen name="Notification" component={Setting} />
      <Drawer.Screen name="Settings" component={Setting} />
    </Drawer.Navigator>
  );
};

export default Container;
