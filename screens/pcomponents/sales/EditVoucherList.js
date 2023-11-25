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
} from 'react-native';
import {SaleContext} from '../context/SaleContext';
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
import axios from 'axios';

const headerLabel = {
  flex: 1,
  ...s.normal_label,
  backgroundColor: '#70c9cc',
  justifyContent: 'center',
  color: 'black',
  flex: 1,
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
      <Text style={{...labelstyle, textAlign: 'right'}}>{item.name}</Text>
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
        }}
        value={price}
        onChangeText={handlePriceChange}
        keyboardType="numeric"
        selectTextOnFocus={true}
      />
      <Text style={{...labelstyle, textAlign: 'right'}}>
        {numberWithCommas(item.qty * item.price)}
      </Text>
      {/*Remove Item from cartdata using filter and with remove icon */}
      <TouchableOpacity
        onPress={() => {
          onRemove(item.name);
        }}>
        <Icon name="trash-outline" size={30} color="red" />
      </TouchableOpacity>
    </View>
  );
};
/* Implemet Product Data from Context and useFlat list and use CartList */

const EditVoucherList = ({show, onClose, data}) => {
  const [CartData, setCartData] = useState(data.sproduct);
  const [addProductShow, setAddProductShow] = useState(false);

  const SumTotal = useMemo(() => {
    console.log('here', CartData);
    if (CartData.length === 0) return 0;

    let amount = 0;
    CartData.forEach(e => {
      amount += parseInt(e.price, 10) * parseInt(e.qty, 10);
    });

    return amount;
  }, [CartData]);

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

  const addNewItem = ({pdname, qty, price}) => {
    const d = {
      name: new Date().getTime().toString(),
      qty: qty,
      price: price,
      total: price * qty,
      pdname: pdname,
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
      item => item.name === '' || item.qty === 0 || item.price === 0,
    );

    console.log(newCartData.length);

    if (newCartData.length > 0) {
      a.rqf();
      return;
    }

    axios
      .put('/api/sales/', {
        id: data.receiptNumber,
        customerName: data.customerName,
        products: CartData,
      })
      .then(() => {
        onClose();
      })
      .catch(err => {
        a.alert('Error');
      });
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
              name="receipt-outline"
              size={30}
              color="black"
              style={{marginRight: 10}}
            />
            <Text style={{...s.normal_label, ...s.bold_label, fontSize: 30}}>
              Edit Voucher
            </Text>
          </View>

          <View style={{flexDirection: 'row', position: 'absolute', right: 0}}>
            <Icon
              name="close"
              size={30}
              color="black"
              onPress={onClose}
              style={{top: 0, right: 0}}
            />
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            marginBottom: 5,
            flexDirection: 'column',
          }}>
          <TextInput
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: 'black',
              ...s.bold_label,
              paddingLeft: 10,
            }}
            defaultValue={data.customerName}
            placeholder={'Customer Name'}
          />
        </View>
        <FlatList
          ListHeaderComponent={() => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <Text style={{...headerLabel}}>Product Name</Text>
              <Text style={headerLabel}>Qty</Text>
              <Text style={headerLabel}>Price</Text>
              <Text style={headerLabel}>Total Price</Text>
              <Text style={headerLabel}>Action</Text>
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

export default EditVoucherList;
