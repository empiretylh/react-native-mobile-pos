/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {IMAGE, COLOR} from '../Database';
import {RSA} from 'react-native-rsa-native';
const Facebook = () => {
  const PayMoney = token => {
    console.log('Paying Moneyyy');

    var payload =
      'AGF8vhSI+8uWz7/O0CXdeneJIGmZKcvAbZO/kfIci+BF278jjsCEAF2gmwMN9pHiq28BHQBNxJrErbqxFPrGN9lCCtqPZCYSabVvPnGU3fOQ0ftBCENg1as+r9X4GgmWn678yTxrYQOdO4EMvL+M/ydw+T137Gj/pUNynHyiHs06Pz0UeN/hy8T0dIUOMBv2IWsc1qR3pIoB7yqPDIu4AS5CQwxbSlPQ1RER+O0DoV93M6MmcXm8h/Vvk+ItR5hAWNDMbjCVpQQnD0zlj/VGdqJ+QD4FAGEM0AykCUAikCi77fCUYok80AaofvjDtVRqWPY5DDOue32pJ2vY9sqjsg==';
    let formdata = new FormData();
    formdata.append('payload', payload);

    axios.defaults.headers.common = {Authorization: `bearer ${token}`};
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios
      .post(
        'https://staging.dinger.asia/payment-gateway-uat/api/pay',
        formdata,
        config,
      )
      .then(res => console.log(res.data, 'Successfully '))
      .catch(err => console.log(err));
  };

  const getToken = () => {
    //generatePayload();
    console.log('What');
    axios
      .post(
        'https://staging.dinger.asia/payment-gateway-uat/api/token?projectName=sannkyi staging&apiKey=m7v9vlk.eaOE1x3k9FnSH-Wm6QtdM1xxcEs&merchantName=mtktest',
      )
      .then(res => {
        console.log(res.data.response.paymentToken);
        PayMoney(res.data.response.paymentToken);
      });
  };

  // TtAJd/u2ZGevBVcSftg6z1KP7MTz3B2D3sujZfg4C46FRRS/WLrbKI4kQEdyQk+GNEp6Xk9uVOSgSnZ5oebwh4FUvfZsm1P9A85HXB4MZKldaddxkenCht9mQWHlJA4S/PCRtjFt9EJQiw06lHcwFRFj7EVtslc6LGnhkkYbt6lpU+Kt50SDz+ChDTN/tlrBq78xOWlnECR0ytnuvpS0KFZw03F/1KklIamM0E2Y9cklnbh9ypbuBhaMzA030h7WyRw/fazPsRjIlsk9KFdz9OlraYwGeTXRmEyqTFpt1ZICyJqDjuEOgTlmwp2L6l8a88zQEuPCCAHZ8/6xIjt4WAWdg8AIGThaTsRkHUvxzYgmLXWGdLJA9A/X5JScDXvNZWhhxjRKXkkPQ5wxGyHQZMqST75MVoeDItSQ7STD1lKYqxkQHrQSSoORKCBGnOzvSqe0o+lnacFhyfRh4rcPpcWFKowU8GO0GIal1MzSj/NS4Lr4cpSkQaUFQ6bLCEJe

  const generatePayload = () => {
    console.log('Generating Payload...');
    const pubKey =
      '-----BEGIN PUBLIC KEY-----\n' +
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCy7O9ULgdfc1SUXrU0W2qWg3l8VbvNpvq+ilwPDdq4EYzKwOe97Zd2wtW8HJQF7GNn2SaeHLCilsAJTYPLb+uRzXz3Aozxx8u6Bk5mGMVqi9rXXCNQCpRZYgM/7JDvtO5UhLCiMFHFO2f2c0QCmdR+yzdP6anJk9vLikuBwWxY6wIDAQAB' +
      '\n-----END PUBLIC KEY-----';

    // const data =
    //   "{providerName: 'Onepay',methodName: PIN,orderId: 'hnt-11092021001',customerPhone: '959796564600',customerName: 'Hsu Nyeint Thu', description:'Dinger Campaign Test',customerAddress:'Yangon, Myanmar' ,totalAmount: 100,items:'[{\"name\":\"Dinger\",\"amount\":\"100\",\"quantity\":\"1\"}]'}";

    const data =
      "{providerName:'Aya Pay',methodName:PIN,orderId:'thuratest5507',customerPhone: '959796564600',customerName:'Thura Lin Htut',}";

    RSA.generateKeys(6144) // set key size
      .then(keys => {
        RSA.encrypt(data, pubKey).then(encodedMessage => {
          console.log(`the encoded message is ${encodedMessage}`);
        });
      });
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,

          borderBottomColor: '#f0f0f0',
          borderBottomWidth: 3,
          flexDirection: 'row',
        }}>
        <Icon name={'person-circle'} size={30} color={'#0384fc'} />
        <TouchableOpacity
          onPress={() => getToken()}
          style={{padding: 10, backgroundColor: '#0384fc', borderRadius: 15}}>
          <Text style={{fontWeight: 'bold', color: 'white'}}> Pay Money</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{alignItems: 'center'}}>
          <View style={{alignItems: 'center'}}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={IMAGE.rose}
                style={{
                  marginTop: 5,
                  width: COLOR.windowWidth * 95,
                  height: 200,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                }}
              />
              <Icon
                name={'camera'}
                style={{
                  padding: 10,
                  borderRadius: 25,
                  backgroundColor: 'white',
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                }}
                size={20}
                color={'#000'}
              />
            </View>
            <View style={{position: 'absolute', bottom: -50}}>
              <Image
                source={IMAGE.thura}
                style={{
                  borderColor: 'white',
                  borderWidth: 3,
                  marginTop: 5,
                  width: 150,
                  height: 150,
                  borderRadius: 100,
                }}
              />
              <Icon
                name={'camera'}
                style={{
                  padding: 5,

                  borderRadius: 25,
                  backgroundColor: '#f0f0f0',
                  position: 'absolute',
                  bottom: 3,
                  right: 3,
                }}
                size={16}
                color={'#000'}
              />
            </View>
          </View>
          <View style={{marginTop: 55, alignItems: 'center'}}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
              Thura Lin Htut
            </Text>
            <Text style={{fontSize: 15}}>Create your own Empire 🔨🏰</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#0384fc',
                padding: 5,
                paddingLeft: 13,
                paddingRight: 13,
                flexDirection: 'row',
                borderRadius: 10,
                alignItems: 'center',
                margin: 5,
              }}>
              <Icon name={'add-circle'} size={20} color={'#fff'} />
              <Text style={{color: 'white', fontWeight: 'bold', marginLeft: 5}}>
                Add to story
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#f0f0f0',
                padding: 5,
                paddingLeft: 13,
                paddingRight: 13,
                flexDirection: 'row',
                borderRadius: 10,
                alignItems: 'center',
                margin: 5,
              }}>
              <Icon name={'pencil'} size={20} color={'#000'} />
              <Text style={{color: 'black', fontWeight: 'bold', marginLeft: 5}}>
                Edit profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#f0f0f0',
                padding: 5,
                paddingLeft: 13,
                paddingRight: 13,
                flexDirection: 'row',
                borderRadius: 10,
                alignItems: 'center',
                margin: 5,
              }}>
              <Icon
                name={'ellipsis-horizontal-outline'}
                size={20}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: '#f0f0f0',
              borderBottomWidth: 2,
              width: COLOR.windowWidth * 90,
              height: 5,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            padding: 10,
            justifyContent: 'space-around',
          }}>
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 8}}>
            <Icon name={'briefcase'} color={'#'} size={20} />
            <Text style={{color: 'black', marginLeft: 8}}> Works at </Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}> Student </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 8}}>
            <Icon name={'school'} color={'#'} size={20} />
            <Text style={{color: 'black', marginLeft: 8}}> Went to </Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {' '}
              No.(6) BEHS Myaungmya
            </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 8}}>
            <Icon name={'home'} size={20} />
            <Text style={{color: 'black', marginLeft: 8}}> Lives in</Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {' '}
              Myaungmya{' '}
            </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 8}}>
            <Icon name={'location'} size={20} />
            <Text style={{color: 'black', marginLeft: 8}}> From </Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {' '}
              Myaungmya{' '}
            </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 8}}>
            <Icon name={'heart'} size={20} />
            <Text style={{color: 'black', marginLeft: 8}}> Single </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 8}}>
            <Icon name={'star'} size={20} />
            <Text style={{color: 'black', marginLeft: 8}}>
              {' '}
              Followed by 32 people{' '}
            </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 8}}>
            <Icon name={'logo-instagram'} size={20} />
            <Text style={{color: 'black', marginLeft: 8}}>
              {' '}
              thuralinhtut__{' '}
            </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 8}}>
            <Icon name={'logo-pinterest'} size={20} />
            <Text style={{color: 'black', marginLeft: 8}}> thuralinhtut3 </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 8}}>
            <Icon name={'logo-github'} size={20} />
            <Text style={{color: 'black', marginLeft: 8}}>
              {' '}
              thuralinhtutxero{' '}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Facebook;
