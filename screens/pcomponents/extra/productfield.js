/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
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

const ProductField = ({ContainerProps, setTotalAmount, data, setData}) => {
  const [open, setOpen] = useState(false);

  const [load, setLoad] = useState(false);

  const [ProductData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState();
  const [sp, setSp] = useState();

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
        setSp(res.data);
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

  const CategoryToText = id => {
    if (ProductData && categoryData) {
      const c = categoryData.filter(item => item.value == id);

      return c ? c[0].label : '...';
    }
    return '...';
  };

  const SearchProducts = text => {
    const data = ProductData.filter(e => {
      console.log(e.name);
      console.log(text);
      console.log(e.name === text);
      var b = e.name.replaceAllTxt(' ', '').toLowerCase();

      var f = e.description.replaceAllTxt(' ', '').toLowerCase();
      var d = CategoryToText(e.category).replaceAllTxt(' ', '').toLowerCase();
      var c = text.replaceAllTxt(' ', '').toLowerCase();

      return b.includes(c) || d.includes(c) || f.includes(c);
    });
    console.log(data, 'what');
    setSp(data);
  };

  const SwitchToCart = ({setValue, onAdd, item, selectedItem}) => {
    let sitem = selectedItem[0];
    if (selectedItem[0] ? selectedItem[0].check : false) {
      return (
        <View style={{...s.flexrow_aligncenter_j_center}}>
          <TouchableOpacity
            onPress={() => setValue(0, sitem.name)}
            style={{
              padding: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'red',
              borderRadius: 50,
              margin: 5,
            }}>
            <Icon name={'close'} size={25} color={'#fff'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setValue(parseInt(sitem.qty - 1), sitem.name)}
            style={{
              padding: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'red',
              borderRadius: 10,
              margin: 5,
            }}>
            <Icon name={'remove'} size={25} color={'#fff'} />
          </TouchableOpacity>
          <TextInput
            style={{
              width: 35,
              height: 35,
              backgroundColor: 'white',
              fontSize: 20,
              padding: 0,
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            defaultValue={'1'}
            value={sitem.qty.toString()}
            onChangeText={e => {
              if (parseInt(e) > item.qty) {
                a.lqy();
              } else {
                setValue(parseInt(e), sitem.name);
              }
            }}
            maxLength={4}
            keyboardType={'numeric'}
            selectTextOnFocus
          />

          <TouchableOpacity
            onPress={() => {
              if (sitem.qty >= item.qty) {
                a.lqy();
              } else {
                setValue(parseInt(sitem.qty + 1), sitem.name);
              }
            }}
            style={{
              padding: 5,

              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'blue',
              borderRadius: 10,
              margin: 5,
            }}>
            <Icon name={'add'} size={25} color={'#fff'} />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={{backgroundColor: 'green', padding: 10, borderRadius: 15}}
        onPress={() => {
          onAdd(item);
        }}>
        <MIcon name="cart-plus" size={25} color={'#fff'} />
      </TouchableOpacity>
    );
  };

  const ProductView = () => {
    const [CartData, setCartData] = useState([]);

    const onAdd = item => {
      let v = item.id;
      let d = {
        name: item.id,
        qty: 1,
        price: item.price,
        check: true,
        total: item.price,
        pdname: item.name,
      };
      const joined = CartData.concat(d);
      setCartData(joined);

      console.log(joined);
    };

    const SetValue = (value, name) => {
      let cartdata = [...CartData];
      let index = cartdata.findIndex(it => it.name === name);
      if (value === 0) {
        cartdata = cartdata.filter(a => a.name !== name);
        console.log(index);
      } else {
        cartdata[index] = {
          ...cartdata[index],
          ['qty']: parseInt(value) || 1,
        };
        cartdata[index] = {
          ...cartdata[index],
          ['total']: cartdata[index].price * cartdata[index].qty,
        };
      }

      setCartData(cartdata);
    };
    const PDITEM = ({item}) => {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#f0f0f0',
            padding: 10,
            margin: 5,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 15,
          }}>
          <Image
            source={{
              uri:
                item.pic === '/media/null'
                  ? 'https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png'
                  : axios.defaults.baseURL + item.pic,
            }}
            style={{width: 50, height: 50}}
            resizeMode={'cover'}
            resizeMethod={'resize'}
          />
          <View style={{flexDirection: 'column'}}>
            <View style={{...s.flexrow_aligncenter_j_center}}>
              <Text style={{...s.bold_label, margin: 5}}>{item.name}</Text>
              <Text
                style={{
                  ...s.normal_label,

                  padding: 5,
                  backgroundColor: C.blackbutton,

                  color: 'white',
                }}>
                {item.qty}{' '}
              </Text>
            </View>
            <Text style={{...s.normal_label, margin: 5}}>
              {numberWithCommas(item.price)} MMK
            </Text>
          </View>
          <View style={{position: 'absolute', right: 5, bottom: 0}}>
            <SwitchToCart
              onAdd={onAdd}
              item={item}
              setValue={SetValue}
              selectedItem={CartData.filter(e => e.name === item.id)}
            />
          </View>
        </View>
      );
    };

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
      <>
        <KeyboardAvoidingView style={{flex: 1, padding: 0}}>
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
              onChangeText={e => SearchProducts(e)}
            />
            <Icon name={'search'} size={20} color={'#000'} />
          </View>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={load}
                onRefresh={GetProdcutsFromServer}
              />
            }
            keyboardShouldPersistTaps={'always'}
            removeClippedSubviews={false}
            style={{backgroundColor: C.white}}
            data={sp}
            renderItem={PDITEM}
            keyExtractor={i => i.id}
          />
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
      </>
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
              <Text>Add Products</Text>
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
