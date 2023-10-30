/* eslint-disable no-extend-native */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {STYLE as s} from '../../../Database';
import '../../../assets/i18n/i18n';
import {UploadToCloud} from '../../../localDatabase/UploadToCloud';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {clearLocalData} from '../../../localDatabase/LocalDb';
import Sales from './sales';
import ExpenseLocal from './expense';
import ProductLocal from './ProductLocal';
import {ReloadContext} from '../context/ReloadContext';

const Tab = createMaterialTopTabNavigator();

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};
const LocalStorageReport = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const reloadValue = useMemo(() => ({reload, setReload}), [reload, setReload]);

  const UploadToServer = () => {
    setLoading(true);
    UploadToCloud()
      .catch(res => {
        setLoading(false);
        setReload(prev => !prev);
      })
      .then(res => {
        setLoading(false);
        setReload(prev => !prev);
      });
  };

  return (
    <ReloadContext.Provider value={reloadValue}>
      <KeyboardAvoidingView style={{...s.Container}}>
        {/* appbar */}
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            padding: 8,
          }}>
          <Text style={{...s.bold_label, fontSize: 20}}>Local Storage</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  '',
                  'Are you sure you want to delete all local data?',
                  [
                    {
                      text: 'Yes',
                      onPress: () => {
                        clearLocalData();
                      },
                    },
                    {
                      text: 'No',
                    },
                  ],
                );
              }}
              style={{marginRight: 3}}>
              <MCIcons name="delete" size={28} color={'#000'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                UploadToServer();
              }}>
              <MCIcons name="cloud-upload" size={28} color={'#000'} />
            </TouchableOpacity>
          </View>
        </View>
        {/* view */}
        <View style={{flex: 1}}>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: 'white',
                shadowOffset: {width: 0, height: 0},
                elevation: 0,
              },
            }}>
            <Tab.Screen name={'Sales'} component={Sales} />
            <Tab.Screen name={'Expense'} component={ExpenseLocal} />
            <Tab.Screen name={'Products'} component={ProductLocal} />
          </Tab.Navigator>
        </View>
        {loading ? (
          <View
            style={{
              ...s.flexrow_aligncenter_j_center,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                ...s.flexrow_aligncenter_j_center,
                backgroundColor: '#fff',
                padding: 25,
                borderRadius: 15,
              }}>
              <MCIcons name="cloud-upload" size={28} color={'#000'} />
              <Text style={{color: '#000', marginLeft: 10}}>Uploading...</Text>
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </ReloadContext.Provider>
  );
};

{
  /* <Stack.Screen name={'purchase'} component={Purchase} /> */
}

export default LocalStorageReport;

const inputS = {
  ...s.flexrow_aligncenter_j_between,
  borderRadius: 15,
  height: 45,
  borderColor: 'black',
  borderWidth: 1.5,
  padding: 10,
  paddingRight: 10,
  marginTop: 10,
};
