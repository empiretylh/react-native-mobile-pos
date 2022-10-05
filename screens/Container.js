import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import Home from './pcomponents/Home';
import Container from './pcomponents/Container';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {View, Text} from 'react-native';
import Register from './SignUp';
import Profile from './pcomponents/profile';
import Pricing from './pcomponents/pricing';
import AdminPricing from './pcomponents/adminpricing';
import Loading from './pcomponents/extra/Loading';

import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();
const SContainer = () => {
  axios.defaults.baseURL = 'http://192.168.43.247:8000';
  const [isloading, setIsLoading] = useState();
  const [userToken, setToken] = useState();

  useEffect(() => {
    GetToken();
  }, []);

  const GetToken = () => {
    setIsLoading(true);
    EncryptedStorage.getItem('secure_token').then(res => {
      setToken(res);
      setIsLoading(false);
      if (res == null) {
      } else {
        axios.defaults.headers.common = {Authorization: `Token ${res}`};
      }
    });
  };

  if (isloading == false) {
    SplashScreen.hide();
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {userToken == null ? (
          <>
            <Stack.Screen
              name="login"
              component={Login}
              initialParams={{token: setToken}}
            />
            <Stack.Screen
              name="register"
              component={Register}
              initialParams={{token: setToken}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="main"
              component={Container}
              initialParams={{token: setToken}}
            />
            <Stack.Screen
              name="profile"
              component={Profile}
              initialParams={{token: setToken}}
            />
            <Stack.Screen
              name="pricing"
              component={Pricing}
              initialParams={{token: setToken}}
            />
            <Stack.Screen
              name="admin_pricing"
              component={AdminPricing}
              initialParams={{token: setToken}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SContainer;
