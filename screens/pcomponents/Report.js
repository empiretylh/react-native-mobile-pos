/* eslint-disable no-extend-native */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  TouchableOpacityBase,
  TextInput,
  Button,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {IMAGE, STYLE as s, COLOR as C} from '../../Database';
import EncryptedStorage from 'react-native-encrypted-storage';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {numberWithCommas} from '../../Database';
import {LineChart} from 'react-native-chart-kit';
import {Table, Row, Rows} from 'react-native-table-component';
import {MessageModalNormal} from '../MessageModal';
import {ShareOpenGraphValueContainer} from 'react-native-fbsdk';
import DatePicker from 'react-native-date-picker';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const ReportScreen = ({navigation}) => {
  const RemoveToken = () => {
    EncryptedStorage.removeItem('secure_token');
  };

  useEffect(() => {
    Load();
  }, []);

  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [otherIncome, setOtherincomeData] = useState([]);

  const [refresh, setRefresh] = useState();
  const [load, setLoad] = useState(false);

  const Load = (
    type = '',
    time = 'today',
    startd = new Date(),
    endd = new Date(),
  ) => {
    setRefresh(true);

    getSalesFromServer(
      type,
      time,
      startd.toLocaleDateString(),
      endd.toLocaleDateString(),
    );

    getProductFromServer();

    getExpenseFromServer(
      type,
      time,
      startd.toLocaleDateString(),
      endd.toLocaleDateString(),
    );

    getPurchaseFromServer(
      type,
      time,
      startd.toLocaleDateString(),
      endd.toLocaleDateString(),
    );

    getOtherIncomeFromServer(
      type,
      time,
      startd.toLocaleDateString(),
      endd.toLocaleDateString(),
    );
  };
  const getSalesFromServer = (type = '', time = 'today', startd, endd) => {
    setLoad(true);
    setSaleTableData(null);
    axios
      .get('/api/sales/', {
        params: {
          type: type,
          time: time,
          startd: startd,
          endd: endd,
        },
      })
      .then(res => {
        setSalesData(res.data);

        setTimeout(() => {
          ComputeSalesData(res.data, time);
        }, 1000);
      })
      .catch(err => console.log(err));
  };

  const getProductFromServer = () => {
    axios
      .get('/api/products/')
      .then(res => setProductData(res.data))
      .catch(err => console.log(err));
  };

  const getExpenseFromServer = (type = '', time = 'today', startd, endd) => {
    setExpenseTable(null);
    axios
      .get('/api/expenses/', {
        params: {
          type: type,
          time: time,
          startd: startd,
          endd: endd,
        },
      })
      .then(res => {
        setExpenseData(res.data);
        ComputeOtherIncomeData(res.data, time, 'expense');
      })
      .catch(err => console.log(err));
  };

  const getPurchaseFromServer = (type = '', time = 'today', startd, endd) => {
    setPurchaseTable(null);
    axios
      .get('/api/purchases/', {
        params: {
          type: type,
          time: time,
          startd: startd,
          endd: endd,
        },
      })
      .then(res => {
        setPurchaseData(res.data);
        ComputeOtherIncomeData(res.data, time, 'purchase');
      })
      .catch(err => console.log(err));
  };

  const getOtherIncomeFromServer = (
    type = '',
    time = 'today',
    startd,
    endd,
  ) => {
    setOtherIncomeTable(null);
    axios
      .get('/api/otherincome/', {
        params: {
          type: type,
          time: time,
          startd: startd,
          endd: endd,
        },
      })
      .then(res => {
        setOtherincomeData(res.data);
        setRefresh(false);
        ComputeOtherIncomeData(res.data, time);
      })
      .catch(err => console.log(err));
  };

  const SumSales = data => {
    let price = 0;
    data.forEach(e => {
      price += parseInt(e.grandtotal);
    });
    return price;
  };

  const SumExpenseAndPurchase = data => {
    let price = 0;
    data.forEach(e => {
      price += parseInt(e.price);
    });
    return price;
  };
  const SumProducts = data => {
    let price = 0;
    data.forEach(e => {
      price += parseInt(e.price) * parseInt(e.qty);
    });
    return price;
  };
  const [salesTable, setSaleTableData] = useState([0, 0]);
  const [tabletotalprice, setTabletotalprice] = useState(0);

  const [tableWidthArr, setWidthArr] = useState([
    150, 150, 150, 150, 80, 80, 100, 150, 150,
  ]);

  const [otherIncomeTable, setOtherIncomeTable] = useState([0]);
  const [otherincomemodal, setotherincomemodal] = useState(false);
  const [oitabletotal, setoitabletotal] = useState(0);
  const onCloseotherincome = () => setotherincomemodal(false);

  const [ExpenseTable, setExpenseTable] = useState([0]);
  const [expensemodal, setexpensemodal] = useState(false);
  const [extotal, setextotal] = useState(0);
  const onCloseExpense = () => setexpensemodal(false);

  const [PurchaseTable, setPurchaseTable] = useState([0]);
  const [purchasemodal, setpurchasemodal] = useState(false);
  const [putotal, setputotal] = useState(0);

  const OnClosePurchase = () => setpurchasemodal(false);

  const [cudmodal, setcudmodal] = useState(false);
  const OnClosenOpenCud = () => setcudmodal(!cudmodal);

  const [sdopen, setsdopen] = useState(false);
  const [sdate, setsdate] = useState(new Date());

  const [edopen, setedopen] = useState(false);
  const [edate, setedate] = useState(new Date());

  const ComputeSalesData = (salesData, t) => {
    // Compute(salesData, t).then(res => {
    //   setSalesChartData(res.pricedata);
    //   setSalesChartLabel(res.label);
    //   // setSaleTableData(res.tabledata);
    //   // setTabletotalprice(res.totalprice);
    // });

    let tableData = [];
    let price = 0;
    salesData.forEach((item, index) => {
      let row = [];
      for (var [_, value] of Object.entries(item)) {
        if (_ === 'sproduct') {
          var productstr = '';
          value.forEach((data, index) => {
            console.log(data.product_name);
            productstr +=
              data.product_name + (value.length === index + 1 ? '' : ', ');
          });
          row.push(productstr);
        } else if (_ === 'date') {
          let d = new Date(value);
          row.push(d.toDateString());
        } else if (_ === 'discount') {
          row.push(value + '%');
        } else if (_ === 'totalAmount') {
          row.push(numberWithCommas(value) + ' Ks');
        } else if (_ === 'tax') {
          row.push(numberWithCommas(value) + ' Ks');
        } else if (_ === 'grandtotal') {
          price += parseInt(value);
          row.push(numberWithCommas(parseInt(value)) + ' Ks');
        } else {
          row.push(value);
        }
      }
      tableData.push(row);
    });
    console.log(tableData);
    setSaleTableData(tableData);
    setTabletotalprice(price);
    setLoad(false);
  };

  const ComputeOtherIncomeData = (data, t, dtype = 'income') => {
    let tableData = [];
    let price = 0;
    data.forEach((item, index) => {
      let row = [];

      for (var [_, value] of Object.entries(item)) {
        if (_ === 'price') {
          price += parseInt(value);
          row.push(numberWithCommas(value) + ' Ks');
        } else if (_ === 'date') {
          let d = new Date(value);
          row.push(d.toDateString());
        } else if (_ === 'id') {
          row.push(index + 1);
        } else {
          row.push(value);
        }
      }
      tableData.push(row);
    });
    if (dtype == 'expense') {
      setExpenseTable(tableData);
      setextotal(price);
    } else if (dtype == 'purchase') {
      setPurchaseTable(tableData);
      setputotal(price);
    } else {
      setOtherIncomeTable(tableData);
      setoitabletotal(price);
    }

    setLoad(false);
  };

  const Compute = async (salesData, t) => {
    const label = [];
    const pricedata = [];
    const tabledata = [];
    var totalprice = 0;

    /**
     * @param{Date} time The Date
     **/

    const format12H = time => {
      return (
        time
          .toLocaleTimeString()
          .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3') +
        (time.getHours() >= 12 ? ' PM' : ' AM')
      );
    };

    if (t === 'today') {
      const temp = salesData.filter(e => {
        let today = new Date();
        let d = new Date(e.date);
        // console.log(e.date);

        return (
          today.getDate() === d.getDate() &&
          today.getMonth() === d.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      });

      temp.forEach(e => {
        let d = new Date(e.date);
        // console.log(e.customerName)
        //  console.log(d.getHours() + ':' + d.getMinutes());
        let time = d.toTimeString().substring(0, 5);
        label.push(time);
        pricedata.push(kFormatter(parseInt(e.grandtotal)));
        tabledata.push([
          format12H(d),
          numberWithCommas(parseInt(e.grandtotal)) + ' MMK',
        ]);
        totalprice += parseInt(e.grandtotal);
      });
    } else if (t === 'week') {
      const weekString = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      var curr = new Date();
      var first = curr.getDate() - curr.getDay();
      var last = first + 6;

      var firstdate = new Date(curr.setDate(first));
      var lastdate = new Date(curr.setDate(last));

      console.log(firstdate.getTime());

      const tempw = salesData.filter(e => {
        let d = new Date(e.date);
        return (
          d.getTime() >= firstdate.getTime() &&
          d.getTime() <= lastdate.getTime()
        );
      });

      weekString.forEach((e, index) => {
        console.log(e);
        var price = 0;

        tempw.forEach(i => {
          var d = new Date(i.date);
          if (d.getDay() === index) {
            price += parseInt(i.grandtotal);
          }
        });

        label.push(e);
        pricedata.push(kFormatter(price));
        tabledata.push([e, numberWithCommas(parseInt(price)) + ' MMK']);
        totalprice += price;
      });
    } else {
      const monthString = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      var firstd = new Date();
      firstd.setDate(1);
      firstd.setMonth(0);
      firstd.setHours(0, 0, 0, 0);

      console.log('First :' + firstd);

      var lastd = new Date();
      lastd.setDate(31);
      lastd.setMonth(11);
      lastd.setHours(24, 0, 0, 0);

      const tempm = salesData.filter(e => {
        let d = new Date(e.date);
        return (
          d.getTime() >= firstd.getTime() && d.getTime() <= lastd.getTime()
        );
      });

      monthString.forEach((e, index) => {
        console.log(e);
        var price = 0;

        tempm.forEach(i => {
          var d = new Date(i.date);
          if (d.getMonth() === index) {
            price += parseInt(i.grandtotal);
          }
        });

        label.push(e);
        pricedata.push(kFormatter(price));
        tabledata.push([e, numberWithCommas(parseInt(price)) + ' MMK']);
        totalprice += price;
      });
    }

    if (pricedata.length > 0) {
      return {
        pricedata: pricedata,
        label: label,
        tabledata: tabledata,
        totalprice: totalprice,
      };
    }
  };

  const [salesModal, setSalesModal] = useState(false);

  const onCloseSales = () => setSalesModal(false);

  const SalesTable = () => {
    return (
      <View
        style={[
          (salesTable === null ? false : salesTable.length > 6) && {
            paddingBottom: 40,
          },
        ]}>
        <Table borderStyle={{borderWidth: 1, borderColor: '#000'}}>
          <Row
            data={[
              'Receipt Number',
              'Customer Name',
              'Items',
              'Sub Total',
              'Tax',
              'Discount',
              'Grand Total',
              'Date',
              'Description',
            ]}
            style={[
              {
                backgroundColor: '#c8e1ff',
                height: 40,
              },
            ]}
            textStyle={{color: 'black', textAlign: 'center'}}
            widthArr={tableWidthArr}
          />
          {salesTable === null ? (
            <Text style={{...s.font_bold}}>Loading</Text>
          ) : (
            <ScrollView
              nestedScrollEnabled={true}
              style={{marginTop: -1, marginLeft: -1}}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#000'}}>
                {salesTable.map((item, index) => (
                  <Row
                    data={item}
                    textStyle={[{margin: 6, color: 'black'}]}
                    widthArr={tableWidthArr}
                    style={[
                      {backgroundColor: '#E7E6E1'},
                      index % 2 && {backgroundColor: '#F7F6E7'},
                    ]}
                  />
                ))}
              </Table>
            </ScrollView>
          )}
        </Table>
      </View>
    );
  };

  const OtherIncomeTableView = (data = []) => {
    let widtharr = [50, 150, 80, 150, 200];
    return (
      <View
        style={[
          (data === null ? false : data.length > 6) && {
            paddingBottom: 40,
          },
        ]}>
        <Table borderStyle={{borderWidth: 1, borderColor: '#000'}}>
          <Row
            data={['No', 'Title', 'Price', 'Date', 'Description']}
            style={[
              {
                backgroundColor: '#c8e1ff',
                height: 40,
              },
            ]}
            textStyle={{color: 'black', textAlign: 'center'}}
            widthArr={widtharr}
          />
          {data === null ? (
            <Text style={{...s.font_bold}}>Loading</Text>
          ) : (
            <ScrollView
              nestedScrollEnabled={true}
              style={{marginTop: -1, marginLeft: -1}}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#000'}}>
                {data.map((item, index) => (
                  <Row
                    data={item}
                    textStyle={[{margin: 6, color: 'black'}]}
                    widthArr={widtharr}
                    style={[
                      {backgroundColor: '#E7E6E1'},
                      index % 2 && {backgroundColor: '#F7F6E7'},
                    ]}
                  />
                ))}
              </Table>
            </ScrollView>
          )}
        </Table>
      </View>
    );
  };

  const TableView = () => {
    return (
      <ScrollView nestedScrollEnable={true}>
        {/* Sales */}
        <View style={{marginBottom: 5}}>
          <View style={{...s.flexrow_aligncenter_j_between, padding: 5}}>
            <Text style={{...s.font_bold, color: 'black'}}>Sales</Text>
            <TouchableOpacity onPress={() => setSalesModal(true)}>
              <Icons name={'expand'} size={25} color={'#000'} />
            </TouchableOpacity>
          </View>
          <MessageModalNormal
            width="100%"
            show={salesModal}
            onClose={onCloseSales}>
            <ScrollView horizontal={true}>{SalesTable()}</ScrollView>
          </MessageModalNormal>
          <ScrollView
            horizontal={true}
            nestedScrollEnabled={true}
            style={{maxHeight: C.windowHeight * 40}}>
            {SalesTable()}
          </ScrollView>

          <View style={styles.totalView}>
            <Text style={{...s.font_bold, color: 'black'}}>Total Amount</Text>
            <Text style={{...s.font_bold, color: 'black'}}>
              {numberWithCommas(tabletotalprice) + ' MMK'}
            </Text>
          </View>
        </View>
        {/* OtherIncome */}
        <View style={{marginBottom: 5}}>
          <View style={{...s.flexrow_aligncenter_j_between, padding: 5}}>
            <Text style={{...s.font_bold, color: 'black'}}>Other Income</Text>
            <TouchableOpacity onPress={() => setotherincomemodal(true)}>
              <Icons name={'expand'} size={25} color={'#000'} />
            </TouchableOpacity>
          </View>
          <MessageModalNormal
            width="100%"
            show={otherincomemodal}
            onClose={onCloseotherincome}>
            <ScrollView horizontal={true}>
              {OtherIncomeTableView(otherIncomeTable)}
            </ScrollView>
          </MessageModalNormal>
          <ScrollView
            horizontal={true}
            nestedScrollEnabled={true}
            style={{maxHeight: C.windowHeight * 40}}>
            {OtherIncomeTableView(otherIncomeTable)}
          </ScrollView>

          <View style={styles.totalView}>
            <Text style={{...s.font_bold, color: 'black'}}>Total Amount</Text>
            <Text style={{...s.font_bold, color: 'black'}}>
              {numberWithCommas(oitabletotal) + ' MMK'}
            </Text>
          </View>
        </View>
        {/* Expense */}
        <View style={{marginBottom: 5}}>
          <View style={{...s.flexrow_aligncenter_j_between, padding: 5}}>
            <Text style={{...s.font_bold, color: 'black'}}>Expense</Text>
            <TouchableOpacity onPress={() => setexpensemodal(true)}>
              <Icons name={'expand'} size={25} color={'#000'} />
            </TouchableOpacity>
          </View>
          <MessageModalNormal
            width="100%"
            show={expensemodal}
            onClose={onCloseExpense}>
            <ScrollView horizontal={true}>
              {OtherIncomeTableView(ExpenseTable)}
            </ScrollView>
          </MessageModalNormal>
          <ScrollView
            horizontal={true}
            nestedScrollEnabled={true}
            style={{maxHeight: C.windowHeight * 40}}>
            {OtherIncomeTableView(ExpenseTable)}
          </ScrollView>

          <View style={styles.totalView}>
            <Text style={{...s.font_bold, color: 'black'}}>Total Amount</Text>
            <Text style={{...s.font_bold, color: 'black'}}>
              {numberWithCommas(extotal) + ' MMK'}
            </Text>
          </View>
        </View>
        {/* Purchase */}
        <View style={{marginBottom: 5}}>
          <View style={{...s.flexrow_aligncenter_j_between, padding: 5}}>
            <Text style={{...s.font_bold, color: 'black'}}>Purchase</Text>
            <TouchableOpacity onPress={() => setpurchasemodal(true)}>
              <Icons name={'expand'} size={25} color={'#000'} />
            </TouchableOpacity>
          </View>
          <MessageModalNormal
            width="100%"
            show={purchasemodal}
            onClose={OnClosePurchase}>
            <ScrollView horizontal={true}>
              {OtherIncomeTableView(PurchaseTable)}
            </ScrollView>
          </MessageModalNormal>
          <ScrollView
            horizontal={true}
            nestedScrollEnabled={true}
            style={{maxHeight: C.windowHeight * 40}}>
            {OtherIncomeTableView(PurchaseTable)}
          </ScrollView>

          <View style={styles.totalView}>
            <Text style={{...s.font_bold, color: 'black'}}>Total Amount</Text>
            <Text style={{...s.font_bold, color: 'black'}}>
              {numberWithCommas(putotal) + ' MMK'}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

    const ChartView = () => {
    return (
      <ScrollView nestedScrollEnable={true}>
        {/* Sales */}
        <View style={{marginBottom: 5}}>
          <Text style={{...s.font_bold, color: 'black'}}>Sales</Text>
        </View>
      </ScrollView>
    );
  };

  return (
    // {/* appbar */}
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'column'}}>
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            padding: 8,
          }}>
          <Text style={{...s.bold_label, fontSize: 23}}>Report</Text>
        </View>
        <ScrollView
          style={{
            flexDirection: 'row',
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}>
          <TouchableOpacity
            underlayColor="white"
            onPress={() => Load('', 'today')}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: C.blackbutton,
                margin: 5,
                borderRadius: 15,
              }}>
              <Text style={{color: 'white', padding: 10}}>Today</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            underlayColor="white"
            onPress={() => Load('', 'month')}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: C.blackbutton,
                margin: 5,
                borderRadius: 15,
              }}>
              <Text style={{color: 'white', padding: 10}}>This Month</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            underlayColor="white"
            onPress={() => Load('', 'year')}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: C.blackbutton,
                margin: 5,
                borderRadius: 15,
              }}>
              <Text style={{color: 'white', padding: 10}}>This Year</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            underlayColor="white"
            onPress={() => OnClosenOpenCud()}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: C.blackbutton,
                margin: 5,
                borderRadius: 15,
              }}>
              <Text style={{color: 'white', padding: 10}}>Custom Date</Text>
            </View>
          </TouchableOpacity>

          <MessageModalNormal show={cudmodal} onClose={OnClosenOpenCud}>
            <Text style={{...s.bold_label, marginTop: 8}}>Start Date</Text>

            <View
              style={{
                ...inputS,
                ...s.flexrow_aligncenter_j_between,
                padding: 0,
                paddingLeft: 10,
              }}>
              <TextInput
                style={{
                  ...s.bold_label,
                  color: '#0f0f0f',
                }}
                placeholder={'Date'}
                value={sdate.toLocaleDateString()}
                defaultValue={sdate.toLocaleDateString()}
              />
              <TouchableOpacity onPress={() => setsdopen(true)}>
                <Icons name={'calendar'} size={20} color={'#000'} />
              </TouchableOpacity>
              <DatePicker
                modal
                open={sdopen}
                date={sdate}
                mode={'date'}
                onConfirm={date => {
                  setsdopen(false);

                  console.log(date);
                  setsdate(date);

                  var s =
                    date.getFullYear() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getDate();
                  console.log(s);
                }}
                onCancel={() => {
                  setsdopen(false);
                }}
              />
            </View>
            <Text style={{...s.bold_label, marginTop: 8}}>End Date</Text>

            <View
              style={{
                ...inputS,
                ...s.flexrow_aligncenter_j_between,
                padding: 0,
                paddingLeft: 10,
              }}>
              <TextInput
                style={{
                  ...s.bold_label,
                  color: '#0f0f0f',
                }}
                placeholder={'Date'}
                value={edate.toLocaleDateString()}
                defaultValue={edate.toLocaleDateString()}
              />
              <TouchableOpacity onPress={() => setedopen(true)}>
                <Icons name={'calendar'} size={20} color={'#000'} />
              </TouchableOpacity>
              <DatePicker
                modal
                open={edopen}
                date={edate}
                mode={'date'}
                onConfirm={date => {
                  setedopen(false);

                  setedate(date);
                  var s =
                    date.getFullYear() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getDate();
                  console.log(s);
                }}
                onCancel={() => {
                  setedopen(false);
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                Load('', 'custom', sdate, edate);
                OnClosenOpenCud();
              }}
              style={{...s.blue_button, marginTop: 8, padding: 10}}>
              <Text style={{...s.bold_label, color: 'white'}}>
                Apply & Load Data{' '}
              </Text>
            </TouchableOpacity>
          </MessageModalNormal>
        </ScrollView>
      </View>

      <View style={{padding: 8, flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: '#f0f0f0',
                shadowOffset: {width: 0, height: 0},
                elevation: 0,
              },
            }}>
            <Tab.Screen name="Table View" component={TableView} />
            <Tab.Screen name="Chart View" component={ChartView} />
          </Tab.Navigator>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  totalView: {
    ...s.flexrow_aligncenter_j_between,
    margin: 5,
    padding: 5,
    backgroundColor: 'yellow',
  },
});

const kFormatter = num => {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1)
    : Math.sign(num) * Math.abs(num);
};

export default ReportScreen;

const inputS = {
  ...s.flexrow_aligncenter_j_between,
  borderRadius: 15,
  height: 45,
  borderColor: 'black',
  borderWidth: 1.5,
  padding: 10,
  paddingRight: 10,
  marginTop: 10,
};
