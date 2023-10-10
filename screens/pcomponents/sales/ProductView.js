/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Vibration,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {
  STYLE as s,
  COLOR as C,
  ALERT as a,
  numberWithCommas,
} from '../../../Database';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MessageModalNormal} from '../../MessageModal';
import Collapsible from 'react-native-collapsible';
import DatePicker from 'react-native-date-picker';
import Loading from '../../Loading';
import axios from 'axios';
import ProductField from '../extra/productfield';

import {useTranslation} from 'react-i18next';
import '../../../assets/i18n/i18n';
import VoucherDetails from './VocherView';
import {CartContext} from '../context/CartContext';

const ProductView = React.memo(({navigation}) => {
  const {t} = useTranslation();
  const [isCreate, setCreate] = useState(false);
  const [isSucces, setSuccess] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0);
  const [CartData, setCartData] = useState([]);

  const data_bridge = useMemo(
    () => ({CartData, setCartData}),
    [CartData, setCartData],
  );

  const DiscountCalculator = (price, discount) => {
    let dis_price = price - (price / 100) * discount;
    return dis_price;
  };

  const [customername, setcustomername] = useState();

  const [tax, setTax] = useState('');
  const [taxcoll, setTaxcoll] = useState(true);

  const [discount, setDiscount] = useState('');
  const [discountcoll, setDiscountcoll] = useState(true);

  const [deli, setDeli] = useState('');
  const [delicoll, setDelicoll] = useState(true);

  const [desc, setDesc] = useState('');
  const [desccoll, setDesccoll] = useState(true);

  const [showVoucher, setShowVoucher] = useState(false);
  const [vocherData, setVoucherData] = useState([]);

  const CreateReceipt = (
    c = '',
    p,
    totalAmount,
    tax,
    discount,
    grandtotal,
    delivery,
    description = '',
  ) => {
    let fdata = new FormData();
    let re = new Date();
    fdata.append('receiptNumber', re.getTime().toString());
    fdata.append('customerName', c);
    fdata.append('products', JSON.stringify(p));
    fdata.append('totalAmount', totalAmount);
    fdata.append('grandtotal', grandtotal);

    fdata.append('tax', taxcoll ? 0 : tax);
    fdata.append('discount', discountcoll ? 0 : discount);
    fdata.append('deliveryCharges', delicoll ? 0 : delivery);
    fdata.append('description', desccoll ? '' : description);

    setCreate(true);

    axios
      .post('/api/sales/', fdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        setVoucherData(res.data);
        setCreate(false);
        setSuccess(true);
        setCartData([]);
        setcustomername('');
        setDeli(0);
        setDesc('');
        setDiscount(0);
        setTotalAmount(0);
        setTax(0);

        setTaxcoll(true);
        setDiscountcoll(true);
        setDelicoll(true);
        setDesccoll(true);

        Vibration.vibrate(100);
      })
      .catch(err => {
        console.log(err);
        a.spe();
        setCreate(false);
      });
  };

  const sumGrandTotal = useMemo(() => {
    let s = parseInt(totalAmount, 10);
    let t = parseInt(tax, 10);
    let d = parseInt(discount, 10);
    let delivery = parseInt(deli, 10);

    if (isNaN(s)) {
      s = 0;
    }
    if (isNaN(t)) {
      t = 0;
    }
    if (isNaN(d)) {
      d = 0;
    }
    if (isNaN(delivery)) {
      delivery = 0;
    }

    if (taxcoll) t = 0;
    if (discountcoll) d = 0;
    if (delicoll) delivery = 0;

    const price = s + t ;
    const totalprice = DiscountCalculator(price, d)+ delivery;

    return totalprice.toFixed(2);
  }, [totalAmount, tax, discount, deli, discountcoll, delicoll, taxcoll]);

  return (
    <CartContext.Provider value={data_bridge}>
      <VoucherDetails
        open={showVoucher}
        onClose={() => setShowVoucher(false)}
        data={vocherData}
        setData={setVoucherData}
      />
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
              setShowVoucher(true);
            }}
            style={{
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              backgroundColor: 'green',
            }}>
            <Text style={{...s.bold_label, color: 'white'}}>Show Voucher</Text>
          </TouchableOpacity>
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
              ...s.blue_button,
            }}>
            <Text style={{...s.bold_label, color: 'white'}}>{t('OK')}</Text>
          </TouchableOpacity>
        </MessageModalNormal>
        <View style={{padding: 5}}>
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

          <View>
            <TouchableOpacity
              onPress={() => setTaxcoll(!taxcoll)}
              style={{...s.flexrow_aligncenter, marginTop: 8}}>
              <Text style={{...s.bold_label, marginTop: 8}}>
                {t('Tax_(MMK)')}
              </Text>
              <Icons
                name={taxcoll ? 'checkmark-circle-outline' : 'checkmark-circle'}
                size={20}
                color="#000"
                style={{marginLeft: 8}}
              />
            </TouchableOpacity>

            <Collapsible collapsed={taxcoll}>
              <View>
                <TextInput
                  style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
                  placeholder={t('Tax')}
                  keyboardType={'number-pad'}
                  value={tax + ''}
                  defaultValue={tax + ''}
                  onChangeText={e => setTax(e)}
                  selectTextOnFocus={true}
                />
              </View>
            </Collapsible>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => setDiscountcoll(!discountcoll)}
              style={{
                ...s.flexrow_aligncenter,
                marginTop: 8,
              }}>
              <Text style={{...s.bold_label, marginTop: 8}}>
                {t('Discount')}
              </Text>
              <Icons
                name={
                  discountcoll ? 'checkmark-circle-outline' : 'checkmark-circle'
                }
                size={20}
                color="#000"
                style={{marginLeft: 8}}
              />
            </TouchableOpacity>

            <Collapsible collapsed={discountcoll}>
              <View>
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
                  selectTextOnFocus={true}
                />
              </View>
            </Collapsible>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => setDelicoll(!delicoll)}
              style={{...s.flexrow_aligncenter, marginTop: 8}}>
              <Text style={{...s.bold_label, marginTop: 8}}>
                {t('Delivery_Charges')}
              </Text>
              <Icons
                name={
                  delicoll ? 'checkmark-circle-outline' : 'checkmark-circle'
                }
                size={20}
                color="#000"
                style={{marginLeft: 8}}
              />
            </TouchableOpacity>

            <Collapsible collapsed={delicoll}>
              <View>
                <TextInput
                  style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
                  placeholder={t('Delivery_Charges')}
                  keyboardType={'number-pad'}
                  value={deli + ''}
                  defaultValue={deli + ''}
                  onChangeText={e => setDeli(e)}
                  selectTextOnFocus={true}
                />
              </View>
            </Collapsible>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => setDesccoll(!desccoll)}
              style={{...s.flexrow_aligncenter, marginTop: 8}}>
              <Text style={{...s.bold_label, marginTop: 8}}>
                {t('Description')}
              </Text>
              <Icons
                name={
                  desccoll ? 'checkmark-circle-outline' : 'checkmark-circle'
                }
                size={20}
                color="#000"
                style={{marginLeft: 8}}
              />
            </TouchableOpacity>

            <Collapsible collapsed={desccoll}>
              <View>
                <TextInput
                  style={{...inputS, ...s.bold_label, color: '#0f0f0f'}}
                  placeholder={t('Description')}
                  keyboardType={'text'}
                  value={desc + ''}
                  defaultValue={desc + ''}
                  onChangeText={e => setDesc(e)}
                />
              </View>
            </Collapsible>
          </View>
          <View
            style={{
              ...s.flexrow_aligncenter_j_between,
              padding: 5,
              backgroundColor: 'yellow',
              marginTop: 8,
            }}>
            <Text style={{...s.bold_label}}>{t('Total_Amount')}</Text>
            <Text style={{...s.bold_label}}>
              {numberWithCommas(sumGrandTotal)} MMK
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
                  sumGrandTotal,
                  deli,
                  desc,
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
      </ScrollView>
    </CartContext.Provider>
  );
});

export default ProductView;

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
