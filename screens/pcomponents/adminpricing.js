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
import {IMAGE} from '../../Database';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  STYLE as s,
  COLOR as C,
  IMAGE as I,
  ALERT as A,
  isArrayhasData,
} from '../../Database';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import Loading from './extra/Loading';

const AdminPricing = ({navigation, route}) => {
  const [modalVisible, SetmodalVisible] = useState(false);

  const [pricing, setPricing] = useState(null);
  const [requestPrice, setRequestPrice] = useState(null);

  useEffect(() => {
    GetPrice();
  }, []);

  const GetPrice = () => {
    SetmodalVisible(true);
    axios
      .get('/api/pricingrequest/')
      .then(res => {
        console.log(res.data);
        setPricing(res.data);

        SetmodalVisible(false);
      })
      .catch(err => {
        console.log(err);
        SetmodalVisible(false);
      });
  };

  const AcceptRequest = (id, username) => {
    console.log(id, username);
    axios
      .post('/api/pricingrequest/', {rq_id: id, username: username})
      .then(res => {
        console.log(res.data);
        // setPricing(res.data);
        GetPrice();
        SetmodalVisible(false);
      })
      .catch(err => {
        console.log(err);
        SetmodalVisible(false);
      });
  };

  const RequestPrice = id => {
    console.log('Requesting Price');
    if (isArrayhasData(requestPrice)) {
      A.c_b();
    } else {
      SetmodalVisible(true);
      axios
        .post('/api/pricing/', {type: id})
        .then(res => {
          console.log(res.data);
          SetmodalVisible(false);
          GetPrice();
        })
        .catch(err => {
          console.log(err);
          SetmodalVisible(false);
        });
    }
  };

  const DeleteRequest = id => {
    console.log('Deleteing Request Price');
    SetmodalVisible(true);
    axios
      .delete('/api/pricing/', {
        params: {
          type: id,
        },
      })
      .then(res => {
        console.log(res.data);
        SetmodalVisible(false);
        GetPrice();
      })
      .catch(err => {
        console.log(err);
        SetmodalVisible(false);
      });
  };

  const RequestUser = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          borderRadius: 15,
          backgroundColor: 'white',
          padding: 10,
          marginTop: 5,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: axios.defaults.baseURL + item.user.profileimage}}
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{flexDirection: 'column', marginLeft: 8}}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
              {item.user.name}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.username}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.phoneno}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.email}
            </Text>
          </View>
        </View>
        <View style={{marginTop: 8}}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Requested Date
          </Text>
          <Text style={styles.text}>{new Date(item.date).toUTCString()}</Text>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Plan
          </Text>
          <Text style={styles.text}>{item.rq_price.title}</Text>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Price
          </Text>
          <Text style={styles.text}>{item.rq_price.price} MMK</Text>

          <TouchableOpacity
            style={{...s.blue_button, padding: 8}}
            onPress={() => AcceptRequest(item.id, item.user.username)}>
            <Text style={{color: 'white'}}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const AcceptedUser = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          borderRadius: 15,
          backgroundColor: 'white',
          padding: 10,
          marginTop: 5,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: axios.defaults.baseURL + item.user.profileimage}}
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{flexDirection: 'column', marginLeft: 8}}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
              {item.user.name}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.username}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.phoneno}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.email}
            </Text>
          </View>
        </View>
        <View style={{marginTop: 8}}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Requested Date
          </Text>
          <Text style={styles.text}>{new Date(item.date).toUTCString()}</Text>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Plan
          </Text>
          <Text style={styles.text}>{item.rq_price.title}</Text>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Price
          </Text>
          <Text style={styles.text}>{item.rq_price.price} MMK</Text>
        </View>
      </View>
    );
  };

  if (pricing) {
    return (
      <ScrollView style={styles.container}>
        <Loading
          modal={true}
          show={modalVisible}
          onClose={() => SetmodalVisible(false)}
          infotext={'Loading'}
        />
        <Text
          style={{
            ...s.bold_label,
            color: 'white',
            fontSize: 20,
            textAlign: 'center',
          }}>
          Admin Pricing
        </Text>
        <TouchableOpacity onPress={() => console.log('Log out')}>
          <Text style={{color: 'white'}}>Log Out</Text>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
            Requested User
          </Text>
          {pricing
            .filter(e => e.done === false)
            .map((item, index) => (
              <RequestUser key={index} item={item} />
            ))}

          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
            Accepted User
          </Text>
          {pricing
            .filter(e => e.done === true)
            .reverse()
            .map((item, index) => (
              <AcceptedUser key={index} item={item} />
            ))}
        </View>
      </ScrollView>
    );
  }
  return <Loading />;
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
  text: {
    color: 'white',
    fontSize: 15,
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 15,
    textAlign: 'center',
  },
});

export default AdminPricing;
