/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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
  ListView,
} from 'react-native';
import axios from 'axios';
import {IMAGE, COLOR, STYLE} from '../Database';
import Icons from 'react-native-vector-icons/Ionicons';
import LoadingModal from './Loading';
import EncryptedStorage from 'react-native-encrypted-storage';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  validateEmail,
  validatePhoneNumber,
  validateShopName,
  validateUsername,
} from './Validation';
import {use} from 'i18next';

const Stack = createNativeStackNavigator();

const SignUp = ({navigation, route}) => {
  const {token} = route.params;
  const [data, setGData] = useState();
  const [isfocus, setIsFocus] = useState({
    username: false,
    password: false,
  });

  const [load, setLoad] = useState(false);

  const RegisterToServer = data => {
    console.log(data);
    setLoad(true);
    axios
      .post('/auth/register/', data, {timeout: 5000})
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
        if (err.response.status == 400) {
          Alert.alert('Register Failed', 'register failed try again', [
            {
              text: 'OK',
            },
          ]);
        }
        setLoad(false);
      });
  };

  const SaveToken = async token => {
    await EncryptedStorage.setItem('secure_token', token);
  };

  const First = ({navigation}) => {
    const [data, setData] = useState();
    const [isValidation, setIsValidation] = useState({
      username: false,
      name: false,
      phoneno: false,
      email: false,
    });

    const HandleChange = (name, e, v) => {
      const temp = {...data, [name]: e};
      const validation = {...isValidation, [name]: v};
      console.log(validation);
      setIsValidation(validation);
      setData(temp);
      console.log(temp);
    };

    return (
      <ScrollView style={styles.container}>
        <LoadingModal show={load} />
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
            Register
          </Text>
        </View>
        <KeyboardAvoidingView
          style={{flex: 1, position: 'relative', marginTop: 5, padding: 10}}>
          <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
            Username
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
                fontSize: 18,
              }}
              placeholder={'Username'}
              onChangeText={e =>
                HandleChange('username', e, validateUsername(e))
              }
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Icons
                name={
                  isValidation.username ? 'checkmark-circle' : 'close-circle'
                }
                size={25}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
          <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
            Shop Name
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
                fontSize: 18,
              }}
              placeholder={'Shop Name'}
              onChangeText={e => HandleChange('name', e, validateShopName(e))}
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Icons
                name={isValidation.name ? 'checkmark-circle' : 'close-circle'}
                size={25}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
          <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
            Address
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
                fontSize: 18,
              }}
              placeholder={'Address'}
              onChangeText={e =>
                HandleChange('address', e, validateShopName(e))
              }
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Icons
                name={
                  isValidation.address ? 'checkmark-circle' : 'close-circle'
                }
                size={25}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
          <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
            Phone Number
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
                fontSize: 18,
              }}
              placeholder={'Phone Number'}
              onChangeText={e =>
                HandleChange('phoneno', e, validatePhoneNumber(e))
              }
              keyboardType={'phone-pad'}
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Icons
                name={
                  isValidation.phoneno ? 'checkmark-circle' : 'close-circle'
                }
                size={25}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>

          <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
            Email
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
                fontSize: 18,
              }}
              placeholder={'Email'}
              keyboardType={'email-address'}
              onChangeText={e => HandleChange('email', e, validateEmail(e))}
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Icons
                name={isValidation.email ? 'checkmark-circle' : 'close-circle'}
                size={25}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (
                isValidation.username &&
                isValidation.phoneno &&
                isValidation.email &&
                isValidation.name
              ) {
                navigation.navigate('second');
                setGData(data);
              } else {
                Alert.alert('', 'Please fill required fields', [{title: 'OK'}]);
              }
            }}>
            <View style={{...STYLE.blue_button, marginTop: 5, padding: 15}}>
              <Text
                style={{
                  ...STYLE.bold_label,
                  color: 'white',
                }}>
                Continue
              </Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };
  const Second = ({navigation}) => {
    const [password, setPassword] = useState(null);
    const [repassword, setRePassword] = useState('');
    const [visible, setVisible] = useState(true);
    return (
      <ScrollView style={styles.container}>
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
            Create Password
          </Text>
        </View>

        <KeyboardAvoidingView
          style={{flex: 1, position: 'relative', marginTop: 5, padding: 10}}>
          <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
            Password
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
              placeholder={'Password'}
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
            Re-type Password
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
              placeholder={'Password'}
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
              if (repassword === password) {
                let temp = {...data, ['password']: password};
                setGData(temp);
                RegisterToServer(temp);
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
                Continue
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={{color: 'black', textAlign: 'center'}}>
          Don't forget your password. Make sure your password is secure and easy to remember.
          </Text>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={'first'} component={First} initial />
        <Stack.Screen name={'second'} component={Second} initial />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...STYLE.Container,
  },
});

export default SignUp;
