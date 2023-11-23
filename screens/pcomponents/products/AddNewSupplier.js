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

const AddNewSuplier = ({show, onClose, onAdd}) => {
  const {t} = useTranslation();
  const [supplierName, setSupplierName] = useState('');
  const [qty, setQty] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (supplierName == '') return Alert.alert('', 'Please fill all fields');
    // Call the onAdd function with the new product data
    onAdd({supplierName: supplierName, description: description});

    // Clear the input fields
    setSupplierName('');
    setDescription();

    // Close the modal
    onClose();
  };

  return (
    <MessageModalNormal show={show} width={'80%'} onClose={onClose}>
      <Text style={{...style.bold_label, marginBottom: 5}}>
        Add New Supplier
      </Text>

      <Text style={{...style.normal_label, marginTop: 2}}>{t('Name')}</Text>
      <TextInput
        style={textinputstyle}
        placeholder="Supplier Name"
        value={supplierName}
        onChangeText={setSupplierName}
        placeholderTextColor="black"
      />
      <Text style={{...style.normal_label, marginTop: 2}}>
        {t('Description')}
      </Text>
      <TextInput
        style={textinputstyle}
        multiline
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
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

export default AddNewSuplier;
