/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Modal, TextInput, TouchableOpacity, Text, View} from 'react-native';
import {
  STYLE as style,
  COLOR as C,
  IMAGE as i,
  ALERT as a,
} from '../../../Database';

import {MessageModalNormal} from '../../MessageModal';

const textinputstyle = {
  margin: 5,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: 'black',
};

const AddNewProductModal = ({show, onClose, onAdd}) => {
  const [pdname, setPdname] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    // Call the onAdd function with the new product data
    onAdd({pdname, qty, price});

    // Clear the input fields
    setPdname('');
    setQty('');
    setPrice('');

    // Close the modal
    onClose();
  };

  return (
    <MessageModalNormal show={show} width={'80%'}>
      <Text style={{...style.bold_label, marginBottom: 5}}>
        Add New Product
      </Text>

      <Text style={{...style.normal_label, marginTop: 2}}> Product Name </Text>
      <TextInput
        style={textinputstyle}
        placeholder="Product Name"
        value={pdname}
        onChangeText={setPdname}
        placeholderTextColor="black"
      />
      <Text style={{...style.normal_label, marginTop: 2}}> Quantity </Text>
      <TextInput
        style={textinputstyle}
        placeholder="Quantity"
        value={qty}
        onChangeText={setQty}
        keyboardType="numeric"
        placeholderTextColor="black"
      />
      <Text style={{...style.normal_label, marginTop: 2}}>
        Price (1 x qty){' '}
      </Text>
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
