/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import axios from 'axios';
import {IMAGE, COLOR, STYLE} from '../Database';
import Icons from 'react-native-vector-icons/Ionicons';
import LoadingModal from './Loading';
import EncryptedStorage from 'react-native-encrypted-storage';
import DeviceInfo from 'react-native-device-info';

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};
const LoginScreen = ({navigation, route}) => {
  const {token} = route.params;
  const [data, setData] = useState({username:'', password:''});
  const [isfocus, setIsFocus] = useState({
    username: false,
    password: false,
  });
  const [visible, setVisible] = useState(true);
  const [load, setLoad] = useState(false);
  const [baseURLShow, setBaseURLShow] = useState(false);
  const [baseURL, setBaseURL] = useState('');
  const [showBaseURL, setShowBaseURL] = useState(false);

  useEffect(() => {
    // Load base URL on mount
    EncryptedStorage.getItem('base_url')
      .then(res => {
        if (res !== null) {
          setBaseURL(res);
          axios.defaults.baseURL = res;
        }
      })
      .catch(err => console.log(err));
  }, []);

  const LoginToServer = () => {
    if(!data.username)  return Alert.alert("","Please Enter Username & Password")

    if(data.username == '' || data.password == '') return Alert.alert("","Please Enter Username & Password")
   
    console.log(data);
    setLoad(true);
    axios
      .post(
        '/auth/login/',
        {
          username: data.username,
          password: data.password,
          unique_id: DeviceInfo.getUniqueIdSync(),
          device_name: DeviceInfo.getDeviceNameSync(),
          acc_type: 'Admin',
        },
        {timeout: 5000},
      )
      .then(res => {
        setLoad(false);
        console.log(res.data.token);
        SaveToken(res.data.token);

        axios.defaults.headers.common = {
          Authorization: `Token ${res.data.token}`,
        };
        token(res.data.token);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        console.log(err);
        Alert.alert('Login Failed', 'Username or Password is incorrect.', [
          {
            text: 'OK',
          },
        ]);
        setLoad(false);
      });
  };

  const HandleChange = (name, e) => {
    const temp = {...data, [name]: e};

    setData(temp);
    console.log(temp);
  };

  const SaveToken = async token => {
    await EncryptedStorage.setItem('secure_token', token);
  };

  const handleSaveBaseURL = async () => {
    if (!baseURL) {
      Alert.alert('', 'Please enter a valid URL');
      return;
    }
    try {
      await EncryptedStorage.setItem('base_url', baseURL);
      axios.defaults.baseURL = baseURL;
      setBaseURLShow(false);
      Alert.alert('', 'Base URL updated successfully');
    } catch (err) {
      console.log('Error saving base URL:', err);
      Alert.alert('', 'Failed to save Base URL');
    }
  };

  return (
    <ScrollView style={{...styles.container}}>
      <LoadingModal show={load} />
      {/* Base URL Modal */}
      {baseURLShow && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 15,
              width: '90%',
            }}>
            <Text style={{...STYLE.bold_label, marginBottom: 10}}>
              Server URL
            </Text>
            <Text style={{...STYLE.normal_label, color: '#666', marginBottom: 10}}>
              Change the server URL for API connections
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                marginBottom: 15,
              }}>
              <TextInput
                style={{
                  flex: 1,
                  ...STYLE.defaultTextInput,
                  borderBottomWidth: 0,
                  margin: 0,
                }}
                placeholder="Enter server URL"
                value={baseURL}
                onChangeText={e => setBaseURL(e)}
                secureTextEntry={!showBaseURL}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowBaseURL(!showBaseURL)}>
                <Icons
                  name={showBaseURL ? 'eye' : 'eye-off'}
                  size={20}
                  color={'#000'}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{...STYLE.blue_button, padding: 10}}
              onPress={handleSaveBaseURL}>
              <Text style={{...STYLE.bold_label, color: 'white'}}>Save URL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...STYLE.black_button, padding: 10, marginTop: 5}}
              onPress={() => setBaseURLShow(false)}>
              <Text style={{...STYLE.bold_label, color: 'white'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text
          style={{
            ...STYLE.bold_label,
            marginTop: 5,
            marginBottom: 5,
          }}>
          Login
        </Text>
        <TouchableOpacity onPress={() => setBaseURLShow(true)}>
          <Icons name={'settings-outline'} size={25} color={'#000'} />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={IMAGE.app_logo}
          style={{
            width: 250,
            height: 250,
            borderRadius: 250,
          }}
          resizeMode={'contain'}
        />
      </View>
      <KeyboardAvoidingView
        style={{flex: 1, position: 'relative', marginTop: 5, padding: 10}}>
        <Text style={{...STYLE.normal_label, marginTop: 10}}>Username </Text>
        <TextInput
          style={{
            ...STYLE.defaultTextInput,
            borderBottomColor: isfocus.username ? 'blue' : 'black',
            marginTop: 10,
          }}
          placeholder={'Username'}
          value={data ? (data.username ? data.username : '') : null}
          onChangeText={e => HandleChange('username', e.replaceAllTxt(' ', ''))}
          onFocus={e => {
            let temp = {username: true, password: false};
            setIsFocus(temp);
            console.log(isfocus);
          }}
          autoComplete={'username'}
        />
        <Text style={{...STYLE.normal_label, marginTop: 10}}>Password </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...STYLE.defaultTextInput,
            borderBottomColor: isfocus.password ? 'blue' : 'black',
          }}>
          <TextInput
            style={{
              flex: 1,
              fontWeight: 'bold',
            }}
            placeholder={'Password'}
            onChangeText={e => HandleChange('password', e)}
            onFocus={e => {
              let temp = {username: false, password: true};
              setIsFocus(temp);
              console.log(isfocus);
            }}
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
        <TouchableOpacity onPress={() => navigation.navigate('forgotpassword')}>
          <View>
            <Text
              style={{
                ...STYLE.normal_label,
                color: 'black',
                textDecorationLine: 'underline',
                padding: 5,
              }}>
              Forgot Password?
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => LoginToServer()}>
          <View style={{...STYLE.blue_button, marginTop: 5, padding: 15}}>
            <Text
              style={{
                ...STYLE.bold_label,
                color: 'white',
              }}>
              Login
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('register')}>
          <View style={{...STYLE.black_button, marginTop: 5, padding: 15}}>
            <Text
              style={{
                ...STYLE.bold_label,
                color: 'white',
              }}>
              Create Account
            </Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <Text style={{color: 'black', textAlign: 'center', bottom: 0}}>
        Copyright © 2022
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...STYLE.Container,
  },
});

export default LoginScreen;
