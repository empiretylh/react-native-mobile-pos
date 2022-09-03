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

const HomeScreen = ({navigation}) => {
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

  const Load = () => {
    setRefresh(true);

    getSalesFromServer();

    getProductFromServer();

    getExpenseFromServer();

    getPurchaseFromServer();

    getOtherIncomeFromServer();
  };
  const getSalesFromServer = () => {
    axios
      .get('/api/sales/', {
        params: {
          type: 'DT',
        },
      })
      .then(res => {
        setSalesData(res.data);

        setTimeout(() => {
          getSalesChartFromServer(res.data, 't');
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

  const getExpenseFromServer = () => {
    axios
      .get('/api/expenses/')
      .then(res => setExpenseData(res.data))
      .catch(err => console.log(err));
  };

  const getPurchaseFromServer = () => {
    axios
      .get('/api/purchases/')
      .then(res => setPurchaseData(res.data))
      .catch(err => console.log(err));
  };

  const getOtherIncomeFromServer = () => {
    axios
      .get('/api/otherincome/')
      .then(res => {
        setOtherincomeData(res.data);
        setRefresh(false);
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

  const [salesChartData, setSalesChartData] = useState([0]);
  const [salesTable, setSaleTableData] = useState([0, 0]);
  const [salesChartLabel, setSalesChartLabel] = useState(['0']);
  const [tabletotalprice, setTabletotalprice] = useState(0);
  const [dtSelect, setDtSelect] = useState('t');

  const getSalesChartFromServer = (salesData, t) => {
    Compute(salesData, t).then(res => {
      setSalesChartData(res.pricedata);
      setSalesChartLabel(res.label);
      setSaleTableData(res.tabledata);
      setTabletotalprice(res.totalprice);
    });
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

    if (t === 't') {
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
    } else if (t === 'w') {
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

  return (
    <ScrollView
      style={s.Container}
      refreshControl={<RefreshControl onRefresh={Load} refreshing={refresh} />}>
      {/* appbar */}
      <View
        style={{
          ...s.flexrow_aligncenter_j_between,
          padding: 8,
        }}>
        <Text style={{...s.bold_label, fontSize: 23}}>Dashboard</Text>
        <Image
          source={IMAGE.thura}
          style={{width: 40, height: 40, borderRadius: 30}}
        />
      </View>
      {/* view */}
      <View style={{flex: 1}}>
        <TouchableHighlight
          underlayColor={'white'}
          onPress={() => navigation.navigate('sales')}>
          <ImageBackground
            source={IMAGE.d1}
            style={{
              width: '100%',
              marginTop: 8,
            }}
            imageStyle={{borderRadius: 15}}
            resizeMode={'cover'}>
            <View style={{padding: 5, ...s.flexrow_aligncenter}}>
              <Icons name={'wallet-sharp'} size={100} color={'#fff'} />
              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                }}>
                <Text style={{...s.bold_label, color: 'white', fontSize: 25}}>
                  Sales
                </Text>

                <Text
                  style={{
                    ...s.bold_label,
                    marginTop: 10,
                    fontSize: 20,
                    color: 'white',
                  }}>
                  {numberWithCommas(SumSales(salesData))} MMK
                </Text>
              </View>
              <TouchableOpacity
                underlayColor={'white'}
                style={{position: 'absolute', bottom: 5, right: 5}}>
                <Icons
                  name={'arrow-forward-circle-outline'}
                  size={50}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'white'}
          onPress={() => navigation.navigate('expense')}>
          <ImageBackground
            source={IMAGE.d2}
            style={{
              width: '100%',
              marginTop: 8,
            }}
            imageStyle={{borderRadius: 15}}
            resizeMode={'cover'}>
            <View style={{padding: 5, ...s.flexrow_aligncenter}}>
              <Icons name={'albums-outline'} size={100} color={'#fff'} />
              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                }}>
                <Text style={{...s.bold_label, color: 'white', fontSize: 25}}>
                  Expense
                </Text>

                <Text
                  style={{
                    ...s.bold_label,
                    marginTop: 10,
                    fontSize: 20,
                    color: 'white',
                  }}>
                  {numberWithCommas(SumExpenseAndPurchase(expenseData))} MMK
                </Text>
              </View>
              <TouchableOpacity
                underlayColor={'white'}
                style={{position: 'absolute', bottom: 5, right: 5}}>
                <Icons
                  name={'arrow-forward-circle-outline'}
                  size={50}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'white'}
          onPress={() => navigation.navigate('product', {screen: 'cpurchase'})}>
          <ImageBackground
            source={IMAGE.d3}
            style={{
              width: '100%',
              marginTop: 8,
            }}
            imageStyle={{borderRadius: 15}}
            resizeMode={'cover'}>
            <View style={{padding: 5, ...s.flexrow_aligncenter}}>
              <Icons name={'cash'} size={100} color={'#fff'} />
              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                }}>
                <Text style={{...s.bold_label, color: 'white', fontSize: 25}}>
                  Purchase
                </Text>

                <Text
                  style={{
                    ...s.bold_label,
                    marginTop: 10,
                    fontSize: 20,
                    color: 'white',
                  }}>
                  {numberWithCommas(SumExpenseAndPurchase(purchaseData))} MMK
                </Text>
              </View>
              <TouchableOpacity
                underlayColor={'white'}
                style={{position: 'absolute', bottom: 5, right: 5}}>
                <Icons
                  name={'arrow-forward-circle-outline'}
                  size={50}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'white'}
          onPress={() => navigation.navigate('product', {screen: 'cproduct'})}>
          <ImageBackground
            source={IMAGE.d4}
            style={{
              width: '100%',
              marginTop: 8,
            }}
            imageStyle={{borderRadius: 15}}
            resizeMode={'cover'}>
            <View style={{padding: 5, ...s.flexrow_aligncenter}}>
              <MIcons name={'local-mall'} size={100} color={'#fff'} />
              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                }}>
                <Text style={{...s.bold_label, color: 'white', fontSize: 20}}>
                  Product Balance Amount
                </Text>

                <Text
                  style={{
                    ...s.bold_label,
                    marginTop: 10,
                    fontSize: 20,
                    color: 'white',
                  }}>
                  {numberWithCommas(SumProducts(productData))} MMK
                </Text>
              </View>
              <TouchableOpacity
                underlayColor={'white'}
                style={{position: 'absolute', bottom: 5, right: 5}}>
                <Icons
                  name={'arrow-forward-circle-outline'}
                  size={50}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableHighlight>
      </View>
      <View style={{...s.flexrow_aligncenter_j_between, marginTop: 8}}>
        <Text style={{...s.bold_label}}>Report</Text>

        <TouchableOpacity style={{padding: 5}}>
          <Icons
            name={'arrow-forward-circle-outline'}
            size={25}
            color={'#000'}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Sales Chart</Text>
        <ScrollView
          style={{flexDirection: 'row'}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            underlayColor="white"
            onPress={() => getSalesChartFromServer(salesData, 't')}>
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
            onPress={() => getSalesChartFromServer(salesData, 'w')}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: C.blackbutton,
                margin: 5,
                borderRadius: 15,
              }}>
              <Text style={{color: 'white', padding: 10}}>Days View</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            underlayColor="white"
            onPress={() => getSalesChartFromServer(salesData, 'm')}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: C.blackbutton,
                margin: 5,
                borderRadius: 15,
              }}>
              <Text style={{color: 'white', padding: 10}}>Months View</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <LineChart
          data={{
            labels: salesChartLabel,
            datasets: [
              {
                data: salesChartData,
              },
            ],
          }}
          verticalLabelRotation={-90}
          width={C.windowWidth * 95} // from react-native
          height={300}
          yAxisSuffix=" k"
          withHorizontalLines
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: 'black',
            backgroundGradientFrom: '#4287f5',
            backgroundGradientTo: '#548bf7',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForVerticalLabels: {translateY: 15},
            style: {
              borderRadius: 0,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#548bf7',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        <Text style={{color: 'black', fontWeight: 'bold'}}>Sales Table</Text>

        <Table borderStyle={{borderWidth: 2, borderColor: '#000'}}>
          <Row
            data={['Date & Time', 'Amount']}
            style={[
              {
                backgroundColor: '#f1f8ff',
                height: 40,
              },
            ]}
            textStyle={{color: 'black', textAlign: 'center'}}
          />
          <Rows data={salesTable} textStyle={[{margin: 6, color: 'black'}]} />
        </Table>
        <View
          style={{...s.flexrow_aligncenter_j_between, margin: 10, padding: 5}}>
          <Text style={{...s.font_bold, color: 'black'}}>Total Amount</Text>
          <Text style={{...s.font_bold, color: 'black'}}>
            {numberWithCommas(tabletotalprice) + ' MMK'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const kFormatter = num => {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1)
    : Math.sign(num) * Math.abs(num);
};

export default HomeScreen;
