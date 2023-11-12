/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useState} from 'react';
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

const Stack = createNativeStackNavigator();

const ChangePassword = ({navigation, route}) => {
  const [data, setGData] = useState();
  const [isfocus, setIsFocus] = useState({
    username: false,
    password: false,
  });

  const [load, setLoad] = useState(false);

  const [oldpassword, setOldPasswod] = useState('');
  const [password, setPassword] = useState(null);
  const [repassword, setRePassword] = useState('');
  const [visible, setVisible] = useState(true);

  const PostToServer = () => {
    setLoad(true);
    axios
      .post('/auth/changepassword/', {
        oldpassword: oldpassword,
        password: password,
      })
      .then(res => {
        Alert.alert('Success', 'Password Changed Successfully', [{
          text: 'OK',
          onPress: () => navigation.goBack(),
        }]);
        setLoad(false);
        Vibration.vibrate(200);
      })
      .catch(err => {
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

      <Text style={{...STYLE.normal_label, marginTop: 10, marginLeft: 5}}>
        Old Password
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
          placeholder={'Old Password'}
          onChangeText={e => setOldPasswod(e)}
          secureTextEntry={visible}
        />
        <TouchableOpacity onPress={() => setVisible(!visible)}>
          <Icons name={visible ? 'eye' : 'eye-off'} size={25} color={'#000'} />
        </TouchableOpacity>
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
            if (oldpassword === '' || password === '' || repassword === '')
              return Alert.alert('Error', 'Please Filled Required Field');

            if (repassword === password && oldpassword !== '') {
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

export default ChangePassword;
