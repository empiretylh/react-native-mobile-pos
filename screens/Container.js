import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import Container from './pcomponents/Container';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import Register from './SignUp';
import Profile from './pcomponents/profile';
import Loading from './pcomponents/extra/Loading';
import {baseUrl} from '../Database';
import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();
const SContainer = () => {
  axios.defaults.baseURL = baseUrl;
  const [isloading, setIsLoading] = useState();
  const [userToken, setToken] = useState();

  useEffect(() => {
    GetToken();
    console.log('Get Tokens');
  }, []);

  const GetToken = () => {
    setIsLoading(true);
    EncryptedStorage.getItem('secure_token').then(res => {
      setToken(res);
      setIsLoading(false);
      if (res == null) {
        SplashScreen.hide();
      } else {
        axios.defaults.headers.common = {Authorization: `Token ${res}`};
        SplashScreen.hide();
      }
    });
  };

  if (!isloading || userToken) {
    SplashScreen.hide();
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
  }
  return <Loading />;
};

export default SContainer;
