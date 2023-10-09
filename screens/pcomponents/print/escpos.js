/**
 * Created by januslo on 2018/12/26.
 */

import React, {Component} from 'react';
import {StyleSheet, View, Image, Button} from 'react-native';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';

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
// 用法

// const base64Image = 'nothing';
// const base64Jpg = 'evertyihi';

// export default class EscPos extends Component {
//   _listeners = [];

//   constructor(props) {
//     super(props);
//     this.state = {
//       boundAddress: props.boundAddress,
//       boundName: props.boundName,
//       loading: false,
//     };
//   }

//   componentDidMount() {
//     //alert(BluetoothManager)
//   }

//   render() {
//     return (
//       <View style={{flex: 1}}>
//         <View style={styles.btn}>
//           <Button
//             onPress={() => {
//               this.props.navigator.pop();
//             }}
//             title="&lt;= Back To Pre"
//           />
//         </View>
//         <View style={styles.btn}>
//           <Button
//             onPress={async () => {
//               await BluetoothEscposPrinter.printBarCode(
//                 '123456789012',
//                 BluetoothEscposPrinter.BARCODETYPE.JAN13,
//                 3,
//                 120,
//                 0,
//                 2,
//               );
//               await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
//             }}
//             title="Print BarCode"
//           />
//         </View>
//         <View style={styles.btn}>
//           <Button
//             onPress={async () => {
//               await BluetoothEscposPrinter.printQRCode(
//                 '你是不是傻？',
//                 280,
//                 BluetoothEscposPrinter.ERROR_CORRECTION.L,
//               ); //.then(()=>{alert('done')},(err)=>{alert(err)});
//               await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
//             }}
//             title="Print QRCode"
//           />
//         </View>

//         <View style={styles.btn}>
//           <Button
//             onPress={async () => {
//               await BluetoothEscposPrinter.printerUnderLine(2);
//               await BluetoothEscposPrinter.printText('中国话\r\n', {
//                 encoding: 'GBK',
//                 codepage: 0,
//                 widthtimes: 0,
//                 heigthtimes: 0,
//                 fonttype: 1,
//               });
//               await BluetoothEscposPrinter.printerUnderLine(0);
//               await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
//             }}
//             title="Print UnderLine"
//           />
//         </View>

//         <View style={styles.btn}>
//           <Button
//             onPress={async () => {
//               await BluetoothEscposPrinter.rotate(
//                 BluetoothEscposPrinter.ROTATION.ON,
//               );
//               await BluetoothEscposPrinter.printText(
//                 '中国话中国话中国话中国话中国话\r\n',
//                 {
//                   encoding: 'GBK',
//                   codepage: 0,
//                   widthtimes: 0,
//                   heigthtimes: 0,
//                   fonttype: 1,
//                 },
//               );
//               await BluetoothEscposPrinter.rotate(
//                 BluetoothEscposPrinter.ROTATION.OFF,
//               );
//               await BluetoothEscposPrinter.printText(
//                 '中国话中国话中国话中国话中国话\r\n',
//                 {
//                   encoding: 'GBK',
//                   codepage: 0,
//                   widthtimes: 0,
//                   heigthtimes: 0,
//                   fonttype: 1,
//                 },
//               );
//               await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
//             }}
//             title="Print Rotate"
//           />
//         </View>

//         <View style={styles.btn}>
//           <Button
//             onPress={async () => {
//               await BluetoothEscposPrinter.printerInit();
//               await BluetoothEscposPrinter.printText(
//                 'I am an english\r\n\r\n',
//                 {},
//               );
//             }}
//             title="Print Text"
//           />
//         </View>
//         <View style={styles.btn}>
//           <Button
//             onPress={async () => {
//               await BluetoothEscposPrinter.printerLeftSpace(0);
//               await BluetoothEscposPrinter.printColumn(
//                 [
//                   BluetoothEscposPrinter.width58 / 8 / 3,
//                   BluetoothEscposPrinter.width58 / 8 / 3 - 1,
//                   BluetoothEscposPrinter.width58 / 8 / 3 - 1,
//                 ],
//                 [
//                   BluetoothEscposPrinter.ALIGN.CENTER,
//                   BluetoothEscposPrinter.ALIGN.CENTER,
//                   BluetoothEscposPrinter.ALIGN.CENTER,
//                 ],
//                 ['我就是一个测试看看很长会怎么样的啦', 'testing', '223344'],
//                 {fonttype: 1},
//               );
//               await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
//             }}
//             title="Print Column"
//           />
//         </View>
//         <View style={styles.btn}>
//           <Button
//             disabled={this.state.loading || this.state.boundAddress.length <= 0}
//             title="Print Receipt"
//             onPress={async () => {
//               try {
//                 await BluetoothEscposPrinter.printerInit();
//                 await BluetoothEscposPrinter.printerLeftSpace(0);

//                 await BluetoothEscposPrinter.printerAlign(
//                   BluetoothEscposPrinter.ALIGN.CENTER,
//                 );
//                 await BluetoothEscposPrinter.setBlob(0);
//                 await BluetoothEscposPrinter.printText('广州俊烨\r\n', {
//                   encoding: 'GBK',
//                   codepage: 0,
//                   widthtimes: 3,
//                   heigthtimes: 3,
//                   fonttype: 1,
//                 });
//                 await BluetoothEscposPrinter.setBlob(0);
//                 await BluetoothEscposPrinter.printText('销售单\r\n', {
//                   encoding: 'GBK',
//                   codepage: 0,
//                   widthtimes: 0,
//                   heigthtimes: 0,
//                   fonttype: 1,
//                 });
//                 await BluetoothEscposPrinter.printerAlign(
//                   BluetoothEscposPrinter.ALIGN.LEFT,
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '客户：零售客户\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '单号：xsd201909210000001\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '日期：' +
//                     dateFormat(new Date(), 'yyyy-mm-dd h:MM:ss') +
//                     '\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '销售员：18664896621\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '--------------------------------\r\n',
//                   {},
//                 );
//                 let columnWidths = [12, 6, 6, 8];
//                 await BluetoothEscposPrinter.printColumn(
//                   columnWidths,
//                   [
//                     BluetoothEscposPrinter.ALIGN.LEFT,
//                     BluetoothEscposPrinter.ALIGN.CENTER,
//                     BluetoothEscposPrinter.ALIGN.CENTER,
//                     BluetoothEscposPrinter.ALIGN.RIGHT,
//                   ],
//                   ['商品', '数量', '单价', '金额'],
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printColumn(
//                   columnWidths,
//                   [
//                     BluetoothEscposPrinter.ALIGN.LEFT,
//                     BluetoothEscposPrinter.ALIGN.LEFT,
//                     BluetoothEscposPrinter.ALIGN.CENTER,
//                     BluetoothEscposPrinter.ALIGN.RIGHT,
//                   ],
//                   [
//                     'React-Native定制开发我是比较长的位置你稍微看看是不是这样?',
//                     '1',
//                     '32000',
//                     '32000',
//                   ],
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText('\r\n', {});
//                 await BluetoothEscposPrinter.printColumn(
//                   columnWidths,
//                   [
//                     BluetoothEscposPrinter.ALIGN.LEFT,
//                     BluetoothEscposPrinter.ALIGN.LEFT,
//                     BluetoothEscposPrinter.ALIGN.CENTER,
//                     BluetoothEscposPrinter.ALIGN.RIGHT,
//                   ],
//                   [
//                     'React-Native定制开发我是比较长的位置你稍微看看是不是这样?',
//                     '1',
//                     '32000',
//                     '32000',
//                   ],
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText('\r\n', {});
//                 await BluetoothEscposPrinter.printText(
//                   '--------------------------------\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printColumn(
//                   [12, 8, 12],
//                   [
//                     BluetoothEscposPrinter.ALIGN.LEFT,
//                     BluetoothEscposPrinter.ALIGN.LEFT,
//                     BluetoothEscposPrinter.ALIGN.RIGHT,
//                   ],
//                   ['合计', '2', '64000'],
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText('\r\n', {});
//                 await BluetoothEscposPrinter.printText('折扣率：100%\r\n', {});
//                 await BluetoothEscposPrinter.printText(
//                   '折扣后应收：64000.00\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '会员卡支付：0.00\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '积分抵扣：0.00\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '支付金额：64000.00\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '结算账户：现金账户\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText('备注：无\r\n', {});
//                 await BluetoothEscposPrinter.printText('快递单号：无\r\n', {});
//                 await BluetoothEscposPrinter.printText(
//                   '打印时间：' +
//                     dateFormat(new Date(), 'yyyy-mm-dd h:MM:ss') +
//                     '\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '--------------------------------\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printText('电话：\r\n', {});
//                 await BluetoothEscposPrinter.printText('地址:\r\n\r\n', {});
//                 await BluetoothEscposPrinter.printerAlign(
//                   BluetoothEscposPrinter.ALIGN.CENTER,
//                 );
//                 await BluetoothEscposPrinter.printText(
//                   '欢迎下次光临\r\n\r\n\r\n',
//                   {},
//                 );
//                 await BluetoothEscposPrinter.printerAlign(
//                   BluetoothEscposPrinter.ALIGN.LEFT,
//                 );
//                 await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
//               } catch (e) {
//                 alert(e.message || 'ERROR');
//               }
//             }}
//           />
//         </View>
//         <View style={styles.btn}>
//           <Button
//             disabled={this.state.loading || this.state.boundAddress.length <= 0}
//             title="Print FOLLOWING Image"
//             onPress={async () => {
//               try {
//                 await BluetoothEscposPrinter.printPic(base64Jpg, {
//                   width: 200,
//                   left: 40,
//                 });
//                 await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
//                 await BluetoothEscposPrinter.printPic(base64Image, {
//                   width: 200,
//                   left: 40,
//                 });
//                 await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
//                 await BluetoothEscposPrinter.printPic(base64JpgLogo, {
//                   width: 220,
//                   left: 20,
//                 });
//               } catch (e) {
//                 alert(e.message || 'ERROR');
//               }
//             }}
//           />
//           <View>
//             <Image
//               style={{width: 150, height: 58}}
//               source={{uri: 'data:image/jpeg;base64,' + base64Jpg}}
//             />
//             <Image
//               style={{width: 60, height: 60}}
//               source={{uri: 'data:image/png;base64,' + base64Image}}
//             />
//             <Image
//               style={{width: 150, height: 70}}
//               source={{uri: 'data:image/jpeg;base64,' + base64JpgLogo}}
//             />
//           </View>
//         </View>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  btn: {
    marginBottom: 8,
  },
});
/*

This View show voucher details with table view that will print with pos printer 

Below is the data format example that will be passed to this component
{"receiptNumber":"1696700089993",
"customerName":"Hla Hla",
"sproduct":[
{"id":185,"name":"ရေဘူး","price":"400","qty":"1","date":"2023-10-08T00:04:51.224593+06:30"},
{"id":186,"name":"ထမင်းချိုင့်","price":"600","qty":"1","date":"2023-10-08T00:04:51.253763+06:30"}],
"totalAmount":"1000",
"tax":"0",
"discount":"0",
"grandtotal":"1000.000",
"deliveryCharges":null,
"date":"2023-10-08T00:04:51.205830+06:30",
"description":""}

*/

/*
I want to print like this format

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

  await BluetoothEscposPrinter.printText(name + '\r\n', {
    // print shop name
    encoding: 'GBK',
    codepage: 0,
    widthtimes: 3,
    heigthtimes: 3,
    fonttype: 1,
  });

  await BluetoothEscposPrinter.printText(
    address + ',' + phoneno + ',' + email + '\r\n',
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
    'Receipt Number : ' + receiptNumber + '\r\n',
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
