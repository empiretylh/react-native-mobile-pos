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
import AddNewCustomerModal from './AddNewCustomer';
/*
    This view is receipt voucher's view from the sales using
    first we need to get the data from the sales
    and then show the receipt numbers and the date

    if the user click the receipt number, it will show the receipt details
    and the user can edit the receipt details and print the receipt
    
*/

const CustomerView = ({route, navigation}) => {
  const {t, i18n} = useTranslation();
  const [customemrData, setCustomerData] = useState([]);
  const [type, setType] = useState('all');
  const [time, setTime] = useState('today');
  const [startd, setStartd] = useState('');
  const [endd, setEndd] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState('');

  const [showVoucher, setShowVoucher] = useState(false);
  const [vocherData, setVoucherData] = useState([]);
  const [showCustomer, setShowCustomer] = useState(false);

  const loaddata = () => {
    setIsLoading(true);
    axios
      .get('/api/customer/')
      .then(res => {
        console.log('Fetch Data from Sales Data');
        setCustomerData(res.data);
        setIsLoading(false);
        // ComputeSalesData(res.data, time);
        console.log('Successfully Setted Data ');
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };
  useMemo(() => {
    console.log('Fetching Sales Data');
    loaddata();
  }, []);

  /* Sales Data filter by search Text */

  const FilterCustomerData = useMemo(() => {
    if (customemrData.length === 0) return customemrData;
    if (searchText === '') return customemrData;

    return customemrData.filter(item => {
      return item.name.includes(searchText);
    });
  }, [searchText, customemrData]);

  //   console.log("Filter Sales Data", JSON.stringify(FilterSalesData[0]))

  const onCustomerAdd = ({customerName, description}) => {
    setIsLoading(true);
    axios
      .post('/api/customer/', {customerName, description})
      .then(res => {
        setIsLoading(false);
        loaddata();
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const RPItem = useCallback(({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('customersales', {data: item.sales});
        }}>
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            backgroundColor: C.white,
            margin: 5,
            borderRadius: 15,
            padding: 10,
            elevation: 1,
          }}>
          <View>
            <Text style={{...s.bold_label}}>
              {item.name == '' ? 'Unknown' : item.name}
            </Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              {t('TRemaing')} : {numberWithCommas(item.grandtotal)} Ks
            </Text>
          </View>
          <View>
            <Text style={{...s.normal_label}}>{item.sales.length} Voucher</Text>
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
      <AddNewCustomerModal
        show={showCustomer}
        onClose={() => setShowCustomer(false)}
        onAdd={onCustomerAdd}
      />
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 5,
          alginItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icons name="people" size={25} color={'#000'} />
          <Text style={{...s.bold_label, marginLeft: 4}}>Customer</Text>
        </View>
        <TouchableOpacity
          style={{...s.blue_button}}
          onPress={() => setShowCustomer(true)}>
          <Text style={{...s.bold_label, color: 'white'}}>
            + Add New Customer
          </Text>
        </TouchableOpacity>
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
          placeholder={'Search Customer'}
          onChangeText={e => setSearchText(e)}
        />

        <Icons name={'search'} size={30} color={'#000'} />
      </View>

      <View style={{flex: 1}}>
        {isLoading ? (
          <ActivityIndicator size="large" color={C.red} />
        ) : (
          <FlatList
            data={FilterCustomerData}
            renderItem={RPItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
};

export default CustomerView;
