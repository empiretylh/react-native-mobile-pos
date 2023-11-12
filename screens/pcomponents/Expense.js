/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {TextInput} from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/Ionicons';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ALERT as a, numberWithCommas, STYLE as s} from '../../Database';
import Loading from '../Loading';
import {MessageModalNormal} from '../MessageModal';

import {useTranslation} from 'react-i18next';
import '../../assets/i18n/i18n';
const Stack = createNativeStackNavigator();

import axios from 'axios';
import {useNetInfo} from '@react-native-community/netinfo';
import {insertExpense} from '../../localDatabase/expense';

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};
const Expense = ({navigation}) => {
  const [ProductData, setProductData] = useState([]);
  const [load, setLoad] = useState(false);

  const {t, i18n} = useTranslation();

  useEffect(() => {
    if (load === false) {
      setTimeout(() => {
        Load();
      }, 1000);
    }
  }, []);

  const Load = () => {
    setLoad(true);
  };

  const SumProductBalance = pd => {
    let price = 0;
    pd.forEach(item => {
      price +=
        parseInt(item.price.replaceAllTxt(',', '').replaceAllTxt(' ', '')) *
        parseInt(item.qty);
    });

    return price;
  };

  const ExpenseView = () => {
    useEffect(() => {}, []);

    const [dopen, setDopen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [expensedata, setExpenseData] = useState({
      date:
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      description: '',
    });

    const handleExpense = (e, name) => {
      const temp = {...expensedata, [name]: e};
      setExpenseData(temp);
    };

    const [isCreate, setCreate] = useState(false);
    const [isSucces, setSuccess] = useState(false);

    const {isConnected, isInternetReachable} = useNetInfo();

    const CreateExpense = data => {
      setCreate(true);
      if (isConnected) {
        axios
          .post('/api/expenses/', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(res => {
            console.log(res);
            setCreate(false);
            setSuccess(true);
          })
          .catch(err => {
            console.log(err);
            a.spe();
            insertExpense(
              data.title,
              data.price,
              data.date,
              data.description,
              1,
            );
            setCreate(false);
            setSuccess(true);
          });
      } else {
        //  (title, price, date, description, user_id)
        insertExpense(data.title, data.price, data.date, data.description, 1);
        setCreate(false);
        setSuccess(true);
      }
      setExpenseData({
        date:
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate(),
        description: '',
      });
    };

    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <Loading show={isCreate} infotext={'Creating Expense Receipt'} />
        <MessageModalNormal show={isSucces} onClose={() => setSuccess(false)}>
          <Text style={{...s.bold_label}}>{t('RSC')}</Text>
          <TouchableOpacity
            onPress={() => setSuccess(false)}
            style={{
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              backgroundColor: 'green',
            }}>
            <Text style={{...s.bold_label, color: 'white'}}>{t('OK')}</Text>
          </TouchableOpacity>
        </MessageModalNormal>
        <View style={{flex: 1, padding: 10}}>
          <Text style={{...s.bold_label, marginTop: 8}}>{t('Title')}</Text>
          <TextInput
            value={expensedata?.title}
            style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
            placeholder={t('Title')}
            onChangeText={e => handleExpense(e, 'title')}
          />
          <Text style={{...s.bold_label, marginTop: 8}}>{t('Price')}</Text>
          <TextInput
            style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
            placeholder={t('Price')}
            value={numberWithCommas(expensedata.price ? expensedata.price : '')}
            onChangeText={e => handleExpense(e.replaceAllTxt(',', ''), 'price')}
            keyboardType={'number-pad'}
            selectTextOnFocus
          />
          <Text style={{...s.bold_label, marginTop: 8}}>{t('Date')}</Text>
          <View
            style={{
              ...inputS,
              ...s.flexrow_aligncenter_j_between,
              padding: 0,
              paddingLeft: 10,
            }}>
            <TextInput
              style={{
                ...s.bold_label,
                color: '#0f0f0f',
              }}
              placeholder={'Date'}
              value={date.toLocaleDateString()}
              defaultValue={date.toLocaleDateString()}
            />
            <TouchableOpacity onPress={() => setDopen(true)}>
              <Icons name={'calendar'} size={20} color={'#000'} />
            </TouchableOpacity>
            <DatePicker
              modal
              open={dopen}
              date={date}
              mode={'date'}
              onConfirm={date => {
                setDopen(false);
                setDate(date);
                var s =
                  date.getFullYear() +
                  '-' +
                  (date.getMonth() + 1) +
                  '-' +
                  date.getDate();
                console.log(s);
                handleExpense(s, 'date');
              }}
              onCancel={() => {
                setDopen(false);
              }}
            />
          </View>

          <Text style={{...s.bold_label, marginTop: 8}}>
            {t('Description')}
          </Text>
          <TextInput
            value={expensedata?.description}
            style={{
              ...inputS,
              ...s.bold_label,
              color: '#0f0f0f',
              height: 100,
            }}
            placeholder={t('Description')}
            onChangeText={e => handleExpense(e, 'description')}
            multiline
          />
          <TouchableOpacity
            onPress={() => {
              if (expensedata.title && expensedata.price) {
                CreateExpense(expensedata);
              } else {
                a.rqf();
              }
            }}
            style={{...s.blue_button, marginTop: 8, padding: 10}}>
            <Text style={{...s.bold_label, color: 'white'}}>
              {t('Create_Receipt')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView style={{...s.Container}}>
      {/* appbar */}
      <View
        style={{
          ...s.flexrow_aligncenter_j_between,
          padding: 8,
        }}>
        <Text style={{...s.bold_label, fontSize: 23}}>{t('Expense')}</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate('expensereceipt')}>
            <MIcons name={'file-chart'} size={25} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>
      {/* view */}

      <View style={{flex: 1}}>{ExpenseView()}</View>
    </KeyboardAvoidingView>
  );
};

{
  /* <Stack.Screen name={'purchase'} component={Purchase} /> */
}

export default Expense;

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
