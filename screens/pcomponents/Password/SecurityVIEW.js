/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';

import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// this view include change password and forgot password

const SecurityView = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alginItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
        }}>
        <Icon
          name="shield-checkmark-outline"
          size={25}
          color={'#000'}
          style={{marginRight: 3}}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',

            color: 'black',
          }}>
          Security
        </Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('changepassword')}>
        <View
          style={{
            backgroundColor: 'blue',
            height: 50,
            width: '90%',
            alignSelf: 'center',
            marginTop: 30,
            borderRadius: 10,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'black',
            }}>
            Change Password
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('forgotpassword')}>
        <View
          style={{
            backgroundColor: 'red',
            height: 50,
            width: '90%',
            alignSelf: 'center',
            marginTop: 30,
            borderRadius: 10,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'black',
            }}>
            Forgot Password
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SecurityView;
