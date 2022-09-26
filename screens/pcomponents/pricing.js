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
import {STYLE as s} from '../../Database';
import axios from 'axios';

const Pricing = ({navigation, route}) => {
  const [visible, Setvisible] = useState(false);

  useEffect(() => {
    requestPrice();
  }, []);

  const requestPrice = () => {
    axios
      .get('/api/pricing/')
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Text style={{...s.bold_label, color: 'black', fontSize: 18}}>
        Pricing
      </Text>
      <View style={{flexDirection: 'row'}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
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
