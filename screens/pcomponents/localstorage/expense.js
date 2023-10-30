/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {COLOR as C, numberWithCommas, STYLE as s} from '../../../Database';
import {getAllExpenses} from '../../../localDatabase/expense';
import {ReloadContext} from '../context/ReloadContext';

const ExpenseLocal = () => {
  //Input sales from local storage
  const [loading, setLoading] = useState(false);

  const [expense, setExpense] = useState([]);
  //const [error, setError] = useState(null);
  const {reload, setReload} = useContext(ReloadContext);

  const getExpense = async () => {
    const s = await getAllExpenses();

    setExpense(s);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    getExpense();
  }, [reload]);

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
              {item.title == '' ? 'Unknown' : item.title}
            </Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              Total : {numberWithCommas(item.price)} Ks
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
        <TouchableOpacity onPress={() => getExpense()}>
          <Icons name="reload-outline" size={28} color={'#000'} />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={expense}
          renderItem={RPItem}
          keyExtractor={item => item.id}
          style={{marginBottom: 100}}
        />
      </View>
    </View>
  );
};

export default ExpenseLocal;
