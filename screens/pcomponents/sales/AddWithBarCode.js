/* eslint-disable react-native/no-inline-styles */
import React, {
  useCallback,
  useContext,
  useRef,
  useEffect,
  useMemo,
  useState,
} from 'react';

/*
Barcode scan and add products to add to cart the scanned product
*/
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
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CartContext} from '../context/CartContext';
import {ProductsContext} from '../context/ProductContext';
import {RNCamera} from 'react-native-camera';
import {numberWithCommas} from '../../../Database';
import {
  STYLE as s,
  COLOR as C,
  IMAGE as i,
  ALERT as a,
} from '../../../Database';

const BarCodeToCart = ({open, setOpen}) => {
  const {CartData, setCartData} = useContext(CartContext);
  const {ProductData, setProductData} = useContext(ProductsContext);

  const [scanneddata, setScanneddata] = useState(0);
  const [showScanned, setShowScanned] = useState(false);

  const cameraRef = useRef(null);
  const [isCameraStopped, setCameraStopped] = useState(false);

  const stopCamera = () => {
    if (cameraRef.current && !isCameraStopped) {
      cameraRef.current.stopRecording();
      setCameraStopped(true);
    }
  };

  const resumeCamera = () => {
    if (cameraRef.current && isCameraStopped) {
      cameraRef.current.resumePreview();
      setCameraStopped(false);
    }
  };

  const onBarCodeRead = barcodeData => {
    console.log('On Bar Code Read', barcodeData);
    // barcodeData = barcodeData.data;
    // const barcode = parseInt(barcodeData, 10);
    const product = ProductData.filter(item => item.barcode == barcodeData.data);

    if (product.length > 0) {
      console.log('Product found:', product);
      Vibration.vibrate(100);
      stopCamera();
      setScanneddata(product[0]);
      setShowScanned(true);
    } else {
      console.log('Product not found');
    }
  };

  const AddToCart = useCallback(
    item => {
      if (item) {
        console.log(item, 'We found that');
        const index = CartData.findIndex(e => e.name === item.id);
        if (index !== -1) {
          const updatedCartData = [...CartData];
          updatedCartData[index].qty += 1;
          updatedCartData[index].total =
            updatedCartData[index].qty * updatedCartData[index].price;
          setCartData(updatedCartData);
        } else {
          let d = {
            name: item.id,
            qty: 1,
            price: item.price,
            check: true,
            total: item.price,
            pdname: item.name,
          };
          setCartData([...CartData, d]);
        }
      }
    },
    [CartData, setCartData],
  );

  const SumTotal = useMemo(() => {
    if (CartData.length === 0) return 0;

    let amount = 0;
    CartData.forEach(e => {
      amount += parseInt(e.total, 10);
    });

    return amount;
  }, [CartData]);

  const ShowScannedItem = ({data}) => {
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: 'rgba(2,2,2,0.5) ',
          marginBottom: 30,
        }}>
        <Text style={{...s.bold_label, color: 'white', fontSize: 15}}>
          Product Name: {data.name}
        </Text>
        <Text style={{...s.bold_label, color: 'white', fontSize: 15}}>
          Price: {data.price}
        </Text>
        <Text style={{...s.bold_label, color: 'white', fontSize: 15}}>
          Quantity: {data.qty}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row-reverse',
            justifyContent: 'space-around',
            marginTop: 20,
          }}>
          <Button
            title={'Add to Cart'}
            onPress={() => {
              AddToCart(data);
              setShowScanned(false);
              resumeCamera();
            }}
          />

          <Button
            title={'Cancel'}
            color={'red'}
            onPress={() => {
              setShowScanned(false);
              resumeCamera();
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={open}
      onRequestClose={() => {
        setOpen(false);
      }}>
      <View style={{flex: 1}}>
        <RNCamera
          style={{flex: 1, width: '100%', height: '100%'}}
          ref={cameraRef}
          onBarCodeRead={onBarCodeRead}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
        }}>
        {showScanned && <ShowScannedItem data={scanneddata} />}
        <View
          style={{
            borderColor: 'black',
            borderRadius: 15,

            backgroundColor: 'yellow',
            borderWidth: 1,
            width: C.windowWidth * 100,
            maxHeight: C.windowHeight * 50,
            height: C.windowHeight * 50,
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
              {numberWithCommas(SumTotal)} MMK
            </Text>
          </View>
          <View style={{}}>
            <Button
              title={'Done'}
              onPress={() => {
                setOpen(false);
                // setSelectItem(CartData);
                // setData(CartData);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BarCodeToCart;

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
