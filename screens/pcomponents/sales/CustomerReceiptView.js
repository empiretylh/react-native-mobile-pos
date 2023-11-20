/* eslint-disable react-native/no-inline-styles */
import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import axios from 'axios';
import {baseUrl, numberWithCommas} from '../../../Database';
import {STYLE as s, COLOR as C, IMAGE as I} from '../../../Database';
import Icons from 'react-native-vector-icons/MaterialIcons';

import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import VoucherDetails from './VocherView';
/*
    This view is receipt voucher's view from the sales using
    first we need to get the data from the sales
    and then show the receipt numbers and the date

    if the user click the receipt number, it will show the receipt details
    and the user can edit the receipt details and print the receipt
    
*/

const CustomerReceiptView = ({route, navigation}) => {
  const {data} = route.params;

  const {t, i18n} = useTranslation();
  const [salesData, setSalesData] = useState(data);
  const [type, setType] = useState('all');
  const [time, setTime] = useState('today');
  const [startd, setStartd] = useState('');
  const [endd, setEndd] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState('');

  const [showVoucher, setShowVoucher] = useState(false);
  const [vocherData, setVoucherData] = useState([]);

  /* Sales Data filter by search Text */

  const FilterSalesData = useMemo(() => {
    if (salesData.length === 0) return salesData;
    if (searchText === '') return salesData;

    return salesData.filter(item => {
      return (
        item.voucherNumber.includes(searchText) ||
        item.customerName.includes(searchText)
      );
    });
  }, [searchText, salesData]);

  //   console.log("Filter Sales Data", JSON.stringify(FilterSalesData[0]))

  const RPItem = useCallback(({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setShowVoucher(true);
          setVoucherData(item);
        }}>
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            backgroundColor: C.white,
            margin: 5,
            borderRadius: 15,
            padding: 10,
            elevation: 1,
            backgroundColor: C.white,
          }}>
          <View>
            <Text style={{...s.bold_label}}>
              {item.customerName == '' ? 'Unknown' : item.customerName}
            </Text>
            <Text style={{...s.normal_label}}>{item.voucherNumber}</Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              Total : {numberWithCommas(item.grandtotal)} Ks
            </Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              Total : {numberWithCommas(item.customer_payment)} Ks
            </Text>
          </View>
          <View>
            <Text style={{...s.normal_label}}>
              {new Date(item.date)
                .toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
                .toString()}
            </Text>
            <Text style={{...s.normal_label}}>
              {new Date(item.date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#f0f0f0'}}>
      <VoucherDetails
        open={showVoucher}
        onClose={() => setShowVoucher(false)}
        data={vocherData}
        setData={setVoucherData}
        navigation={navigation}
        reload={() => setEndd(true)}
      />
      <View style={{flexDirection: 'row', marginBottom: 5}}>
        <MIcons name="file-chart" size={25} color={'#000'} />
        <Text style={{...s.bold_label, marginLeft: 3}}>
          {salesData[0].customerName + "'s Vourcher Lists"}
        </Text>
      </View>
      <View
        style={{
          ...s.flexrow_aligncenter_j_between,
          borderRadius: 15,
          height: 45,
          borderColor: 'black',
          borderWidth: 1.5,
          paddingRight: 10,
        }}>
        <TextInput
          style={{
            padding: 10,
            flex: 1,
            fontWeight: '900',
          }}
          placeholder={'Search Receipt Number'}
          onChangeText={e => setSearchText(e)}
        />

        <Icons name={'search'} size={30} color={'#000'} />
      </View>

      <View style={{flex: 1}}>
        {isLoading ? (
          <ActivityIndicator size="large" color={C.red} />
        ) : (
          <FlatList
            data={FilterSalesData}
            renderItem={RPItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
};

export default CustomerReceiptView;
