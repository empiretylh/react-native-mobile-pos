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
import {IMAGE as I, STYLE as s, COLOR as C} from '../../Database';
import EncryptedStorage from 'react-native-encrypted-storage';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {numberWithCommas} from '../../Database';
import {BarChart, LineChart, StackedBarChart} from 'react-native-chart-kit';
import {Table, Row, Rows} from 'react-native-table-component';
import {MessageModalNormal} from '../MessageModal';
import {ShareOpenGraphValueContainer} from 'react-native-fbsdk';
import DatePicker from 'react-native-date-picker';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {useTranslation} from 'react-i18next';
import '../../assets/i18n/i18n';
const Tab = createMaterialTopTabNavigator();

let render_count = 0;

const ReportScreen = ({navigation}) => {
  const RemoveToken = () => {
    EncryptedStorage.removeItem('secure_token');
  };

  const {t, i18n} = useTranslation();
  useEffect(() => {
    Load();
  }, []);

  const [salesData, setSalesData] = useState(null);
  const [productData, setProductData] = useState([0]);
  const [expenseData, setExpenseData] = useState([0]);
  const [purchaseData, setPurchaseData] = useState([0]);
  const [otherIncome, setOtherincomeData] = useState([0]);

  const [refresh, setRefresh] = useState();
  const [load, setLoad] = useState(false);

  const Load = (
    type = '',
    time = 'today',
    startd = new Date(),
    endd = new Date(),
  ) => {
    setRefresh(true);

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

    getSalesFromServer(
      type,
      time,
      startd.toLocaleDateString(),
      endd.toLocaleDateString(),
    );
  };
  const getSalesFromServer = (type = '', time = 'today', startd, endd) => {
    console.log('Fetching Sales Data');
    setSaleTableData(null);
    setSalesData(null);
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
        console.log('Fetch Data from Sales Data');
        setloadtext(t('LoadSales'));
        setSaleChartLabel(res.data.CHART_LABEL);
        if (res.data.CHART_DATA.length >= 1)
          setSaleChartData(res.data.CHART_DATA);
        setSalesData(res.data.DATA);
        // ComputeSalesData(res.data, time);
        console.log('Successfully Setted Data ');
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
        setloadtext(t('LoadExpense'));
        setExpenseData(res.data.DATA);
        if (res.data.CHART_DATA.length >= 1)
          setexpenseChart(res.data.CHART_DATA);
        setexpenseLabel(res.data.CHART_LABEL);
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
        setloadtext(t('LoadPurchase'));
        setPurchaseData(res.data.DATA);
        if (res.data.CHART_DATA.length >= 1)
          setpurchaseChart(res.data.CHART_DATA);
        setpurchaseLabel(res.data.CHART_LABEL);

        // ComputeOtherIncomeData(res.data, time, 'purchase');
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
        setloadtext(t('LoadOtherIncome'));
        setOtherincomeData(res.data.DATA);
        if (res.data.CHART_DATA.length >= 1)
          setOtherIncomeChart(res.data.CHART_DATA);
        setOtherIncomeLabel(res.data.CHART_LABEL);
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
  const [salesTable, setSaleTableData] = useState([0]);
  const [salesChartData, setSaleChartData] = useState([0]);
  const [salesChartLabel, setSaleChartLabel] = useState([0]);
  const [tabletotalprice, setTabletotalprice] = useState(0);

  const [otherIncomeTable, setOtherIncomeTable] = useState([0]);
  const [otherincomemodal, setotherincomemodal] = useState(false);
  const [otherincomeChart, setOtherIncomeChart] = useState([0]);
  const [otherincomeLabel, setOtherIncomeLabel] = useState([0]);
  const [oitabletotal, setoitabletotal] = useState(0);
  const onCloseotherincome = () => setotherincomemodal(false);

  const [ExpenseTable, setExpenseTable] = useState([0]);
  const [expensemodal, setexpensemodal] = useState(false);
  const [expenseChart, setexpenseChart] = useState([0]);
  const [expenseLabel, setexpenseLabel] = useState([0]);
  const [extotal, setextotal] = useState(0);
  const onCloseExpense = () => setexpensemodal(false);

  const [PurchaseTable, setPurchaseTable] = useState([0]);
  const [purchasemodal, setpurchasemodal] = useState(false);
  const [purchaseChart, setpurchaseChart] = useState([0]);
  const [purchaseLabel, setpurchaseLabel] = useState([0]);
  const [putotal, setputotal] = useState(0);

  const OnClosePurchase = () => setpurchasemodal(false);

  const [cudmodal, setcudmodal] = useState(false);
  const OnClosenOpenCud = () => setcudmodal(!cudmodal);

  const [sdopen, setsdopen] = useState(false);
  const [sdate, setsdate] = useState(new Date());

  const [edopen, setedopen] = useState(false);
  const [edate, setedate] = useState(new Date());

  const [salesModal, setSalesModal] = useState(false);
  const [loadtext, setloadtext] = useState('Loading');
  const onCloseSales = () => setSalesModal(false);

  const SalesTable = () => {
    const widtharr = [150, 150, 150, 100, 80, 80, 100, 150, 150];
    if (salesData === null)
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );

    const headerStyle = {
      ...styles.cell,
      alignItems: 'center',
      justifyContent: 'center',
    };
    return (
      <ScrollView nestedScrollEnable={true} horizontal={true}>
        <View style={{flexDirection: 'column'}}>
          <View
            style={{
              flexDirection: 'row',
              borderColor: 'black',
              borderWidth: 0.5,
              backgroundColor: '#c8e1ff',
            }}>
            <View style={{...headerStyle, width: widtharr[0]}}>
              <Text style={{color: 'black'}}>{t('Receipt_Number')}</Text>
            </View>
            <View style={{...headerStyle, width: widtharr[1]}}>
              <Text style={{color: 'black'}}>{t('Customer_Name')}</Text>
            </View>
            <View style={{...headerStyle, width: widtharr[2]}}>
              <Text style={{color: 'black'}}>{t('Items')}</Text>
            </View>
            <View style={{...headerStyle, width: widtharr[3]}}>
              <Text style={{color: 'black'}}>{t('Sub_Total')}</Text>
            </View>
            <View
              style={{
                ...styles.cell,
                alignItems: 'center',
                justifyContent: 'center',
                width: widtharr[4],
              }}>
              <Text style={{color: 'black'}}>{t('Tax')}</Text>
            </View>

            <View style={{...headerStyle, width: widtharr[5]}}>
              <Text style={{color: 'black'}}>{t('Discount')}</Text>
            </View>
            <View
              style={{
                ...headerStyle,
                width: widtharr[6],
                backgroundColor: '#07ed72',
              }}>
              <Text style={{color: 'black'}}>{t('Grand_Total')}</Text>
            </View>
            <View style={{...headerStyle, width: widtharr[7]}}>
              <Text style={{color: 'black'}}>{t('Date')}</Text>
            </View>
            <View style={{...headerStyle, width: widtharr[8]}}>
              <Text style={{color: 'black'}}>{t('Description')}</Text>
            </View>
          </View>

          <ScrollView nestedScrollEnabled={true} style={{marginTop: -1}}>
            {salesData.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  borderColor: 'black',
                  borderWidth: 0.5,
                  backgroundColor: index % 2 == 1 ? '#F7F6E7' : '#E7E6E1',
                }}>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[0],
                  }}>
                  <Text style={{color: 'black', textAlign: 'left'}}>
                    {item.receiptNumber}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[1],
                  }}>
                  <Text style={{color: 'black'}}>{item.customerName}</Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[2],
                  }}>
                  <Text style={{color: 'black', textAlign: 'left'}}>
                    {item.sproduct.map(
                      (sp_item, index) =>
                        sp_item.product_name +
                        (index + 1 === item.sproduct.length ? '' : ', '),
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[3],
                  }}>
                  <Text style={{color: 'black', textAlign: 'right'}}>
                    {numberWithCommas(item.totalAmount) + ' Ks'}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[4],
                  }}>
                  <Text style={{color: 'black', textAlign: 'right'}}>
                    {numberWithCommas(item.tax) + ' Ks'}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[5],
                  }}>
                  <Text style={{color: 'black', textAlign: 'right'}}>
                    {item.discount + ' %'}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[6],
                    backgroundColor: index % 2 ? '#3ded07' : '#04d64e',
                  }}>
                  <Text style={{color: 'black', textAlign: 'right'}}>
                    {numberWithCommas(item.grandtotal) + ' Ks'}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[7],
                  }}>
                  <Text style={{color: 'black', textAlign: 'left'}}>
                    {new Date(item.date).toDateString()}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[8],
                  }}>
                  <Text style={{color: 'black'}}>{item.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  const AnalyseTable = cstr => {
    if (cstr === 'otherIncome') return ComputeTable(otherIncome);
    else if (cstr === 'expenseData') return ComputeTable(expenseData);
    else return ComputeTable(purchaseData);
  };

  const ComputeTable = (data = []) => {
    let widtharr = [50, 150, 100, 150, 200];
    if (salesData === null)
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: C.windowWidth * 98,
          }}>
          <Image
            source={I.spinnerloadgif}
            style={{width: 20, height: 20, padding: 50}}
          />
          <Text style={{...s.normal_label}}>Loading Data...</Text>
        </View>
      );
    return (
      <ScrollView nestedScrollEnable={true} horizontal={true}>
        <View style={{flexDirection: 'column'}}>
          <View
            style={{
              flexDirection: 'row',
              borderColor: 'black',
              borderWidth: 0.5,
              backgroundColor: '#c8e1ff',
            }}>
            <View
              style={{
                ...styles.cell,
                alignItems: 'center',
                justifyContent: 'center',
                width: widtharr[0],
              }}>
              <Text style={{color: 'black'}}>{t('No')}</Text>
            </View>
            <View
              style={{
                ...styles.cell,
                alignItems: 'center',
                justifyContent: 'center',
                width: widtharr[1],
              }}>
              <Text style={{color: 'black'}}>{t('Title')}</Text>
            </View>
            <View
              style={{
                ...styles.cell,
                alignItems: 'center',
                justifyContent: 'center',
                width: widtharr[2],
              }}>
              <Text style={{color: 'black'}}>{t('Price')}</Text>
            </View>
            <View
              style={{
                ...styles.cell,
                alignItems: 'center',
                justifyContent: 'center',
                width: widtharr[3],
              }}>
              <Text style={{color: 'black'}}>{t('Date')}</Text>
            </View>
            <View
              style={{
                ...styles.cell,
                alignItems: 'center',
                justifyContent: 'center',
                width: widtharr[4],
              }}>
              <Text style={{color: 'black'}}>{t('Description')}</Text>
            </View>
          </View>
          <ScrollView nestedScrollEnabled={true} style={{marginTop: -1}}>
            {data.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  borderColor: 'black',
                  borderWidth: 0.5,
                  backgroundColor: index % 2 == 1 ? '#F7F6E7' : '#E7E6E1',
                }}>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[0],
                  }}>
                  <Text style={{color: 'black', textAlign: 'center'}}>
                    {index + 1}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[1],
                  }}>
                  <Text style={{color: 'black'}}>{item.title}</Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[2],
                  }}>
                  <Text style={{color: 'black', textAlign: 'right'}}>
                    {numberWithCommas(item.price) + ' Ks'}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[3],
                  }}>
                  <Text style={{color: 'black'}}>
                    {new Date(item.date).toDateString()}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.cell,

                    justifyContent: 'center',
                    width: widtharr[4],
                  }}>
                  <Text style={{color: 'black'}}>{item.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  const TableView = () => {
    if (salesData && otherIncome && expenseData && purchaseData) {
      return (
        <ScrollView
          nestedScrollEnable={true}
          style={{backgroundColor: 'white'}}>
          {/* Sales */}
          <View style={{marginBottom: 5}}>
            <View style={{...s.flexrow_aligncenter_j_between, padding: 5}}>
              <Text style={{...s.font_bold, color: 'black'}}>{t('Sales')}</Text>
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
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Total_Amount')}
              </Text>
              <Text style={{...s.font_bold, color: 'black'}}>
                {numberWithCommas(SUM(salesChartData)) + ' MMK'}
              </Text>
            </View>
          </View>
          {/* OtherIncome */}
          <View style={{marginBottom: 5}}>
            <View style={{...s.flexrow_aligncenter_j_between, padding: 5}}>
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Other_Income')}
              </Text>
              <TouchableOpacity onPress={() => setotherincomemodal(true)}>
                <Icons name={'expand'} size={25} color={'#000'} />
              </TouchableOpacity>
            </View>
            <MessageModalNormal
              width="100%"
              show={otherincomemodal}
              onClose={onCloseotherincome}>
              <ScrollView horizontal={true}>
                {AnalyseTable('otherIncome')}
              </ScrollView>
            </MessageModalNormal>
            <ScrollView
              horizontal={true}
              nestedScrollEnabled={true}
              style={{maxHeight: C.windowHeight * 40}}>
              {AnalyseTable('otherIncome')}
            </ScrollView>

            <View style={styles.totalView}>
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Total_Amount')}
              </Text>
              <Text style={{...s.font_bold, color: 'black'}}>
                {numberWithCommas(SUM(otherincomeChart)) + ' MMK'}
              </Text>
            </View>
          </View>
          {/* Expense */}
          <View style={{marginBottom: 5}}>
            <View style={{...s.flexrow_aligncenter_j_between, padding: 5}}>
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Expense')}
              </Text>
              <TouchableOpacity onPress={() => setexpensemodal(true)}>
                <Icons name={'expand'} size={25} color={'#000'} />
              </TouchableOpacity>
            </View>
            <MessageModalNormal
              width="100%"
              show={expensemodal}
              onClose={onCloseExpense}>
              <ScrollView horizontal={true}>
                {AnalyseTable('expenseData')}
              </ScrollView>
            </MessageModalNormal>
            <ScrollView
              horizontal={true}
              nestedScrollEnabled={true}
              style={{maxHeight: C.windowHeight * 40}}>
              {AnalyseTable('expenseData')}
            </ScrollView>

            <View style={styles.totalView}>
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Total_Amount')}
              </Text>
              <Text style={{...s.font_bold, color: 'black'}}>
                {numberWithCommas(SUM(expenseChart)) + ' MMK'}
              </Text>
            </View>
          </View>
          {/* Purchase */}
          <View style={{marginBottom: 5}}>
            <View style={{...s.flexrow_aligncenter_j_between, padding: 5}}>
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Purchase')}
              </Text>
              <TouchableOpacity onPress={() => setpurchasemodal(true)}>
                <Icons name={'expand'} size={25} color={'#000'} />
              </TouchableOpacity>
            </View>
            <MessageModalNormal
              width="100%"
              show={purchasemodal}
              onClose={OnClosePurchase}>
              <ScrollView horizontal={true}>
                {AnalyseTable('purchaseData')}
              </ScrollView>
            </MessageModalNormal>
            <ScrollView
              horizontal={true}
              nestedScrollEnabled={true}
              style={{maxHeight: C.windowHeight * 40}}>
              {AnalyseTable('purchaseData')}
            </ScrollView>

            <View style={styles.totalView}>
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Total_Amount')}
              </Text>
              <Text style={{...s.font_bold, color: 'black'}}>
                {numberWithCommas(SUM(purchaseChart)) + ' MMK'}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={I.spinnerloadgif}
          style={{width: 20, height: 20, padding: 50}}
        />

        <Text style={{...s.normal_label}}>{loadtext}.</Text>
      </View>
    );
  };

  const SUM = array => {
    return array.reduce((a, b) => a + b, 0);
  };

  const ChartView = () => {
    if (salesData && otherIncome && expenseData && purchaseData) {
      return (
        <ScrollView
          nestedScrollEnable={true}
          style={{backgroundColor: 'white'}}>
          {/* Sales */}
          <View style={{marginBottom: 5}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{...s.font_bold, color: 'black'}}>{t('Sales')}</Text>
              <Text style={{...s.font_bold, color: 'black'}}>
                {' '}
                {numberWithCommas(SUM(salesChartData)) + ' MMK'}
              </Text>
            </View>

            <LineChart
              data={{
                labels: salesChartLabel,
                datasets: [
                  {
                    data: salesChartData,
                  },
                ],
              }}
              width={C.windowWidth * 95} // from react-native
              height={300}
              yAxisSuffix=" k"
              withHorizontalLines
              yAxisInterval={1} // optional, defaults to 1
              verticalLabelRotation={-90}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
          {/* OtherIncome */}
          <View style={{marginBottom: 5}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Other_Income')}
              </Text>
              <Text style={{...s.font_bold, color: 'black'}}>
                {' '}
                {numberWithCommas(SUM(otherincomeChart)) + ' MMK'}
              </Text>
            </View>

            <LineChart
              data={{
                labels: otherincomeLabel,
                datasets: [
                  {
                    data: otherincomeChart,
                  },
                ],
              }}
              width={C.windowWidth * 95} // from react-native
              height={300}
              yAxisSuffix=" k"
              withHorizontalLines
              yAxisInterval={1} // optional, defaults to 1
              verticalLabelRotation={-90}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
          {/* Expense */}
          <View style={{marginBottom: 5}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Expense')}
              </Text>
              <Text style={{...s.font_bold, color: 'black'}}>
                {' '}
                {numberWithCommas(SUM(expenseChart)) + ' MMK'}
              </Text>
            </View>

            <LineChart
              data={{
                labels: expenseLabel,
                datasets: [
                  {
                    data: expenseChart,
                  },
                ],
              }}
              width={C.windowWidth * 95} // from react-native
              height={300}
              yAxisSuffix=" k"
              withHorizontalLines
              yAxisInterval={1} // optional, defaults to 1
              verticalLabelRotation={-90}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
          {/* Purchase */}
          <View style={{marginBottom: 5}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{...s.font_bold, color: 'black'}}>
                {t('Purchase')}
              </Text>
              <Text style={{...s.font_bold, color: 'black'}}>
                {' '}
                {numberWithCommas(SUM(purchaseChart)) + ' MMK'}
              </Text>
            </View>

            <LineChart
              data={{
                labels: purchaseLabel,
                datasets: [
                  {
                    data: purchaseChart,
                  },
                ],
              }}
              width={C.windowWidth * 95} // from react-native
              height={300}
              yAxisSuffix=" k"
              withHorizontalLines
              yAxisInterval={1} // optional, defaults to 1
              verticalLabelRotation={-90}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </ScrollView>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={I.spinnerloadgif}
          style={{width: 20, height: 20, padding: 50}}
        />
        <Text style={{...s.normal_label}}>{loadtext}</Text>
      </View>
    );
  };

  const [profitdata, setprofitdata] = useState(null);

  const [PLRefresh, setPLRefresh] = useState(false);

  const FetchData = () => {
    setPLRefresh(true);
    // setprofitdata(null);

    axios
      .get('/api/profitnloss/')
      .then(res => {
        console.log(res.data);
        if (res.data.addData) {
          setprofitdata(res.data);
        }
        setPLRefresh(false);
      })
      .catch(err => console.log(err));
  };

  const ProfitnLossView = () => {
    let widthwidth = C.windowWidth * 95 - 50;

    let tablearr = [50, widthwidth / 3, widthwidth / 3, widthwidth / 3];
    let headerstyle = {
      borderColor: 'black',
      borderWidth: 1,

      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
    };

    const ComputeScreen = () => {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {PLRefresh ? (
            <View style={{alignItems: 'center'}}>
              <Image
                source={I.spinnerloadgif}
                style={{width: 30, height: 30}}
                resizeMode={'contain'}
              />
              <Text>{t('ComputingData')}</Text>
            </View>
          ) : null}
          <TouchableOpacity onPress={() => FetchData()}>
            <View
              style={{
                padding: 15,
                backgroundColor: C.blackbutton,
                borderRadius: 15,
              }}>
              <Text style={{...s.font_bold, color: 'white'}}>
                {t('ComputeProfit')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    if (profitdata) {
      if (Object.entries(profitdata.addData).length >= 0) {
        return (
          <ScrollView
            style={{backgroundColor: 'white', flex: 1}}
            refreshControl={
              <RefreshControl onRefresh={FetchData} refreshing={PLRefresh} />
            }>
            <Text style={{...s.bold_label}}>2022</Text>
            <LineChart
              data={{
                labels: Object.keys(profitdata.addData),
                datasets: [
                  {
                    data: Object.values(profitdata.addData),
                    color: (opacity = 1) => `rgba(13, 209, 6, ${opacity})`,
                  },
                  {
                    data: Object.values(profitdata.minusData),
                    color: (opacity = 1) => `rgba(209, 6, 33, ${opacity})`,
                  },
                ],
              }}
              width={C.windowWidth * 95} // from react-native
              height={300}
              yAxisSuffix=" k"
              withHorizontalLines
              yAxisInterval={1} // optional, defaults to 1
              verticalLabelRotation={-90}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            <View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{...headerstyle, width: tablearr[0]}}>
                  <Text style={{color: 'black', textAlign: 'center'}}>
                    {t('Time')}
                  </Text>
                </View>
                <View style={{...headerstyle, width: tablearr[1]}}>
                  <Text style={{color: 'black', textAlign: 'center'}}>
                    {t('Income')}
                  </Text>
                </View>
                <View style={{...headerstyle, width: tablearr[2]}}>
                  <Text style={{color: 'black', textAlign: 'center'}}>
                    {t('Expense&Purchase')}
                  </Text>
                </View>
                <View style={{...headerstyle, width: tablearr[3]}}>
                  <Text style={{color: 'black', textAlign: 'center'}}>
                    {t('Profit&Loss')}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', width: tablearr[0]}}>
                  {Object.keys(profitdata.result).map((data, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 5,
                        borderColor: 'black',
                        borderWidth: 1,
                      }}>
                      <Text
                        style={{color: 'black', textAlign: 'center'}}
                        key={index}>
                        {data.substring(0, 3)}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={{flexDirection: 'column', width: tablearr[1]}}>
                  {Object.values(profitdata.addData).map((data, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 5,
                        borderColor: 'black',
                        borderWidth: 1,
                      }}>
                      <Text
                        style={{color: 'black', textAlign: 'right'}}
                        key={index}>
                        {numberWithCommas(data) + ' Ks'}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={{flexDirection: 'column', width: tablearr[2]}}>
                  {Object.values(profitdata.minusData).map((data, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 5,
                        borderColor: 'black',
                        borderWidth: 1,
                      }}>
                      <Text
                        style={{color: 'black', textAlign: 'right'}}
                        key={index}>
                        {numberWithCommas(data) + ' Ks'}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={{flexDirection: 'column', width: tablearr[3]}}>
                  {Object.values(profitdata.result).map((data, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 5,
                        borderColor: 'black',
                        borderWidth: 1,
                      }}>
                      <Text
                        style={{
                          color: data <= 0 ? 'red' : 'green',
                          textAlign: 'right',
                        }}
                        key={index}>
                        {numberWithCommas(data) + ' Ks'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        );
      } else {
       
        return ComputeScreen();
      }
    } else {
      // console.log(profitdata.addData.length,'What  The');
      
      return ComputeScreen();
    }
    // return ComputeScreen();
  };

  render_count = render_count + 1;
  console.log('Report render count ' + render_count);
  return (
    // {/* appbar */}
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flexDirection: 'column'}}>
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            padding: 8,
          }}>
          <Text style={{...s.bold_label, fontSize: 23}}>{t('Report')}</Text>
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
              <Text style={{color: 'white', padding: 10}}>{t('Today')}</Text>
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
              <Text style={{color: 'white', padding: 10}}>
                {t('This_Month')}
              </Text>
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
              <Text style={{color: 'white', padding: 10}}>
                {t('This_Year')}
              </Text>
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
              <Text style={{color: 'white', padding: 10}}>
                {t('Custom_Date')}
              </Text>
            </View>
          </TouchableOpacity>

          <MessageModalNormal show={cudmodal} onClose={OnClosenOpenCud}>
            <Text style={{...s.bold_label, marginTop: 8}}>
              {t('Start_Date')}
            </Text>

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
            <Text style={{...s.bold_label, marginTop: 8}}>{t('End_Date')}</Text>

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
                {t('Apply')}
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
                backgroundColor: 'white',
                shadowOffset: {width: 0, height: 0},
                elevation: 0,
              },
            }}>
            <Tab.Screen name={t('Table')} component={TableView} />
            <Tab.Screen name={t('Chart')} component={ChartView} />
            <Tab.Screen name={t('Profit&Loss')} component={ProfitnLossView} />
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
  cell: {
    borderColor: 'black',
    borderWidth: 0.5,
    padding: 10,
    backgroundColor: 'transparent',
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

const chartConfig = {
  // backgroundColor: 'black',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 0.8) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0,0, 0, ${opacity})`,
  propsForVerticalLabels: {translateY: 32},
  style: {
    borderRadius: 0,
  },
  // propsForDots: {
  //   r: '6',
  //   strokeWidth: '2',
  //   stroke: '#548bf7',
  // },
};
