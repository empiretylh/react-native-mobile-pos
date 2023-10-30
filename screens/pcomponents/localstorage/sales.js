/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {getAllSales} from '../../../localDatabase/sales';
import Icons from 'react-native-vector-icons/Ionicons';
import {
  STYLE as s,
  COLOR as C,
  IMAGE as I,
  numberWithCommas,
} from '../../../Database';
import LocalVoucher from './LocalVoucher';

import {ReloadContext} from '../context/ReloadContext';

const Sales = () => {
  //Input sales from local storage

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucherData, setVoucherData] = useState([]);

  const {reload, setReload} = useContext(ReloadContext);

  //const [error, setError] = useState(null);
  const getSales = async () => {
    const s = await getAllSales();

    setSales(s);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    getSales();
  }, [reload]);

  const RPItem = useCallback(({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setShowVoucher(true);
          setVoucherData(item);
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
              {item.customerName == '' ? 'Unknown' : item.customerName}
            </Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              Total : {numberWithCommas(item.grandtotal)} Ks
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
      <LocalVoucher
        open={showVoucher}
        onClose={() => setShowVoucher(false)}
        data={voucherData}
        reload={() => getSales()}
      />
      <View
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => getSales()}>
          <Icons name="reload-outline" size={28} color={'#000'} />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={sales}
          renderItem={RPItem}
          keyExtractor={item => item.id}
          style={{marginBottom: 100}}
        />
      </View>
    </View>
  );
};

export default Sales;
