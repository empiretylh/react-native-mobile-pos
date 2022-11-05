/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {STYLE as s, ALERT as a, numberWithCommas} from '../../Database';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MessageModalNormal} from '../MessageModal';
import DatePicker from 'react-native-date-picker';
import Loading from '../Loading';

import {useTranslation} from 'react-i18next';
import '../../assets/i18n/i18n';
const Stack = createNativeStackNavigator();

import axios from 'axios';

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};
const Purchase = ({navigation}) => {
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

  const PurchaseView = () => {
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

    const CreatePurchase = data => {
      setCreate(true);
      axios
        .post('/api/purchases/', data, {
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
          setCreate(false);
        });
    };

    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <Loading show={isCreate} infotext={'Creating Purchase Receipt'} />
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
                CreatePurchase(expensedata);
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

  const [focusView, setFocusView] = useState('p');

  return (
    <KeyboardAvoidingView style={{...s.Container}}>
      {/* appbar */}
      <View
        style={{
          ...s.flexrow_aligncenter_j_between,
          padding: 8,
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons name={'arrow-back'} size={30} color={'#000'} />
          </TouchableOpacity>
          <Text style={{...s.bold_label, fontSize: 23}}>{t('Purchase')}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{...s.bold_label, marginRight: 10}}></Text>
          <TouchableOpacity onPress={() => navigation.navigate('report')}>
            <MIcons name={'file-chart'} size={25} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>
      {/* view */}

      <View style={{flex: 1}}>{PurchaseView()}</View>
    </KeyboardAvoidingView>
  );
};

export default Purchase;

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
