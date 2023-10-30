/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {COLOR as C, numberWithCommas, STYLE as s} from '../../../Database';
import {getAllExpenses} from '../../../localDatabase/expense';
import {getAllProducts} from '../../../localDatabase/products';

const ProductLocal = () => {
  //Input sales from local storage
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState([]);
  //const [error, setError] = useState(null);
  const getProducts = async () => {
    const s = await getAllProducts();
    console.log(s);
    setProduct(s);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    
    getProducts();
  }, []);

  const RPItem = useCallback(({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // setShowVoucher(true);
          // setVoucherData(item);
        }}>
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            backgroundColor: C.white,
            margin: 5,
            borderRadius: 15,
            padding: 10,
            elevation: 1,
          }}>
          <View>
            <Text style={{...s.bold_label}}>
              {item.title == '' ? 'Unknown' : item.name}
            </Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              Sale : {numberWithCommas(item.price)} Ks
            </Text>
            <Text style={{...s.normal_label}}>
              Buy : {numberWithCommas(item.cost)} Ks
            </Text>
            <Text style={{...s.normal_label}}>
              Qty : {numberWithCommas(item.qty)} Ks
            </Text>
          </View>
          <View>
            <Text style={{...s.normal_label}}>
              {new Date(item.date)
                .toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
                .toString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => getProducts()}>
          <Icons name="reload-outline" size={28} color={'#000'} />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={product}
          renderItem={RPItem}
          keyExtractor={item => item.id}
          style={{marginBottom: 100}}
        />
      </View>
    </View>
  );
};

export default ProductLocal;
