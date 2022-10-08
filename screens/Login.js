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
} from 'react-native';
import axios from 'axios';
import {IMAGE, COLOR, STYLE} from '../Database';
import Icons from 'react-native-vector-icons/Ionicons';
import LoadingModal from './Loading';
import EncryptedStorage from 'react-native-encrypted-storage';

<<<<<<< HEAD
String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};
const LoginScreen = ({navigation, route}) => {
=======
const LoginScreen = ({navigation,route}) => {
>>>>>>> refs/remotes/origin/master
  const {token} = route.params;
  const [data, setData] = useState();
  const [isfocus, setIsFocus] = useState({
    username: false,
    password: false,
  });
  const [visible, setVisible] = useState(true);
  const [load, setLoad] = useState(false);

  const LoginToServer = () => {
    console.log(data);
    setLoad(true);
    axios
      .post('/auth/login/', data, {timeout: 5000})
      .then(res => {
        setLoad(false);
        console.log(res.data.token);
        SaveToken(res.data.token);

        axios.defaults.headers.common = {
          Authorization: `Token ${res.data.token}`,
        };
<<<<<<< HEAD
        token(res.data.token);
=======
        token(res.data.token)
>>>>>>> refs/remotes/origin/master
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        console.log(err);
        if (err.response.status == 400) {
          Alert.alert('Login Failed', 'Username or Password is incorrect.', [
            {
              text: 'OK',
            },
          ]);
        }
        setLoad(false);
      });
  };

  const HandleChange = (name, e) => {
    const temp = {...data, [name]: e};
<<<<<<< HEAD

=======
>>>>>>> refs/remotes/origin/master
    setData(temp);
    console.log(temp);
  };

  const SaveToken = async token => {
    await EncryptedStorage.setItem('secure_token', token);
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingModal show={load} />
      <Text
        style={{
          ...STYLE.bold_label,
          marginTop: 5,
          marginBottom: 5,
        }}>
        Login
      </Text>
      <Image
        source={IMAGE.app_logo}
        style={{width: '100%', height: COLOR.windowHeight * 30}}
        resizeMode={'contain'}
      />
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
<<<<<<< HEAD
          value={data ? (data.username ? data.username : '') : null}
          onChangeText={e => HandleChange('username', e.replaceAllTxt(' ', ''))}
=======
          onChangeText={e => HandleChange('username', e)}
>>>>>>> refs/remotes/origin/master
          onFocus={e => {
            let temp = {username: true, password: false};
            setIsFocus(temp);
            console.log(isfocus);
          }}
<<<<<<< HEAD
          autoComplete={'username'}
=======
>>>>>>> refs/remotes/origin/master
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
<<<<<<< HEAD
              fontWeight: 'bold',
=======
              fontWeight:'bold'
>>>>>>> refs/remotes/origin/master
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...STYLE.Container,
  },
});

export default LoginScreen;
