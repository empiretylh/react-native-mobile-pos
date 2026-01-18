/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
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
import {CartContext} from '../context/CartContext';
const SwitchToCart = React.memo(({item}) => {
  const {CartData, setCartData} = useContext(CartContext);
  const [selectedItem, setSelectItem] = useState(false);
  const [citem, setCitem] = useState();
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const onFirstSetItem = useCallback(fitem => {
    if (fitem) {
      let d = {
        name: fitem.id,
        qty: 1,
        price: fitem.price,
        check: true,
        total: fitem.price,
        pdname: fitem.name,
        extraprice : fitem.extraprice,
      };

      setCitem(d);
      setSelectItem(true);
    }
  }, []);

  const IncreaseValue = useCallback(() => {
    if (isMountedRef.current) {
      setCitem(prevCitem => ({
        ...prevCitem,
        qty: parseInt(prevCitem.qty + 1),
        total: prevCitem.price * parseInt(prevCitem.qty + 1)
      }));
    }
  }, []);

  const DecreaseValue = useCallback(() => {
    if (isMountedRef.current) {
      setCitem(prevCitem => ({
        ...prevCitem,
        qty: parseInt(prevCitem.qty - 1),
        total: prevCitem.price * parseInt(prevCitem.qty - 1)
      }));
    }
  }, []);

  const typeNumber = useCallback(text => {
    if (isMountedRef.current) {
      const qty = parseInt(text) || 0;
      setCitem(prevCitem => ({
        ...prevCitem,
        qty: qty,
        total: prevCitem.price * qty
      }));
    }
  }, []);

  useEffect(() => {
    if (citem && citem.qty === 0) {
      setSelectItem(false);
    }
  }, [citem]);

  useEffect(() => {
    if (!citem) return;

    setCartData(prevCartData => {
      let index = prevCartData.findIndex(it => it.name === citem.name);
      
      // Check if update is actually needed
      if (index !== -1) {
        const existingItem = prevCartData[index];
        if (existingItem.qty === citem.qty && existingItem.total === citem.total) {
          return prevCartData; // No change needed, prevent re-render
        }
      }
      
      let cartdata = [...prevCartData];
      
      if (index === -1 && citem.qty > 0) {
        // Add new item
        return [...cartdata, citem];
      } else if (citem.qty === 0) {
        // Remove item
        return cartdata.filter(a => a.name !== citem.name);
      } else if (index !== -1) {
        // Update existing item
        cartdata[index] = {
          ...cartdata[index],
          qty: parseInt(citem.qty),
          total: cartdata[index].price * parseInt(citem.qty),
        };
        return cartdata;
      }
      
      return cartdata;
    });
  }, [citem, setCartData]);

  // Only check on mount and when item changes, not on every CartData update
  useEffect(() => {
    let data = CartData.find(d => d.name === item.id);
    if (data) {
      setSelectItem(true);
      setCitem(data);
    }
  }, [item.id]); // Remove CartData dependency to prevent circular updates

 

  if (selectedItem && citem) {
    return (
      <View style={{...s.flexrow_aligncenter_j_center}}>
        <TouchableOpacity
          onPress={() => typeNumber('0')}
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
          onPress={() => DecreaseValue()}
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
          value={citem.qty.toString()}
          onChangeText={e => {
            if (parseInt(e) > item.qty) {
              a.lqy();
            } else {
              typeNumber(e);
            }
          }}
          maxLength={4}
          keyboardType={'numeric'}
          selectTextOnFocus
        />
        <TouchableOpacity
          onPress={() => {
            if (citem.qty >= item.qty) {
              a.lqy();
            } else {
              IncreaseValue();
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
        onFirstSetItem(item);
      }}>
      <MIcon name="cart-plus" size={25} color={'#fff'} />
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Only re-render if item id or qty changes
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.qty === nextProps.item.qty &&
    prevProps.item.price === nextProps.item.price
  );
});

export default SwitchToCart;
