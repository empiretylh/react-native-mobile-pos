/**
 * Created by januslo on 2018/12/26.
 */

import React, {Component} from 'react';
import {StyleSheet, View, Image, Button} from 'react-native';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
import axios from 'axios';

var dateFormat = (date, fmt) => {
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  var week = {
    0: '/u65e5',
    1: '/u4e00',
    2: '/u4e8c',
    3: '/u4e09',

    4: '/u56db',
    5: '/u4e94',
    6: '/u516d',
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace('E+', week[date.getDay() + '']);
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }
  return fmt;
};

const styles = StyleSheet.create({
  btn: {
    marginBottom: 8,
  },
});
/*


Shop Name, Show Address, Shop Email \n

| Receipt Number :      1696700089993 \n |
| Customer Name  :            Hla Hla \n |
| Date           : 2023-10-08 00:04:51 \n |
--------------
| Product Name | Qty | Price | Total | \n
| ရေဘူး         |  1  | 400   | 400   | \n
| ထမင်းချိုင့် |  1  | 600   | 600   | \n
--------------
| Total Amount  : 1000 \n |
| Tax           :    0 \n |
| Discount      :    0 \n |
| Grand Total   : 1000 \n |
| Delivery      :    0 \n |
| Description   :      \n |
| ---------------------- \n |
| Thanks for your shopping \n |

*/

export const printReceipt = async (data, shopdata) => {
  const {profileimage, name, address, email, phoneno} = shopdata;

  const {
    receiptNumber,
    voucherNumber,
    customerName,
    sproduct,
    totalAmount,
    tax,
    discount,
    grandtotal,
    deliveryCharges,
    date,
    description,
  } = data;

  const columnWidths = [12, 6, 6, 8];

  await BluetoothEscposPrinter.printerInit();
  await BluetoothEscposPrinter.printerLeftSpace(0); //set left margin

  await BluetoothEscposPrinter.printerAlign(
    // set align center
    BluetoothEscposPrinter.ALIGN.CENTER,
  );

  let image = axios.default.baseURL + profileimage;

  //Logo in the center
  await BluetoothEscposPrinter.printPic(image, {
    width: 200,
    left: 40,
  });

  await BluetoothEscposPrinter.printText(name + '\r\n', {
    // print shop name
    encoding: 'GBK',
    codepage: 0,
    widthtimes: 3,
    heigthtimes: 3,
    fonttype: 1,
  });

  await BluetoothEscposPrinter.printText(
    address + '\n' + phoneno + '\n' + email + '\r\n',
    {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
      fonttype: 1,
    },
  );

  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
  await BluetoothEscposPrinter.printText(
    'Receipt Number : ' + voucherNumber + '\r\n',
    {},
  );
  await BluetoothEscposPrinter.printText(
    'Customer Name  : ' + customerName + '\r\n',
    {},
  );
  await BluetoothEscposPrinter.printText(
    'Date           : ' + date + '\r\n',
    {},
  );
  await BluetoothEscposPrinter.printText(
    '--------------------------------\r\n',
    {},
  );
  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.RIGHT,
    ],
    ['Product Name', 'Qty', 'Price', 'Total'],
    {},
  );

  printColumns(sproduct);

  await BluetoothEscposPrinter.printText('\r\n', {});

  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.RIGHT,
    ],
    ['Total Amount', '', '', totalAmount],
    {},
  );
  await BluetoothEscposPrinter.printText('\r\n', {});
  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.RIGHT,
    ],
    ['Tax', '', '', tax],
    {},
  );
  await BluetoothEscposPrinter.printText('\r\n', {});
  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.RIGHT,
    ],
    ['Discount', '', '', discount],
    {},
  );
  await BluetoothEscposPrinter.printText('\r\n', {});
  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.RIGHT,
    ],
    ['Grand Total', '', '', grandtotal],
    {},
  );
  await BluetoothEscposPrinter.printText('\r\n', {});
  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.RIGHT,
    ],
    ['Delivery', '', '', deliveryCharges],
    {},
  );
  await BluetoothEscposPrinter.printText('\r\n', {});
  await BluetoothEscposPrinter.printColumn(
    columnWidths,
    [
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.LEFT,
      BluetoothEscposPrinter.ALIGN.CENTER,
      BluetoothEscposPrinter.ALIGN.RIGHT,
    ],
    ['Description', '', '', description],
    {},
  );
  await BluetoothEscposPrinter.printText('\r\n', {});
  await BluetoothEscposPrinter.printText(
    '--------------------------------\r\n',
    {},
  );
  await BluetoothEscposPrinter.printText('Thanks for your shopping \r\n', {});
  await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});

  console.log('Finished Printing');
};

async function printColumns(sproduct, columnWidths) {
  await Promise.all(
    sproduct.map(async (item, index) => {
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [item.pdname, item.qty, item.price, item.price * item.qty],
        {},
      );
    }),
  );
}
