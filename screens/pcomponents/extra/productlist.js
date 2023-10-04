// Create products list view and selectable this list view and export barcode for selected products according to their qty


// Path: react-native-mobile-pos/screens/pcomponents/extra/switchtocart.js
// Compare this snippet from react-native-mobile-pos/screens/pcomponents/extra/pditem.js:
import React from 'react';
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
import {View, Text } from 'react-native';


const ProductsList = ()=>{
    return (
        <View>
            <Text> Product Lists </Text>
        </View>
    )
}


export default ProductsList;