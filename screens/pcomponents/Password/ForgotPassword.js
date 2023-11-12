/* eslint-disable handle-callback-err */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useMemo, useState, useContext} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icons from 'react-native-vector-icons/Ionicons';
import {IMAGE, STYLE} from '../../../Database';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Loading from '../extra/Loading';
import LoadingModal from '../../Loading';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const DataContext = React.createContext();

const ForgotPassword = ({navigation, route}) => {
  const [data, setGData] = useState({
    username: '',
    email: '',
    otp: '',
    password: '',
  });

  const datavalue = useMemo(() => ({data, setGData}), [data, setGData]);

  const [load, setLoad] = useState(false);

  const [username, setUsername] = useState('');

  return (
    <DataContext.Provider value={datavalue}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="UserNameView" component={UserNameView} />
        <Stack.Screen name="OTP" component={OTPView} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
      </Stack.Navigator>
    </DataContext.Provider>
  );
};

const UserNameView = ({navigation}) => {
  const {data, setGData} = useContext(DataContext);
  const [username, setUsername] = useState('');
  const [load, setLoad] = useState(false);

  const PostToServer = () => {
    setLoad(true);

    axios
      .post('/auth/forgotpassword/', {username: username})
      .then(res => {
        console.log(res.data);
        setGData(prev => ({
          ...prev,
          username: username,
          email: res.data.email,
        }));
        navigation.navigate('OTP');
      })
      .catch(err => {
       
        Alert.alert("Error", "Cannot find your username!")
      })
      .finally(() => {
        setLoad(false);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingModal show={load} infotext={'Searching...'} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={IMAGE.app_logo}
          style={{width: 30, height: 30}}
          resizeMode={'contain'}
        />
        <Text
          style={{
            ...STYLE.bold_label,
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 5,
          }}>
          Forgot Password
        </Text>
      </View>

      <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
        Enter Username
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...STYLE.defaultTextInput,
        }}>
        <TextInput
          style={{
            flex: 1,
            fontWeight: 'bold',
          }}
          placeholder={'Username'}
          onChangeText={e => setUsername(e)}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (username === '')
            return Alert.alert('Error', 'Please Filled Required Field');

          PostToServer();
        }}>
        <View style={{...STYLE.blue_button, marginTop: 5, padding: 15}}>
          <Text
            style={{
              ...STYLE.bold_label,
              color: 'white',
            }}>
            Coninue
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const OTPView = ({navigation}) => {
  const {data, setGData} = useContext(DataContext);
  const [otp, setOTP] = useState('');
  const [load, setLoad] = useState(false);

  const PostToServer = () => {
    setLoad(true);

    axios
      .get('/auth/changepassword/?username=' + data.username + '&otp=' + otp)
      .then(res => {
        console.log(res.data);
        setGData(prev => ({
          ...prev,
          username: data.username,
          email: data.email,
          otp: otp,
        }));
        navigation.navigate('ChangePassword');
      })
      .catch(err => {
        console.log(err.response.data);
        Alert.alert('Error', 'Wrong OTP Code!');
      })
      .finally(() => {
        setLoad(false);
      });
  };

  function maskEmail(email) {
    const emailParts = email.split('@');
    return emailParts[0].substring(0, 4) + '*****@' + emailParts[1];
  }

  return (
    <ScrollView style={styles.container}>
      <LoadingModal show={load} infotext={'Changing...'} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={IMAGE.app_logo}
          style={{width: 30, height: 30}}
          resizeMode={'contain'}
        />
        <Text
          style={{
            ...STYLE.bold_label,
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 5,
          }}>
          OTP
        </Text>
      </View>
      <Text
        style={{
          color: 'black',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 18,
          marginTop: 10,
        }}>
        An OTP code has been sent to your email, {maskEmail(data.email)}. Please
        enter the OTP code to proceed.
      </Text>
      <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
        Enter OTP Code
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...STYLE.defaultTextInput,
        }}>
        <TextInput
          autoFocus={true}
          style={{
            flex: 1,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          placeholder={'XXXXXX'}
          onChangeText={e => setOTP(e)}
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (otp === '')
            return Alert.alert('Error', 'Please Filled Required Field');

          PostToServer();
        }}>
        <View style={{...STYLE.blue_button, marginTop: 5, padding: 15}}>
          <Text
            style={{
              ...STYLE.bold_label,
              color: 'white',
            }}>
            Coninue
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ChangePassword = ({navigation, route}) => {
  const {data, setGData} = useContext(DataContext);
  const [isfocus, setIsFocus] = useState({
    username: false,
    password: false,
  });

  const [load, setLoad] = useState(false);

  const [password, setPassword] = useState(null);
  const [repassword, setRePassword] = useState('');
  const [visible, setVisible] = useState(true);
  const {userToken, setUserToken} = useContext(AuthContext)

  const PostToServer = () => {
    setLoad(true);
    axios
      .post('/auth/changepassword/', {
        username: data.username,
        email: data.email,
        otp: data.otp,
        password: password,
      })
      .then(res => {
        Alert.alert('Success', 'Password Changed Successfully', [{
          text: 'OK',
          onPress: () => navigation.navigate(userToken ? 'main':'login'),
        }]);
        setLoad(false);
        Vibration.vibrate(200);
      })
      .catch(err => {
        console.log('ERROR', err);
        Alert.alert('Error', 'Cannot change your password');
        setLoad(false);
      });
  };
  return (
    <ScrollView style={styles.container}>
      <LoadingModal show={load} infotext={'Changing...'} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={IMAGE.app_logo}
          style={{width: 30, height: 30}}
          resizeMode={'contain'}
        />
        <Text
          style={{
            ...STYLE.bold_label,
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 5,
          }}>
          Change Password
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{flex: 1, position: 'relative', marginTop: 5, padding: 10}}>
        <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
          New Password
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...STYLE.defaultTextInput,
          }}>
          <TextInput
            style={{
              flex: 1,
              fontWeight: 'bold',
            }}
            placeholder={'New Password'}
            onChangeText={e => setPassword(e)}
            secureTextEntry={visible}
          />
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Icons
              name={visible ? 'eye' : 'eye-off'}
              size={25}
              color={'#000'}
            />
          </TouchableOpacity>
        </View>
        <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
          Re-type New Password
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...STYLE.defaultTextInput,
          }}>
          <TextInput
            style={{
              flex: 1,
              fontWeight: 'bold',
            }}
            placeholder={'Re-type New Password'}
            onChangeText={e => setRePassword(e)}
            secureTextEntry={visible}
          />
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Icons
              name={
                repassword === password ? 'checkmark-circle' : 'close-circle'
              }
              size={25}
              color={'#000'}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (password === '' || repassword === '')
              return Alert.alert('Error', 'Please Filled Required Field');

            if (repassword === password) {
              PostToServer();
            } else {
              Alert.alert('Error', "Didn't match passwords", [{text: 'OK'}]);
            }
          }}>
          <View style={{...STYLE.blue_button, marginTop: 5, padding: 15}}>
            <Text
              style={{
                ...STYLE.bold_label,
                color: 'white',
              }}>
              Change Password
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={{color: 'black', textAlign: 'center'}}>
          Don't forget your password. Make sure your password is secure and easy
          to remember.
        </Text>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...STYLE.Container,
  },
});

export default ForgotPassword;
