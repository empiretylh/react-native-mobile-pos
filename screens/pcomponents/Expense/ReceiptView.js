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
  Alert,
} from 'react-native';
import axios from 'axios';
import {ALERT, baseUrl, numberWithCommas} from '../../../Database';
import {STYLE as s, COLOR as C, IMAGE as I} from '../../../Database';
import Icons from 'react-native-vector-icons/MaterialIcons';

import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import LoadingModal from '../../Loading';
/*
    This view is receipt voucher's view from the sales using
    first we need to get the data from the sales
    and then show the receipt numbers and the date

    if the user click the receipt number, it will show the receipt details
    and the user can edit the receipt details and print the receipt
    
*/

const ExpenseReceiptView = ({route, navigation}) => {
  const {t, i18n} = useTranslation();
  const [expenseData, setExpenseData] = useState([]);
  const [type, setType] = useState('all');
  const [time, setTime] = useState('today');
  const [startd, setStartd] = useState('');
  const [endd, setEndd] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');

  const [showVoucher, setShowVoucher] = useState(false);
  const [vocherData, setVoucherData] = useState([]);

  useMemo(() => {
    console.log('Fetching Sales Data');
    setIsLoading(true);
    axios
      .get('/api/expenses/', {
        params: {
          type: type,
          time: time,
          startd: startd,
          endd: endd,
        },
      })
      .then(res => {
        console.log('Fetch Data from Sales Data');
        setExpenseData(res.data.DATA);
        setIsLoading(false);
        // ComputeSalesData(res.data, time);
        console.log('Successfully Setted Data ');
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, [type, time, startd, endd]);

  /* Sales Data filter by search Text */

  const filterExpenseData = useMemo(() => {
    if (expenseData.length === 0) return expenseData;
    if (searchText === '') return expenseData;

    return expenseData.filter(item => {
      return (
        item.title.includes(searchText) || item.description.includes(searchText)
      );
    });
  }, [searchText, expenseData]);

  const onDelete = async id => {
    console.log('Delete ID', id);
    setLoading(true);
    axios
      .delete('/api/expenses/?id=' + id)
      .then(res => {
        Alert.alert('Success', 'Successfully Deleted');
        setLoading(false);
        setEndd(new Date());
      })
      .catch(rerr => {
        Alert.alert('Error', 'Something went wrong');
        setLoading(false);
      });
  };

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
          }}>
          <View>
            <Text style={{...s.bold_label}}>
              {item.title == '' ? 'Unknown' : item.title}
            </Text>
            <Text style={{...s.normal_label}}>
              {new Date(item.date)
                .toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
                .toString()}
            </Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              Total : {numberWithCommas(item.price)} Ks
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => ALERT.aswantodelete(onDelete, item.id)}>
              <Icons name="delete" size={23} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#f0f0f0'}}>
      <View style={{flexDirection: 'row', marginBottom: 5}}>
        <MIcons name="file-chart" size={25} color={'#000'} />
        <Text style={{...s.bold_label}}>Expense Receipt</Text>
      </View>
      <LoadingModal show={loading} infotext="Deleting" />
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
          placeholder={'Search Expense'}
          onChangeText={e => setSearchText(e)}
        />

        <Icons name={'search'} size={30} color={'#000'} />
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          underlayColor="white"
          onPress={() => {
            setTime('today');
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: C.blackbutton,
              margin: 5,
              borderRadius: 15,
            }}>
            <Text style={{color: 'white', padding: 10}}>{t('Today')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          underlayColor="white"
          onPress={() => {
            setTime('month');
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: C.blackbutton,
              margin: 5,
              borderRadius: 15,
            }}>
            <Text style={{color: 'white', padding: 10}}>{t('This_Month')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          underlayColor="white"
          onPress={() => {
            setTime('year');
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: C.blackbutton,
              margin: 5,
              borderRadius: 15,
            }}>
            <Text style={{color: 'white', padding: 10}}>{t('This_Year')}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        {isLoading ? (
          <ActivityIndicator size="large" color={C.red} />
        ) : (
          <FlatList
            data={filterExpenseData}
            renderItem={RPItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
};

export default ExpenseReceiptView;
