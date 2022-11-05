/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  RefreshControl,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  KeyboardAvoidingViewBase,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MessageModalNormal} from '../../MessageModal';
import {
  STYLE as s,
  COLOR as C,
  IMAGE as i,
  ALERT as a,
} from '../../../Database';
import axios from 'axios';
import {numberWithCommas} from '../../../Database';
import SwitchToCart from './SwitchToCart';
import PDITEM from './pditem';
import {CartContext} from '../context/CartContext';

const ProductField = ({ContainerProps, setTotalAmount, data, setData}) => {
  const [open, setOpen] = useState(false);

  const [load, setLoad] = useState(false);

  const [ProductData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState();

  const [searchtext, setSearchText] = useState('');
  const [categoryId, setCategoryId] = useState('All');

  const SetOpenModal = () => {
    setOpen(true);
    GetProdcutsFromServer();
    GetCategoryFromServer();
  };

  const GetProdcutsFromServer = () => {
    setLoad(true);
    axios
      .get('/api/products/')
      .then(res => {
        res.data = res.data.filter(e => e.qty > 0);
        setProductData(res.data);

        setLoad(false);
      })
      .catch(err => a.spe());
  };

  const GetCategoryFromServer = () => {
    axios.get('/api/categorys/').then(res => {
      let a = [];
      res.data.forEach(item => {
        a.push({label: item.title, value: item.id, id: item.id});
      });
      console.log(a);
      setCategoryData(a);
    });
  };

  const ProductFilter = useMemo(() => {
    if (ProductData && categoryId) {
      const data = ProductData.filter(e => {
        var b = e.name.replaceAllTxt(' ', '').toLowerCase();

        var c = searchtext.replaceAllTxt(' ', '').toLowerCase();

        return (
          (categoryId === 'All' ? true : e.category === categoryId) &&
          b.includes(c)
        );
      });
      return data;
    }
    return ProductData;
  }, [searchtext, ProductData, categoryId]);

  console.log('re render Products Field');

  const ProductView = () => {
    const [CartData, setCartData] = useState([]);

    const data_bridge = useMemo(
      () => ({CartData, setCartData}),
      [CartData, setCartData],
    );

    const SumTotal = cd => {
      let amount = 0;
      cd.forEach(e => {
        amount += parseInt(e.total);
      });
      setTotalAmount(amount);
      return amount;
    };

    const CTITEM = ({item}) => {
      const labelstyle = {
        ...s.normal_label,
        color: 'black',
        flex: 1,
        padding: 2,
        textAlign: 'center',
        borderColor: 'black',
        borderWidth: 1,
      };
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text style={labelstyle}>{item.pdname}</Text>
          <Text style={labelstyle}>{item.qty}</Text>
          <Text style={labelstyle}>{numberWithCommas(item.price)}</Text>
          <Text style={{...labelstyle, textAlign: 'right'}}>
            {numberWithCommas(item.total)}
          </Text>
        </View>
      );
    };

    console.log('re render Products View');

    if (load) {
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={i.spinnerloadgif}
          style={{width: 50, height: 50}}
          resizeMode={'contain'}
        />
      </View>;
    }

    return (
      <CartContext.Provider value={data_bridge}>
        <KeyboardAvoidingView style={{flex: 1, padding: 0}}>
          <View style={{flexDirection: 'column', padding: 5}}>
            <View
              style={{
                ...s.flexrow_aligncenter_j_between,
                borderRadius: 15,
                height: 45,
                borderColor: 'black',
                borderWidth: 1.5,
                paddingRight: 10,
                margin: 5,
              }}>
              <TextInput
                style={{
                  padding: 10,
                  flex: 1,
                  fontWeight: '900',
                }}
                placeholder={'Search Products'}
                onChangeText={e => setSearchText(e)}
              />
              <Icon name={'search'} size={20} color={'#000'} />
            </View>
            {categoryData ? (
              <ScrollView
                style={{
                  flexDirection: 'row',
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <TouchableOpacity onPress={e => setCategoryId('All')}>
                  <Text
                    style={{
                      backgroundColor:
                        categoryId === 'All' ? C.blackbutton : '#f0f0f0',
                      color: categoryId === 'All' ? 'white' : 'black',
                      padding: 10,
                      marginLeft: 5,
                      marginRight: 5,
                      borderRadius: 15,
                    }}>
                    All
                  </Text>
                </TouchableOpacity>
                {categoryData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={e => setCategoryId(item.value)}>
                    <Text
                      style={{
                        backgroundColor:
                          categoryId === item.value ? C.blackbutton : '#f0f0f0',
                        color: categoryId === item.value ? 'white' : 'black',
                        padding: 10,
                        marginLeft: 5,
                        marginRight: 5,
                        borderRadius: 15,
                      }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null}
          </View>
          <View style={{flex: 1}}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={load}
                  onRefresh={GetProdcutsFromServer}
                />
              }
              initialNumToRender={10} //
              keyboardShouldPersistTaps={'always'}
              removeClippedSubviews={false}
              style={{backgroundColor: C.white}}
              data={ProductFilter}
              renderItem={PDITEM}
              keyExtractor={i => i.id}
            />
          </View>
          <View
            style={{
              borderColor: 'black',
              borderRadius: 15,

              backgroundColor: 'yellow',
              borderWidth: 1,
              maxHeight: C.windowHeight * 30,
              padding: 5,
            }}>
            <View style={{...s.flexrow_aligncenter_j_between}}>
              <Text style={{...s.bold_label}}>Cart List</Text>
              <Text style={{...s.bold_label, fontSize: 15}}>
                {CartData.length} Items
              </Text>
            </View>
            <FlatList
              contentContainerStyle={{flexDirection: 'column-reverse'}}
              style={{backgroundColor: C.white}}
              data={CartData}
              renderItem={CTITEM}
              keyExtractor={i => i.name}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
              }}>
              <Text style={{...s.bold_label}}>Total Amount :</Text>
              <Text style={{...s.bold_label}}>
                {numberWithCommas(SumTotal(CartData))} MMK
              </Text>
            </View>
            <Button
              title={'Done'}
              onPress={() => {
                setOpen(false);
                setSelectItem(CartData);
                setData(CartData);
              }}
            />
            <TextInput
              style={{...s.textInputnormal}}
              keyboardType={'number-pad'}
            />
          </View>
        </KeyboardAvoidingView>
      </CartContext.Provider>
    );
  };

  const ListItem = ({item}) => {
    return (
      <View
        style={{
          padding: 5,
          backgroundColor: C.blackbutton,
          marginLeft: 5,
          borderRadius: 15,
        }}>
        <Text style={{fontWeight: 'bold', color: 'white'}}>{item.pdname}</Text>
      </View>
    );
  };

  const [selectitem, setSelectItem] = useState();
  return (
    <>
      <View {...ContainerProps}>
        <Modal visible={open}>{ProductView()}</Modal>
        <View style={{flex: 1}}>
          {selectitem ? (
            <FlatList
              horizontal
              contentContainerStyle={{flexDirection: 'row'}}
              style={{backgroundColor: C.white}}
              data={selectitem}
              renderItem={ListItem}
              keyExtractor={i => i.name}
            />
          ) : (
            <TouchableOpacity
              style={{padding: 5}}
              onPress={() => SetOpenModal()}>
              <Text>Choose Prodcuts</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={{padding: 5}} onPress={() => SetOpenModal()}>
          <Icon name={'add'} size={20} color={'#000'} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProductField;
