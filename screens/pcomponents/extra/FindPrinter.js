import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';

import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
const PrinterScreen = () => {
  const [printer, setPrinter] = useState(null);

  const connectPrinter = async () => {};

  const printReceipt = async () => {
    // // inside async function
    // try {
    //   await ThermalPrinterModule.printTcp({payload: 'hello world'});
    // } catch (err) {
    //   //error handling
    //   console.log(err.message);
    // }
  };

  return (
    <View>
      <Button title="Connect Printer" onPress={connectPrinter} />
      <Button title="Print Receipt" onPress={printReceipt} />
    </View>
  );
};

export default PrinterScreen;
