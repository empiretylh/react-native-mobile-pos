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

  if (isloading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SContainer;
