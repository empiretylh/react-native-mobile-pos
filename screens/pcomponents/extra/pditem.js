/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback, useMemo, memo} from 'react';
import {View, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MessageModalNormal} from '../../MessageModal';
import {
  STYLE as s,
  COLOR as C,
  IMAGE as i,
  ALERT as a,
} from '../../../Database';
import axios from 'axios';
import {numberWithCommas} from '../../../Database';
import SwitchToCart from './SwitchToCart';

const PDITEM = ({item}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 10,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
      }}>
      <Image
        source={{
          uri:
            item.pic === '/media/null' || item.pic === null
              ? 'https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png'
              : axios.defaults.baseURL + item.pic,
        }}
        style={{width: 50, height: 50}}
        resizeMode={'cover'}
        resizeMethod={'resize'}
      />
      <View style={{flexDirection: 'column'}}>
        <View style={{...s.flexrow_aligncenter_j_center}}>
          <Text style={{...s.bold_label, margin: 5}}>{item.name}</Text>
          <Text
            style={{
              ...s.normal_label,

              padding: 5,
              backgroundColor: C.blackbutton,

              color: 'white',
            }}>
            {item.qty}
          </Text>
        </View>
        <Text style={{...s.normal_label, margin: 5}}>
          {numberWithCommas(item.price)} MMK
        </Text>
      </View>
      <View style={{position: 'absolute', right: 5, bottom: 0}}>
        <SwitchToCart item={item} />
      </View>
    </View>
  );
};

export default PDITEM;
