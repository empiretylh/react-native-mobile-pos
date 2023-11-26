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
  KeyboardAvoidingView,
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
import ProductField from '../extra/productfield';
import {CartContext} from '../context/CartContext';
let screenwidth = Dimensions.get('window').width;
let totalWidth = 365; // Sum of all widths
const width = [97, 40, 80, 85, 50].map(w => (w / totalWidth) * screenwidth);

const headerLabel = {
  flex: 1,
  ...s.normal_label,
  backgroundColor: '#70c9cc',
  justifyContent: 'center',
  color: 'black',
  padding: 3,
  textAlign: 'center',
  borderColor: 'black',
  borderWidth: 1,
};
const CTITEM = ({item, onUpdate, onRemove, isnew = false}) => {
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
        {isnew ? item.pdname : item.name}
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
        {numberWithCommas(item.qty * item.price)}
      </Text>
      {/*Remove Item from cartdata using fuilter and with remove icon */}
      <View style={{width: width[4]}}>
        <TouchableOpacity
          onPress={() => {
            if (isnew) {
              return onRemove(item.name);
            }
            onRemove(item.id);
          }}>
          <Icon name="trash-outline" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
/* Implemet Product Data from Context and useFlat list and use CartList */

const EditVoucherList = ({show, onClose, data, reload}) => {
  const [oldCartData, setOldCartData] = useState(data.sproduct);
  const [CartData, setCartData] = useState([]);
  const [addProductShow, setAddProductShow] = useState(false);

  const data_bridge = useMemo(
    () => ({CartData, setCartData}),
    [CartData, setCartData],
  );

  const SumTotal = useMemo(() => {
    console.log('here', oldCartData);
    if (oldCartData.length === 0) return 0;

    let amount = 0;
    oldCartData.forEach(e => {
      amount += parseInt(e.price, 10) * parseInt(e.qty, 10);
    });

    CartData.forEach(e => {
      amount += parseInt(e.price, 10) * parseInt(e.qty, 10);
    });

    return amount;
  }, [oldCartData, CartData]);

  const handleItemUpdate = newItem => {
    const newCartData = oldCartData.map(item => {
      if (item.id === newItem.id) {
        return newItem;
      } else {
        return item;
      }
    });
    setOldCartData(newCartData);
  };

  const handleNewItemUpdate = newItem => {
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
    setOldCartData([...oldCartData, d]);
  };

  const handleItemRemove = itemId => {
    const newCartData = oldCartData.filter(item => item.id !== itemId);
    setOldCartData(newCartData);
  };

  const handleNewItemRemove = itemId => {
    console.log(itemId);
    const newCartData = CartData.filter(item => item.name !== itemId);
    setCartData(newCartData);
  };
  //if  pdname , qty , price are empty , show alert
  const handleSave = () => {
    const newCartData = oldCartData.filter(
      item => item.name === '' || item.qty === 0 || item.price === 0,
    );

    console.log(newCartData.length);

    if (newCartData.length > 0) {
      a.rqf();
      return;
    }

    let d = {
      id: data.receiptNumber,
      customerName: data.customerName,
      products: oldCartData,
    };

    if (CartData.length > 0) {
      d = {
        id: data.receiptNumber,
        customerName: data.customerName,
        products: oldCartData,
        newproducts: CartData,
      };
    }

    axios
      .put('/api/sales/', d)
      .then(() => {
        onClose();
      })
      .catch(err => {
        a.alert('Error', err);
      });
  };

  return (
    <CartContext.Provider value={data_bridge}>
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

            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                right: 0,
                alignItems: 'center',
              }}>
              <ProductField
                ContainerProps={{
                  backgroundColor: '#ddd',
                  padding: 5,
                  borderRadius: 15,
                  marginRight: 5,
                }}
                custom={true}
                data={CartData}
                setData={setCartData}
                setTotalAmount={e => console.log(e)}
              />

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
            data={oldCartData}
            renderItem={({item}) => (
              <CTITEM
                item={item}
                onUpdate={handleItemUpdate}
                onRemove={handleItemRemove}
              />
            )}
            keyExtractor={item => item.id.toString()}
            ListFooterComponent={
              <FlatList
                contentContainerStyle={{
                  flexDirection: 'column',
                }}
                style={{backgroundColor: C.white}}
                data={CartData}
                renderItem={({item}) => (
                  <CTITEM
                    item={item}
                    onUpdate={handleNewItemUpdate}
                    onRemove={handleNewItemRemove}
                    isnew={true}
                  />
                )}
                keyExtractor={item => item.name}
              />
            }
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
    </CartContext.Provider>
  );
};

export default EditVoucherList;
