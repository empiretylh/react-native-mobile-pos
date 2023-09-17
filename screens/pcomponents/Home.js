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
  TurboModuleRegistry,
  Modal,
  TextInput,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {
  IMAGE,
  STYLE as s,
  COLOR as C,
  isArrayhasData,
  UnitId,
} from '../../Database';
import EncryptedStorage from 'react-native-encrypted-storage';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import Icons2 from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {numberWithCommas} from '../../Database';
import {LineChart, PieChart} from 'react-native-chart-kit';
import {Table, Row, Rows} from 'react-native-table-component';
import {useTranslation} from 'react-i18next';
import '../../assets/i18n/i18n';
import {MessageModalNormal} from '../MessageModal';

import {
  BannerAd,
  BannerAdSize,
  TestIds,
  GAMBannerAd,
} from 'react-native-google-mobile-ads';
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
let settings = {};
const HomeScreen = ({navigation, route}) => {
  const {token} = route.params;
  const RemoveToken = () => {
    EncryptedStorage.removeItem('secure_token');
    // Container.InfoToken.setUserToken(null);

    token(null);
  };

  useEffect(() => {
    //  get Setting & Load Data
    getSettings();
  }, []);
  const getSettings = () => {
    // Set language from i18n
    // setSettings({...settings, ['language']: i18n.language});

    EncryptedStorage.getItem('setting_data')
      .then(res => {
        console.log('get Settings', res);
        if (res !== null) {
          settings = JSON.parse(res);
        } else {
          settings = {datascope: 'year', language: 'en'};
        }
        Load();
      })
      .catch(err => console.log(err));
  };

  const {t, i18n} = useTranslation();

  const [Sales_Data, setSales_Data] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [otherIncome, setOtherincomeData] = useState([]);
  const [pdata, setPddata] = useState(null);

  const [refresh, setRefresh] = useState();

  const [topProduct, setTopProduct] = useState(null);

  const Load = () => {
    setRefresh(true);

    getSalesFromServer();

    getProductFromServer();

    getExpenseFromServer();

    getPurchaseFromServer();

    getOtherIncomeFromServer();

    LoadProfile();

    getTopProduct();

    getSalesChartFServer();
  };

  const getTopProduct = (time = 'year') => {
    axios
      .get('/api/toproduct/', {
        params: {
          time: settings.datascope,
        },
      })
      .then(res => {
        console.log('Fetch Data from Sales Data');
        console.log(res.data);
        let T_Freq = [];
        for (var [k, v] of Object.entries(res.data.T_Freq)) {
          console.log(k, v);
          T_Freq.push({
            name: k,
            freq: v,
            price: res.data.T_Money[k],
            color: getRandomColor(),
            legendFontColor: 'black',
            legendFontSize: 15,
          });
        }
        setTopProduct(T_Freq);
      })
      .catch(err => console.log(err));
  };

  const LoadProfile = () => {
    axios
      .get('/api/profile/')
      .then(res => {
        console.log(res.data);
        setPddata(res.data);
        ComputeWarningDate(res.data);
      })
      .catch(err => {
        if (err.response.status == 401) {
          RemoveToken();
        }
      });
  };

  const getSalesFromServer = (type = 'DT', time = 'year', startd, endd) => {
    axios
      .get('/api/sales/', {
        params: {
          type: 'DT',
          time: settings.datascope,
        },
      })
      .then(res => {
        setSales_Data(res.data.DATA);

        // setTimeout(() => {
        //   getSalesChartFromServer(res.data.DATA, 't');
        // }, 1000);
      })
      .catch(err => console.log(err));
  };

  const getSalesChartFServer = (type = 'DT', time = 'year', startd, endd) => {
    axios
      .get('/api/sales/', {
        params: {
          type: 'DT',
          time: 'year',
        },
      })
      .then(res => {
        setSalesData(res.data.DATA);

        setTimeout(() => {
          getSalesChartFromServer(res.data.DATA, 't');
        }, 1000);
      })
      .catch(err => console.log(err));
  };

  const getProductFromServer = () => {
    axios
      .get('/api/products/')
      .then(res => {
        setProductData(res.data);
        if (showLS === true) {
          LessStockProducts();
        } else {
          StockOutProducts();
        }
      })
      .catch(err => console.log(err));
  };

  const getExpenseFromServer = () => {
    axios
      .get('/api/expenses/', {params: {time: settings.datascope}})
      .then(res => setExpenseData(res.data.DATA))
      .catch(err => console.log(err));
  };

  const getPurchaseFromServer = () => {
    axios
      .get('/api/purchases/', {params: {time: settings.datascope}})
      .then(res => setPurchaseData(res.data.DATA))
      .catch(err => console.log(err));
  };

  const getOtherIncomeFromServer = () => {
    axios
      .get('/api/otherincome/', {params: {time: settings.datascope}})
      .then(res => {
        setOtherincomeData(res.data.DATA);
        setRefresh(false);
      })
      .catch(err => console.log(err));
  };

  const SumSales = (data = []) => {
    let price = 0;

    data.forEach(e => {
      var g_price = parseInt(e.grandtotal);
      price += g_price;
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

  const PutProductsToServer = (pd, pic, id) => {
    const d = new FormData();
    d.append('id', id);
    d.append('name', pd.name);
    d.append('price', pd.price);
    d.append('qty', pd.qty);

    d.append('category', pd.category);
    d.append('description', pd.description);
    d.append('pic', pic);

    console.log(d);

    axios
      .put('/api/products/', d, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        getProductFromServer();
      })
      .catch(err => a.spe());
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

  const [SOData, setSOData] = useState();
  const [LSData, setLSData] = useState();
  const StockOutProducts = () => {
    console.log('COmputing Stock OUt Prodcuts');
    const pddata = productData.filter(item => item.qty <= 0);
    setSOData(pddata);
    // return pddata.length;
  };
  const LessStockProducts = () => {
    setSOData(null);
    console.log('Computing LessThan Products');
    const pddata = productData.filter(item => item.qty <= 10);
    setSOData(pddata);
    // return pddata.length;
  };

  const [showSO, setShowSO] = useState(false);
  const [showLS, setshowLS] = useState(false);
  const [editpd, setEditPD] = useState();

  const PDITEM = ({item}) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#f0f0f0',
          padding: 10,
          margin: 5,
          flexDirection: 'row',
          borderRadius: 15,
        }}>
        <Image
          source={{
            uri:
              item.pic === '/media/null'
                ? 'https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png'
                : axios.defaults.baseURL + item.pic,
          }}
          style={{width: 100, height: 100}}
        />
        <View style={{marginLeft: 10}}>
          <Text style={{...s.bold_label, fontSize: 18}}>{item.name}</Text>
          <Text style={{...s.bold_label, fontSize: 15, marginTop: 5}}>
            {numberWithCommas(item.price)} MMK
          </Text>
        </View>
        <View style={{position: 'absolute', right: 5, top: 8}}>
          <TouchableOpacity
            onPress={() => {
              setCmodal(true);
              setEditPD(item);
            }}>
            <Icons name={'create-outline'} size={30} color={'#000'} />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            ...s.normal_label,
            backgroundColor: 'red',
            color: 'white',
            padding: 5,
            borderBottomRightRadius: 15,
            borderTopLeftRadius: 15,
            fontWeight: 'bold',
          }}>
          {item.qty}
        </Text>
      </View>
    );
  };

  const onCloseSO = () => {
    setShowSO(!showSO);
    setshowLS(!showLS);
  };

  const [cmodal, setCmodal] = useState(false);
  const onClosecmodal = () => setCmodal(!cmodal);

  const EditQty = () => {
    const onHandleEPdtData = (e, name) => {
      const temp = {...editpd, [name]: e};
      setEditPD(temp);
      console.log(temp);
    };

    if (editpd) {
      return (
        <MessageModalNormal show={cmodal} onClose={onClosecmodal}>
          <View>
            <Text style={{color: 'black'}}>{editpd.name}</Text>
            <View
              style={{
                ...s.flexrow_aligncenter_j_between,
                borderRadius: 15,
                height: 45,
                borderColor: 'black',
                borderWidth: 1.5,
                paddingRight: 10,
              }}>
              <TextInput
                style={{
                  padding: 10,
                  fontSize: 16,
                  fontWeight: '900',
                  flex: 1,
                }}
                defaultValue={editpd.qty + ''}
                placeholder={t('Qty')}
                autoFocus={true}
                onChangeText={e => onHandleEPdtData(e, 'qty')}
                keyboardType={'number-pad'}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                console.log(editpd);
                onClosecmodal();
                PutProductsToServer(editpd, null, editpd.id);
                onCloseSO();
              }}>
              <View
                style={{
                  ...s.flexrow_aligncenter_j_center,
                  padding: 10,
                  ...s.blue_button,
                }}>
                <Text style={{...s.font_bold, color: 'white', padding: 10}}>
                  {t('Add_Quantity')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </MessageModalNormal>
      );
    }
  };

  let widthwidth = C.windowWidth * 95 - 50;

  let tablearr = [50, widthwidth / 2, widthwidth / 2, widthwidth / 3];

  const headerstyle = {
    ...styles.cell,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <ScrollView
      nestedScrollEnabled
      style={s.Container}
      refreshControl={<RefreshControl onRefresh={Load} refreshing={refresh} />}>
      {/* appbar */}

      <MessageModalNormal show={showSO} onClose={onCloseSO} width={'100%'}>
        <View style={{alignItems: 'center'}}>
          <Text style={{...s.font_bold, color: 'black', padding: 5}}>
            {showLS ? 'Less Than 10 Qty Product' : 'Stock Out Products'}
          </Text>
        </View>
        <FlatList
          data={SOData}
          renderItem={PDITEM}
          keyExtractor={i => i.id}
          style={{backgroundColor: 'white'}}
        />
      </MessageModalNormal>
      {EditQty()}
      <View
        style={{
          ...s.flexrow_aligncenter_j_between,
          padding: 8,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={IMAGE.app_logo}
            style={{width: 30, height: 30}}
            resizeMode={'contain'}
          />
          <Text style={{...s.bold_label, fontSize: 23, marginLeft: 5}}>
            Dashboard
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate({name: 'profile', params: route.params})
          }>
          {pdata === null ? (
            <Image
              source={IMAGE.profile}
              style={{width: 40, height: 40, borderRadius: 30}}
            />
          ) : (
            <Image
              source={
                pdata.profileimage
                  ? {
                      uri: axios.defaults.baseURL + pdata.profileimage,
                    }
                  : IMAGE.profile
              }
              style={{width: 40, height: 40, borderRadius: 30}}
            />
          )}
        </TouchableOpacity>
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
                  {t('Sales')}
                </Text>

                <Text
                  style={{
                    ...s.bold_label,
                    marginTop: 10,
                    fontSize: 20,
                    color: 'white',
                  }}>
                  {numberWithCommas(SumSales(Sales_Data))} MMK
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
                  {t('Expense')}
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
                  {t('Purchase')}
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
                  {t('pd_balance_amount')}
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
      <BannerAd
        unitId={UnitId.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      <View style={{...s.flexrow_aligncenter_j_between, marginTop: 8}}>
        <Text style={{...s.bold_label}}>{t('Report')}</Text>

        <TouchableOpacity style={{padding: 5}}>
          <Icons
            name={'arrow-forward-circle-outline'}
            size={25}
            color={'#000'}
          />
        </TouchableOpacity>
      </View>
      <View>
        {productData ? (
          <View style={{flexDirection: 'column'}}>
            {productData.filter(item => item.qty <= 0).length <= 0 ? null : (
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: '#fa1455',
                  borderRadius: 15,
                  ...s.flexrow_aligncenter,
                }}
                onPress={() => {
                  setShowSO(true);
                  StockOutProducts();
                }}>
                <Icons2
                  name={'package-variant-closed'}
                  size={25}
                  color={'white'}
                />
                <Text style={{...s.bold_label, color: 'white'}}>
                  {productData.filter(item => item.qty <= 0).length} {t('POOS')}
                </Text>
              </TouchableOpacity>
            )}
            {productData.filter(item => item.qty <= 10).length <= 0 ? null : (
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: '#f57a07',
                  borderRadius: 15,
                  ...s.flexrow_aligncenter,
                  marginTop: 5,
                }}
                onPress={() => {
                  setShowSO(true);
                  setshowLS(true);
                  LessStockProducts();
                }}>
                <Icons2
                  name={'package-variant-closed'}
                  size={25}
                  color={'white'}
                />
                <Text style={{...s.bold_label, color: 'white'}}>
                  {productData.filter(item => item.qty <= 10).length}{' '}
                  {t('PL10Q')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {isArrayhasData(topProduct) ? (
          <>
            <View style={{marginTop: 8}}>
              <Text style={{...s.font_bold, color: 'black'}}>{t('TFSP')}</Text>
              {topProduct ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <PieChart
                    data={
                      topProduct.length >= 4
                        ? topProduct.slice(0, 4)
                        : topProduct
                    }
                    width={C.windowWidth * 120}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={'freq'}
                    backgroundColor="transparent"
                    center={[10, 0]}
                  />
                </ScrollView>
              ) : null}
            </View>
            <BannerAd
              unitId={UnitId.banner}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
            <View style={{marginTop: 8}}>
              <Text style={{...s.font_bold, color: 'black'}}>{t('TMP')}</Text>
              {topProduct ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  style={{height: 200}}>
                  <View style={{flexDirection: 'column'}}>
                    <View
                      style={{
                        height: 40,
                        flexDirection: 'row',
                        backgroundColor: 'red',
                      }}>
                      <View style={{...headerstyle, width: tablearr[0]}}>
                        <Text style={{color: 'white', textAlign: 'center'}}>
                          {t('No')}
                        </Text>
                      </View>
                      <View style={{...headerstyle, width: tablearr[1]}}>
                        <Text style={{color: 'white', textAlign: 'center'}}>
                          {t('ProductName')}
                        </Text>
                      </View>
                      <View style={{...headerstyle, width: tablearr[2]}}>
                        <Text style={{color: 'white', textAlign: 'center'}}>
                          {t('Price2')}
                        </Text>
                      </View>
                    </View>

                    <ScrollView nestedScrollEnabled={true}>
                      {topProduct
                        .sort(
                          (i1, i2) =>
                            parseInt(i2.price, 10) - parseInt(i1.price, 10),
                        )
                        .map((item, index) => (
                          <View>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                              <View
                                style={{...styles.cell, width: tablearr[0]}}>
                                <Text
                                  style={{color: 'black', textAlign: 'center'}}>
                                  {index + 1}
                                </Text>
                              </View>
                              <View
                                style={{...styles.cell, width: tablearr[1]}}>
                                <Text
                                  style={{color: 'black', textAlign: 'center'}}>
                                  {item.name}
                                </Text>
                              </View>
                              <View
                                style={{...styles.cell, width: tablearr[2]}}>
                                <Text
                                  style={{color: 'black', textAlign: 'right'}}>
                                  {numberWithCommas(item.price) + ' MMK'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        ))}
                    </ScrollView>
                  </View>
                </ScrollView>
              ) : null}
            </View>
          </>
        ) : null}
        <BannerAd
          unitId={UnitId.banner}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
        <Text style={{color: 'black', fontWeight: 'bold'}}>
          {t('Sales_Chart')}
        </Text>
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
              <Text style={{color: 'white', padding: 10}}>{t('Today')}</Text>
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
              <Text style={{color: 'white', padding: 10}}>
                {t('Days_View')}
              </Text>
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
              <Text style={{color: 'white', padding: 10}}>
                {t('Months_View')}
              </Text>
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
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        <Text style={{color: 'black', fontWeight: 'bold'}}>
          {t('Sales_Table')}
        </Text>

        <Table borderStyle={{borderWidth: 2, borderColor: '#000'}}>
          <Row
            data={[t('Date&Time'), t('Amount')]}
            style={{
              backgroundColor: '#f1f8ff',
              height: 40,
            }}
            textStyle={[{color: 'black', textAlign: 'center'}]}
          />
          <Rows data={salesTable} textStyle={{margin: 6, color: 'black'}} />
        </Table>
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            margin: 10,
            padding: 5,
          }}>
          <Text style={{...s.font_bold, color: 'black'}}>
            {t('Total_Amount')}
          </Text>
          <Text style={{...s.font_bold, color: 'black'}}>
            {numberWithCommas(tabletotalprice) + ' MMK'}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <BannerAd
            unitId={UnitId.banner}
            size={BannerAdSize.MEDIUM_RECTANGLE}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
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

const styles = StyleSheet.create({
  cell: {
    borderColor: 'black',
    borderWidth: 0.5,
    padding: 10,
    backgroundColor: 'transparent',
  },
});

const chartConfig = {
  backgroundColor: '#fff',
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
};

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
