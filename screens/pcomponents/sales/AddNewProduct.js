/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
} from 'react-native';
import {
  STYLE as style,
  COLOR as C,
  IMAGE as i,
  ALERT as a,
} from '../../../Database';

import {MessageModalNormal} from '../../MessageModal';
import {useTranslation} from 'react-i18next';

const textinputstyle = {
  margin: 5,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: 'black',
  padding: 10,
};

const AddNewProductModal = ({show, onClose, onAdd}) => {
  const {t} = useTranslation();
  const [pdname, setPdname] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('0');

  const handleAdd = () => {
    if (pdname == '' && qty == '' && price == '')
      return Alert.alert('', 'Please fill all fields');
    // Call the onAdd function with the new product data
    onAdd({pdname, qty, price, cost});

    // Clear the input fields
    setPdname('');
    setQty('');
    setPrice('');
    setCost(0);

    // Close the modal
    onClose();
  };

  return (
    <MessageModalNormal show={show} width={'80%'}>
      <Text style={{...style.bold_label, marginBottom: 5}}>
        Add New Product
      </Text>

      <Text style={{...style.normal_label, marginTop: 2}}>
        {t('ProductName')}
      </Text>
      <TextInput
        style={textinputstyle}
        placeholder="Product Name"
        value={pdname}
        onChangeText={setPdname}
        placeholderTextColor="black"
      />
      <Text style={{...style.normal_label, marginTop: 2}}>{t('Quantity')}</Text>
      <TextInput
        style={textinputstyle}
        placeholder="Quantity"
        value={qty}
        onChangeText={setQty}
        keyboardType="numeric"
        placeholderTextColor="black"
      />
      <Text style={{...style.normal_label, marginTop: 2}}>{t('Price4')}</Text>
      <TextInput
        style={textinputstyle}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholderTextColor="black"
      />

      <TouchableOpacity
        onPress={handleAdd}
        style={{...style.blue_button, padding: 15}}>
        <Text style={{color: 'white', fontWeigth: 'bold'}}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onClose}
        style={{...style.blue_button, backgroundColor: 'red', padding: 14}}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Cancel</Text>
      </TouchableOpacity>
    </MessageModalNormal>
  );
};

export default AddNewProductModal;
