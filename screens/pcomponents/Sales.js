/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Modal,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {
  IMAGE,
  STYLE as s,
  COLOR as C,
  ALERT as a,
  numberWithCommas,
  UnitId,
} from '../../Database';
import EncryptedStorage from 'react-native-encrypted-storage';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MessageModalNormal} from '../MessageModal';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import Loading from '../Loading';

import {useTranslation} from 'react-i18next';
import '../../assets/i18n/i18n';
const Stack = createNativeStackNavigator();

import axios from 'axios';
import {nullLiteralTypeAnnotation} from '@babel/types';
import ProductField from './extra/productfield';

import {
  InterstitialAd,
  AdEventType,
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const interstitial = InterstitialAd.createForAdRequest(UnitId.interstitial, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};

const Sales = ({navigation}) => {
  const [ProductData, setProductData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

  const ProductView = () => {
    useEffect(() => {}, []);

    const [isCreate, setCreate] = useState(false);
    const [isSucces, setSuccess] = useState(false);
    const CreateReceipt = (c = '', p, s, t, d, g, de = '') => {
      let fdata = new FormData();
      let re = new Date();
      fdata.append('receiptNumber', re.getTime().toString());
      fdata.append('customerName', c);
      fdata.append('products', JSON.stringify(p));
      fdata.append('totalAmount', s);
      fdata.append('tax', t);
      fdata.append('discount', d);
      fdata.append('grandtotal', g);
      fdata.append('description', de);
      setCreate(true);

      axios
        .post('/api/sales/', fdata, {
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

    const [totalAmount, setTotalAmount] = useState(0);
    const [CartData, setCartData] = useState([]);

    const DiscountCalculator = (price, discount) => {
      let dis_price = price - (price / 100) * discount;
      return dis_price;
    };

    const [customername, setcustomername] = useState();

    const [tax, setTax] = useState(0);
    const [discount, setDiscount] = useState(0);

    const sumGrandTotal = (subtotal, tax, discount) => {
      let s = parseInt(subtotal, 10);
      let t = parseInt(tax, 10);
      let d = parseInt(discount, 10);

      let price = s + t;
      let totalprice = DiscountCalculator(price, d);

      return totalprice;
    };

    return (
      <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 8}}>
        <Loading show={isCreate} infotext={'Creating Receipt'} />
        <MessageModalNormal
          show={isSucces}
          onClose={() => {
            setSuccess(false);
            navigation.navigate('s');
          }}>
          <Text style={{...s.bold_label}}>{t('RSC')}</Text>
          <TouchableOpacity
            onPress={() => {
              setSuccess(false);
              navigation.navigate('s');
            }}
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
        <View style={{padding: 5}}>

        <BannerAd
            unitId={UnitId.banner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
          <Text style={{...s.bold_label}}>{t('Customer_Name')}</Text>
          <TextInput
            style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
            placeholder={t('Customer_Name')}
            value={customername}
            onChangeText={e => setcustomername(e)}
          />

          <Text style={{...s.bold_label, marginTop: 8}}>{t('Products')}</Text>
          <ProductField
            ContainerProps={{style: {...inputS, padding: 5}}}
            setTotalAmount={setTotalAmount}
            setData={setCartData}
            data={CartData}
          />
          <Text style={{...s.bold_label, marginTop: 8}}>{t('Sub_Total')}</Text>
          <TextInput
            style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
            value={numberWithCommas(totalAmount) + ' MMK'}
            placeholder={t('Sub_Total')}
          />
          <Text style={{...s.bold_label, marginTop: 8}}>{t('Tax_(MMK)')}</Text>
          <TextInput
            style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
            placeholder={t('Tax_(MMK)')}
            keyboardType={'number-pad'}
            value={tax + ''}
            defaultValue={tax + ''}
            onChangeText={e => (e === '' ? setTax(0) : setTax(e))}
          />
          <Text style={{...s.bold_label, marginTop: 8}}>{t('Discount')}</Text>
          <TextInput
            style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
            placeholder={t('Discount')}
            keyboardType={'number-pad'}
            value={discount}
            defaultValue={discount}
            onChangeText={e =>
              e === ''
                ? setDiscount(0)
                : setDiscount(e) || parseInt(e) > 100
                ? setDiscount(100)
                : setDiscount(e)
            }
          />
          <View
            style={{
              ...s.flexrow_aligncenter_j_between,
              padding: 5,
              backgroundColor: 'yellow',
              marginTop: 8,
            }}>
            <Text style={{...s.bold_label}}>{t('Total_Amount')}</Text>
            <Text style={{...s.bold_label}}>
              {numberWithCommas(sumGrandTotal(totalAmount, tax, discount))} MMK
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (CartData && totalAmount) {
                CreateReceipt(
                  customername,
                  CartData,
                  totalAmount,
                  tax,
                  discount,
                  sumGrandTotal(totalAmount, tax, discount),
                );
              } else {
                a.rqf();
              }
            }}
            style={{...s.blue_button, padding: 10}}>
            <Text style={{...s.bold_label, color: 'white'}}>
              {t('Create_Receipt')}
            </Text>
          </TouchableOpacity>
        </View>

        <BannerAd
            unitId={UnitId.banner}
            size={BannerAdSize.MEDIUM_RECTANGLE}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
      </ScrollView>
    );
  };

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
      console.log(temp, 'what are we');
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

          <BannerAd
            unitId={UnitId.banner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
            <BannerAd
            unitId={UnitId.banner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
            <BannerAd
            unitId={UnitId.banner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </ScrollView>
    );
  };

  const [focusView, setFocusView] = useState('p');

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);

  if (loaded) {
    try {
      interstitial.show();
    } catch (e) {
      console.log('Ad could not loaded');
    }
  }

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView style={{...s.Container}}>
      {/* appbar */}
      <View
        style={{
          ...s.flexrow_aligncenter_j_between,
          padding: 8,
        }}>
        <Text style={{...s.bold_label, fontSize: 23}}>{t('Sales')}</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate('report')}>
            <MIcons name={'file-chart'} size={25} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>
      {/* view */}

      <View style={{...s.flexrow_aligncenter_j_center}}>
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
      </View>
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
