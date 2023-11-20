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
import {
  STYLE as s,
  COLOR as C,
  ALERT as a,
  numberWithCommas,
} from '../../Database';
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
import ProductView from './sales/ProductView';

// eslint-disable-next-line prettier/prettier

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};

const Sales = ({navigation}) => {
  const {t} = useTranslation();

  const OtherIncome = () => {
    useEffect(() => {}, []);

    const [dopen, setDopen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [incomedata, setIncomeData] = useState({
      date:
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      description: '',
    });

    const handleOtherIncome = (e, name) => {
      const temp = {...incomedata, [name]: e};
      setIncomeData(temp);
    };

    const [isCreate, setCreate] = useState(false);
    const [isSucces, setSuccess] = useState(false);

    const CreateOtherIncome = data => {
      setCreate(true);
      axios
        .post('/api/otherincome/', data, {
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
      setIncomeData({
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
        <Loading show={isCreate} infotext={'Creating Other Income Receipt'} />
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
            value={incomedata?.title}
            style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
            placeholder={t('Title')}
            onChangeText={e => handleOtherIncome(e, 'title')}
          />
          <Text style={{...s.bold_label, marginTop: 8}}>{t('Price')}</Text>
          <TextInput
            style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
            placeholder={t('Price')}
            value={numberWithCommas(incomedata.price ? incomedata.price : '')}
            onChangeText={e =>
              handleOtherIncome(e.replaceAllTxt(',', ''), 'price')
            }
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
                handleOtherIncome(s, 'date');
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
            value={incomedata?.description}
            style={{
              ...inputS,
              ...s.bold_label,
              color: '#0f0f0f',
              height: 100,
            }}
            placeholder={t('Description')}
            onChangeText={e => handleOtherIncome(e, 'description')}
            multiline
          />
          <TouchableOpacity
            onPress={() => {
              if (incomedata.title && incomedata.price) {
                CreateOtherIncome(incomedata);
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
        <Text style={{...s.bold_label, fontSize: 23}}>{t('Sales')}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('s');
              setFocusView('p');
            }}>
            <Text
              style={{
                ...s.normal_label,
                ...s.black_button,
                color: focusView === 'p' ? 'white' : 'black',
                backgroundColor: focusView === 'p' ? C.blackbutton : '#f0f0f0',
                padding: 10,
                borderRadius: 15,
                fontSize: 15,
              }}>
              {t('Sales')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('o');
              setFocusView('c');
            }}>
            <Text
              style={{
                ...s.normal_label,
                ...s.black_button,
                color: focusView === 'c' ? 'white' : 'black',
                backgroundColor: focusView === 'c' ? C.blackbutton : '#f0f0f0',
                padding: 10,
                borderRadius: 15,
                fontSize: 15,
              }}>
              {t('Other_Income')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('customer')}>
            <Icons name="people-circle" size={30} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                focusView === 'p' ? 'salesvoucher' : 'otherincomereceipt',
              )
            }>
            <MIcons name={'file-chart'} size={30} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>
      {/* view */}

      <View style={{flex: 1}}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={'s'} component={ProductView} />
          <Stack.Screen name={'o'} component={OtherIncome} />
        </Stack.Navigator>
      </View>
    </KeyboardAvoidingView>
  );
};
export default Sales;

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
