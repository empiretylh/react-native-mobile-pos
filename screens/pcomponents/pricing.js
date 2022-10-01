/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {IMAGE} from '../Database';
import EncryptedStorage from 'react-native-encrypted-storage';
import {STYLE as s, COLOR as C} from '../../Database';
import axios from 'axios';

const Pricing = ({navigation, route}) => {
  const [visible, Setvisible] = useState(false);

  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    GetPrice();
  }, []);

  const GetPrice = () => {
    axios
      .get('/api/pricing/')
      .then(res => {
        console.log(res.data);
        setPricing(res.data.pricing);
      })
      .catch(err => console.log(err));
  };

  const RequestPrice = id => {
    console.log('Requesting Price')
    axios
      .post('/api/pricing/', {type: id})
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };

  const Plan = item => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              padding: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                width: (C.windowWidth * 90) / 3.5,
              }}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
                {item.title}
              </Text>
              <Text style={{color: 'black', fontSize: 15}}>
                {item.days} Days
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'black',
                height: 60,
                padding: 0.5,
                margin: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                width: (C.windowWidth * 90) / 5,
              }}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {item.discount}
              </Text>
              <Text style={{color: 'red'}}>Discount</Text>
            </View>
            <View
              style={{
                backgroundColor: 'black',
                height: 60,
                padding: 0.5,
                margin: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                width: (C.windowWidth * 90) / 2.5,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {item.price} MMK
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            ...s.blue_button,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }} 
          onPress={()=>RequestPrice(item.id)}
          >
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            Buy
          </Text>
          <Text style={{fontSize: 19, color: 'yellow', fontWeight: 'bold'}}>
            {' '}
            {item.title}{' '}
          </Text>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            Package
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (pricing) {
    return (
      <View style={styles.container}>
        <Text style={{...s.bold_label, color: 'white', fontSize: 20}}>
          Pricing
        </Text>
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'white',
            padding: 8,
            marginTop: 15,
            borderRadius: 15,
            alignItems: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <Text style={{...s.bold_label, color: 'black', fontSize: 18}}>
              PLANS
            </Text>
          </View>
          <View style={{margin: 2}}>
            {pricing.map((item, index) => (
              <View>{Plan(item)}</View>
            ))}
          </View>
        </View>
      </View>
    );
  }
  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#357cf0',
    padding: 10,
  },
  appbar: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userdebtinfo: {
    backgroundColor: 'orange',
    height: 150,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginBottom: 5,
  },
  usertotaldebt: {
    backgroundColor: '#346beb',
    height: 80,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginTop: 0,
  },
  citem: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    borderRadius: 15,
  },
});

export default Pricing;
