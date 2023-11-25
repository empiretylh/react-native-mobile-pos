/* eslint-disable react-native/no-inline-styles */
import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import axios from 'axios';
import {baseUrl, numberWithCommas} from '../../../Database';
import {STYLE as s, COLOR as C, IMAGE as I} from '../../../Database';
import Icons from 'react-native-vector-icons/MaterialIcons';
import IIcons from 'react-native-vector-icons/Ionicons';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import VoucherDetails from './VocherView';
import AddNewCustomerModal from './AddNewCustomer';
import {useCustomer} from '../extra/CustomerDataProvider';
import {RefreshControl} from 'react-native-gesture-handler';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ProductView from './ProductView';

const Stack = createNativeStackNavigator();

const SaleContainer = ({navigation}) => {
  const [screen, setScreen] = useState([1]);
  const [selected, setSelected] = useState(1);

  //Remove by index
  const onRemove = (index)=>{
    if(screen.length==1) return Alert.alert("","You can not remove all sales")
    Alert.alert("", "Are you sure want to remove this sale?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel"
      },
      {
        text: "Remove",
        onPress: () => {
          setScreen(prev => prev.filter((item, i) => i != index));
          setSelected(1);
        }
      }
    ]);
    
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{flexDirection: 'row', maxHeight: 50}} horizontal>
        {screen.map((item, index) => (
          <TouchableOpacity
            style={{
              ...s.blue_button,
              backgroundColor: '#f0f0f0',
              borderColor: selected == index + 1 ? C.bluecolor : C.white,
              borderWidth: 2,
              flexDirection: 'row',
            }}
            onPress={() => {
              setSelected(index + 1);
              navigation.navigate('Sale' + (index + 1));
            }}>
            <Text style={{color: 'black', marginRight: 5}}>
              Sales {index + 1}
            </Text>
            <TouchableOpacity
            onPress={()=>onRemove(index)}
              style={{padding: 2, backgroundColor: 'red', borderRadius: 50}}>
              <Icons name={'close'} size={15} color={'white'} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={{...s.blue_button}}
          onPress={() => {
            setScreen(prev => [...prev, 1]);
          }}>
          <Text style={{color: 'white'}}> + Create New Sales</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={{flex: 1}}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          {screen.map((item, index) => (
            <Stack.Screen
              name={'Sale' + parseInt(index + 1)}
              component={ProductView}
            />
          ))}
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default SaleContainer;
/*

   <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: 'white',
                shadowOffset: {width: 0, height: 0},
                elevation: 0,
              },
            }}>
            <Tab.Screen name={t('Table')} component={TableView} />
            <Tab.Screen name={t('Chart')} component={ChartView} />
            <Tab.Screen name={t('Profit&Loss')} component={ProfitnLossView} />
          </Tab.Navigator>
          */
