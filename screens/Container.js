/* eslint-disable react-native/no-inline-styles */
import {useNetInfo} from '@react-native-community/netinfo';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, Vibration, View} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import SplashScreen from 'react-native-splash-screen';
import {IMAGE, baseUrl} from '../Database';
import {createTables} from '../localDatabase/LocalDb';
import Login from './Login';
import Register from './SignUp';
import Container from './pcomponents/Container';
import AdminPricing from './pcomponents/adminpricing';
import FindPrinter from './pcomponents/extra/FindPrinter';
import Loading from './pcomponents/extra/Loading';
import LocalStorageReport from './pcomponents/localstorage/LocalReport';
import Pricing from './pcomponents/pricing';
import SetPrinter from './pcomponents/print/setPrint';
import Profile from './pcomponents/profile';
import ReceiptView from './pcomponents/sales/ReceiptView';
import {UploadToCloud} from '../localDatabase/UploadToCloud';

const Stack = createNativeStackNavigator();
const SContainer = () => {
  axios.defaults.baseURL = baseUrl;
  const [isloading, setIsLoading] = useState();
  const [userToken, setToken] = useState();

  const {isConnected, connectionType} = useNetInfo();
  const [IsSyncing, setIsSyncing] = useState(false);

  const UploadToServer = () => {
    setIsSyncing(true);
    UploadToCloud()
      .catch(res => {
        setIsSyncing(false);
      })
      .then(res => {
        setIsSyncing(false);
      });

    // setTimeout(() => {
    //   setIsSyncing(false);
    // }, [10000]);
  };

  useEffect(() => {
    if (isConnected && userToken != null) {
      UploadToServer();
    }
  }, [isConnected, userToken]);

  useEffect(() => {
    GetToken();
    console.log('Get Tokens');
  }, []);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Vibration.vibrate(200);

    setShowModal(!isConnected);
  }, [isConnected]);

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

  //Create Local Storage Database
  useEffect(() => {
    createTables();
  }, []);

  if (!isloading || userToken) {
    SplashScreen.hide();
    return (
      <>
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
                  name="salesvoucher"
                  component={ReceiptView}
                  initialParams={{token: setToken}}
                />
                <Stack.Screen
                  name="netPrinter"
                  component={FindPrinter}
                  initialParams={{token: setToken}}
                />
                <Stack.Screen
                  name="profile"
                  component={Profile}
                  initialParams={{token: setToken}}
                />
                <Stack.Screen
                  name="printers"
                  component={SetPrinter}
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
                <Stack.Screen
                  name="localreport"
                  component={LocalStorageReport}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        {showModal && <OfflineWarningModel setShowModal={setShowModal} />}
        {!isConnected && <YoureOffline />}
        {IsSyncing && <SyncingDataWithServer />}
      </>
    );
  }
  return <Loading />;
};

export default SContainer;
const OfflineWarningModel = ({setShowModal}) => {
  // Offiline Warning Model with style
  return (
    <View
      style={{
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 15,
          elevation: 1,
          alignItems: 'center',
          position: 'relative',
          flexDirection: 'column',
        }}>
        <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
          No Internet Connection, Please check your internet connection. You can
          use offline mode.
        </Text>

        <TouchableOpacity
          style={{
            width: 200,
            alignItems: 'center',
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            backgroundColor: '#0d6efd',
          }}
          onPress={() => {
            setShowModal(false);
          }}>
          <Text style={{color: 'white', fontSize: 18}}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const YoureOffline = ({}) => {
  return (
    <View
      style={{
        backgroundColor: 'red',
        padding: 8,
        paddingBottom: 9,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 13, fontWeight: 'bold'}}>
        You're Offline
      </Text>
    </View>
  );
};

const SyncingDataWithServer = ({}) => {
  return (
    <View
      style={{
        backgroundColor: 'blue',
        padding: 8,
        paddingBottom: 9,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      <Image
        source={IMAGE.spinnerloadgif}
        style={{width: 10, height: 10, marginRight: 5}}
      />
      <Text style={{color: 'white', fontSize: 13, fontWeight: 'bold'}}>
        Syncing Data with server...
      </Text>
    </View>
  );
};
