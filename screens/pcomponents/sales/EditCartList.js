/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext, useMemo, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import {CartContext} from '../context/CartContext';
import {numberWithCommas} from '../../../Database';
import {
  STYLE as s,
  COLOR as C,
  IMAGE as i,
  ALERT as a,
} from '../../../Database';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddNewProduct from './AddNewProduct';
let screenwidth = Dimensions.get('window').width;
let totalWidth = 365; // Sum of all widths
const width = [97, 40, 80, 85, 50].map(w => (w / totalWidth) * screenwidth);

const headerLabel = {
  flex: 1,
  ...s.normal_label,
  backgroundColor: '#70c9cc',
  justifyContent: 'center',
  color: 'black',
  padding: 2,
  textAlign: 'center',
  borderColor: 'black',
  borderWidth: 1,
};
const CTITEM = ({item, onUpdate, onRemove}) => {
  const [qty, setQty] = useState(item.qty.toString());
  const [price, setPrice] = useState(item.price.toString());

  const qtyInputRef = useRef(null);
  const priceInputRef = useRef(null);

  const handleQtyChange = value => {
    setQty(value);
    const newQty = parseInt(value, 10);
    const newTotal = newQty * item.price;
    onUpdate({...item, qty: newQty, total: newTotal});
  };

  const handlePriceChange = value => {
    setPrice(value);
    const newPrice = parseFloat(value);
    const newTotal = item.qty * newPrice;
    onUpdate({...item, price: newPrice, total: newTotal});
  };

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
        flexDirection: 'row',
      }}>
      <Text
        style={{
          ...labelstyle,
          textAlign: 'left',
          width: width[0],
          minWidth: width[0],
        }}>
        {numberWithCommas(item.pdname)}
      </Text>
      <TextInput
        ref={qtyInputRef}
        style={{
          backgroundColor: '#42a1f5',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: 'black',

          ...s.bold_label,
          color: 'white',
          flex: 1,
          padding: 2,
          textAlign: 'center',
          minWidth: width[1],
          width: width[1],
        }}
        value={qty}
        onChangeText={handleQtyChange}
        keyboardType="numeric"
        selectTextOnFocus={true}
      />
      <TextInput
        ref={priceInputRef}
        style={{
          backgroundColor: '#42a1f5',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: 'black',

          ...s.bold_label,
          color: 'white',
          flex: 1,
          padding: 2,
          textAlign: 'center',
          minWidth: width[2],
          width: width[2],
        }}
        value={price}
        onChangeText={handlePriceChange}
        keyboardType="numeric"
        selectTextOnFocus={true}
      />
      <Text
        style={{
          ...labelstyle,
          textAlign: 'right',
          minWidth: width[3],
          width: width[3],
        }}>
        {numberWithCommas(item.total)}
      </Text>
      {/*Remove Item from cartdata using filter and with remove icon */}
      <View style={{width: width[4]}}>
        <TouchableOpacity
          onPress={() => {
            onRemove(item.name);
          }}>
          <Icon name="trash-outline" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
/* Implemet Product Data from Context and useFlat list and use CartList */

const CartView = ({setTotalAmount, show, onClose}) => {
  const {CartData, setCartData} = useContext(CartContext);
  const [addProductShow, setAddProductShow] = useState(false);

  const SumTotal = useMemo(() => {
    console.log('here');
    if (CartData.length === 0) return 0;

    let amount = 0;
    CartData.forEach(e => {
      amount += parseInt(e.total, 10);
    });
    setTotalAmount(amount);
    return amount;
  }, [CartData, setTotalAmount]);

  const handleItemUpdate = newItem => {
    const newCartData = CartData.map(item => {
      if (item.name === newItem.name) {
        return newItem;
      } else {
        return item;
      }
    });
    setCartData(newCartData);
  };

  const addNewItem = ({pdname, qty, price, cost}) => {
    const d = {
      name: new Date().getTime().toString(),
      qty: qty,
      price: price,
      total: price * qty,
      pdname: pdname,
      cost: cost,
    };
    setCartData([...CartData, d]);
  };

  const handleItemRemove = itemId => {
    const newCartData = CartData.filter(item => item.name !== itemId);
    setCartData(newCartData);
  };
  //if  pdname , qty , price are empty , show alert
  const handleSave = () => {
    const newCartData = CartData.filter(
      item => item.pdname === '' || item.qty === 0 || item.price === 0,
    );

    console.log(newCartData.length);

    if (newCartData.length > 0) {
      a.rqf();
      return;
    }
    onClose();
  };

  return (
    <Modal visible={show} onRequestClose={onClose}>
      <AddNewProduct
        show={addProductShow}
        onClose={() => setAddProductShow(false)}
        onAdd={addNewItem}
      />
      <View style={{flex: 1, padding: 10}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{...s.flexrow_aligncenter_j_between}}>
            <Icon
              name="cart-outline"
              size={30}
              color="black"
              style={{marginRight: 10}}
            />
            <Text style={{...s.normal_label, ...s.bold_label, fontSize: 30}}>
              Edit Cart
            </Text>
          </View>

          <View style={{flexDirection: 'row', position: 'absolute', right: 0}}>
            <MIcons
              name={'package-variant'}
              size={30}
              color={'#000'}
              onPress={() => setAddProductShow(true)}
              style={{marginRight: 8}}
            />
            <Icon
              name="close"
              size={30}
              color="black"
              onPress={handleSave}
              style={{top: 0, right: 0}}
            />
          </View>
        </View>

        <FlatList
          ListHeaderComponent={() => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={{...headerLabel, minWidth: width[0]}}>
                Product Name
              </Text>
              <Text style={{...headerLabel, minWidth: width[1]}}>Qty</Text>
              <Text style={{...headerLabel, minWidth: width[2]}}>Price</Text>
              <Text style={{...headerLabel, minWidth: width[3]}}>
                Total Price
              </Text>
              <Text style={{...headerLabel, minWidth: width[4]}}></Text>
            </View>
          )}
          contentContainerStyle={{
            flexDirection: 'column',
            marginTop: 10,
          }}
          style={{backgroundColor: C.white}}
          data={CartData}
          renderItem={({item}) => (
            <CTITEM
              item={item}
              onUpdate={handleItemUpdate}
              onRemove={handleItemRemove}
            />
          )}
          keyExtractor={item => item.name}
        />

        <View style={{bottom: 0, alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 5,
            }}>
            <Text style={{...s.bold_label}}>Total Amount :</Text>
            <Text style={{...s.bold_label}}>
              {numberWithCommas(SumTotal)} MMK
            </Text>
          </View>
          {/*Touchable Opacity */}

          <TouchableOpacity
            style={{
              ...s.blue_button,
              flexDirection: 'row',
              justifyContent: 'center',
              width: C.windowWidth * 90,
            }}
            onPress={() => {
              handleSave();
            }}>
            <Text style={{...s.bold_label, color: C.white}}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CartView;
