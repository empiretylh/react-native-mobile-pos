import React, {useState} from 'react';
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
const debt_data = [
  {
    companyid: 1,
    companypic: IMAGE.np,
    companyname: 'NP Computer',
    debt: '5000 MMK',
    date: '6-7-2022',
    rate: '50',
    principal: '1000 MMK',
  },
  {
    companyid: 2,
    companypic: IMAGE.thura,
    companyname: 'Empire',
    debt: '5000 MMK',
    date: '6-7-2022',
    rate: '50',
    principal: '1000 MMK',
  },
  {
    companyid: 3,
    companypic: IMAGE.fb,
    companyname: 'Area',
    debt: '5000 MMK',
    date: '6-7-2022',
    rate: '50',
    principal: '1000 MMK',
  },
  {
    companyid: 4,
    companypic: IMAGE.viber,
    companyname: 'Viber',
    debt: '5000 MMK',
    date: '6-7-2022',
    rate: '50',
    principal: '1000 MMK',
  },
];
const HomeScreen = ({navigation, route}) => {
  const CompanyItem = ({item}) => {
    return (
      <TouchableOpacity>
        <View style={styles.citem}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={item.companypic}
              style={{width: 50, height: 50, borderRadius: 15}}
            />
            <View>
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 5,
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                {item.companyname}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 5,
                  color: 'black',
                }}>
                {item.debt}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text>Principal:{item.principal}</Text>
                <Text>Rate:{item.rate}%</Text>
                <Text>Time:{item.date}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const RemoveToken = ()=>{
    EncryptedStorage.removeItem('secure_token')
  }

  const [visible, Setvisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
          Credit
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icons name={'scan'} size={25} color={'#000'} />
          {/* <Image
            source={IMAGE.thura}
            style={{width: 40, height: 40, borderRadius: 50,marginLeft:5}}
          /> */}
        </View>
      </View>

      <View style={styles.userdebtinfo}>
        <Text style={{color: 'white'}}>Debt Info</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icons name="cash" size={50} color={'#fff'} />
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: 'white',
              marginLeft: 8,
            }}>
            {visible ? '5000 MMK' : '****'}
          </Text>
          <TouchableOpacity onPress={() => {
            RemoveToken()
            Setvisible(!visible)
            }}>
            <Icons
              name={visible ? 'eye-off' : 'eye'}
              size={30}
              color={'#000'}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Icons name={'swap-vertical-outline'} size={20} color={'#000'} />
    </View> */}
      <View style={styles.usertotaldebt}>
        <Icons name="cash" size={30} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
        }}>
        <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
          Shops & Company
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Icons name={'swap-vertical-outline'} size={20} color={'#000'} />
          <Icons name={'eye-outline'} size={20} color={'#000'} />
        </View>
      </View>
      <View>
        <FlatList
          renderItem={CompanyItem}
          data={debt_data}
          keyExtractor={item => item.companyid}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 5,
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

export default HomeScreen;
