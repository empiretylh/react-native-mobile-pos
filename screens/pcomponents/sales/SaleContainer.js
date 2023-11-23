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
import ProductView  from "./ProductView"

const Tab = createMaterialTopTabNavigator();


const SaleContainer = ({navigation})=>{

  const [screen, setScreen] = useState([1])

  return(
    <View style={{flex:1, backgroundColor:'white'}}>
    <View style={{justifyContent:'flex-end'}}>
      <TouchableOpacity style={{...s.blue_button}} onPress={()=>{
        setScreen(prev=> [...prev, 1])
      }}>
        <Text style={{color:'white'}}>Create New Sales</Text>
      </TouchableOpacity>
    </View>
     <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                shadowOffset: {width: 0, height: 0},
                elevation: 0,
              },
            }}>
            {
              screen.map((item,index)=>
                <Tab.Screen name={'Sale '+( parseInt(index+1))} component={ProductView}/>
              )
            }

          </Tab.Navigator>
          </View>
    )
}

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

