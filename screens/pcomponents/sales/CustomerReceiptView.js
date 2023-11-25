/* eslint-disable react-native/no-inline-styles */
import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import axios from 'axios';
import {baseUrl, numberWithCommas} from '../../../Database';
import {STYLE as s, COLOR as C, IMAGE as I} from '../../../Database';
import Icons from 'react-native-vector-icons/MaterialIcons';
import IIcons from 'react-native-vector-icons/Ionicons';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import VoucherDetails from './VocherView';
import CustomerVoucherView from './CustomerVoucherView';
import {getCustomerSales} from '../extra/CustomerDataProvider';
import {MessageModalNormal} from '../../MessageModal'
import Loading from '../../Loading'
/*
    This view is receipt voucher's view from the sales using
    first we need to get the data from the sales
    and then show the receipt numbers and the date

    if the user click the receipt number, it will show the receipt details
    and the user can edit the receipt details and print the receipt
    
*/

const CustomerReceiptView = ({route, navigation}) => {
  const {data} = route.params;

  const {t, i18n} = useTranslation();
  const {salesData, loading, getCustomerData} = getCustomerSales(data.id);
  const {salesData:allSalesData} = getCustomerSales('all');

  const [type, setType] = useState('all');
  const [time, setTime] = useState('today');
  const [startd, setStartd] = useState('');
  const [endd, setEndd] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState('');

  const [showVoucher, setShowVoucher] = useState(false);
  const [vocherData, setVoucherData] = useState([]);
  const [showSelected,setShowSelected] = useState(false);

  const [isSort, setIsSort] = useState(null);

  const computeRemaingAmount = useMemo(() => {
    if (salesData.length === 0) return 0;

    let total = 0;
    salesData.forEach(item => {
      total +=
        parseInt(item.grandtotal, 10) - parseInt(item.customer_payment, 10);
    });

    return total;
  }, [salesData]);

  /* Sales Data filter by search Text */

  const FilterSalesData = useMemo(() => {
    if (salesData.length === 0) return salesData.reverse();

    //sort by remaing amount 
    if (isSort) {
      return salesData.sort((a,b)=>
         parseInt(a.grandtotal,10) - parseInt(a.customer_payment,10) - parseInt(b.grandtotal,10) - parseInt(b.customer_payment,10)).filter(item=>{
          return item.voucherNumber.includes(searchText) || item.customerName.includes(searchText)
        }).reverse()

      }else{
        return salesData.sort((a,b)=>
         parseInt(b.grandtotal,10) - parseInt(b.customer_payment,10) - parseInt(a.grandtotal,10) - parseInt(a.customer_payment,10)).filter(item=>{
          return item.voucherNumber.includes(searchText) || item.customerName.includes(searchText)
        }).reverse()
      }
  }, [searchText, salesData, isSort]);

  //   console.log("Filter Sales Data", JSON.stringify(FilterSalesData[0]))

  const onDelete = (selectedSales)=>{
    axios.delete('/api/customer/',{
      params:{
      customerid:data.id,
      sales:selectedSales,
    }
    }).then(res=>{
      getCustomerData();
    }).catch(res=>{
    })
  }

  const RPItem = useCallback(({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setShowVoucher(true);
          setVoucherData(item);
        }}>
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            backgroundColor: C.white,
            margin: 5,
            borderRadius: 15,
            padding: 10,
            elevation: 1,
          }}>
          <View>
            <Text style={{...s.bold_label}}>
              {item.customerName == '' ? 'Unknown' : item.customerName}
            </Text>
            <Text style={{...s.normal_label}}>{item.voucherNumber}</Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              {t('Total_Amount')} : {numberWithCommas(item.grandtotal)} Ks
            </Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              {t('Customer_Payment')} :{' '}
              {numberWithCommas(item.customer_payment)} Ks
            </Text>
            <Text style={{...s.normal_label, fontWeight: 'bold', color: 'red'}}>
              {t('TRemaing')} :{' '}
              {numberWithCommas(
                parseInt(item.grandtotal, 10) -
                  parseInt(item.customer_payment, 10),
              )}{' '}
              Ks
            </Text>
          </View>
          <View style={{flexDirection:'column'}}>
            <Text style={{...s.normal_label}}>
              {new Date(item.date)
                .toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
                .toString()}
            </Text>
            <Text style={{...s.normal_label}}>
              {new Date(item.date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#f0f0f0'}}>
      <CustomerVoucherView
        open={showVoucher}
        onClose={() => setShowVoucher(false)}
        data={vocherData}
        setData={setVoucherData}
        navigation={navigation}
        reload={getCustomerData}
      />
      <SalesModal  show={showSelected} onClose={()=>setShowSelected(false)} data={allSalesData} customerid={data.id} reload={getCustomerData}/>
      <View
        style={{flexDirection: 'row', marginBottom: 5, alignItems: 'center'}}>
        <MIcons name="file-chart" size={25} color={'#000'} />
        <Text style={{...s.bold_label, marginLeft: 3}}>
          {data.name + "'s Vourcher Lists"}
        </Text>
        <Text style={{...s.bold_label, marginLeft: 'auto'}}>
          {numberWithCommas(computeRemaingAmount)} Ks
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            flex:1,
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
              flex: 1,
              fontWeight: '900',
            }}
            placeholder={'Search Receipt Number'}
            onChangeText={e => setSearchText(e)}
          />

          <Icons name={'search'} size={30} color={'#000'} />
        </View>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
         <TouchableOpacity
          style={{
            padding: 3,
            backgroundColor: isSort ? C.bluecolor : 'white',
            borderRadius: 5,
            marginLeft: 5,
          }}
          onPress={() => setIsSort(prev => !prev)}>
          <IIcons
            name="swap-vertical-outline"
            size={25}
            color={isSort ? '#fff' : '#000'}
          />
        </TouchableOpacity>
         <TouchableOpacity
         onPress={()=> setShowSelected(true)}
          style={{
            padding: 3,
            backgroundColor: C.bluecolor,
            borderRadius: 5,
            marginLeft: 5,
          }}>
          <IIcons
            name="add-circle-outline"
            size={25}
            color={'#fff'}
          />
        </TouchableOpacity>
        </View>
      </View>

      <View style={{flex: 1}}>
        {isLoading ? (
          <ActivityIndicator size="large" color={C.red} />
        ) : (
          <FlatList
            data={FilterSalesData}
            renderItem={RPItem}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                onRefresh={getCustomerData}
                refreshing={loading}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const SalesModal = ({show, onClose, data, setData, navigation, reload, customerid}) => {


  const {t, i18n} = useTranslation();
  const [salesData, setSalesData] = useState([]);
  const [type, setType] = useState('all');
  const [time, setTime] = useState('today');
  const [startd, setStartd] = useState('');
  const [endd, setEndd] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loading,setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [showVoucher, setShowVoucher] = useState(false);
  const [vocherData, setVoucherData] = useState([]);

  const [selectedItem,setSelectedItem] = useState([]);

  const onSelectItem  = (id)=>{

    //if id is include remove
    if(selectedItem.includes(id)){
      setSelectedItem(prev=>prev.filter(item=>item != id))
    }else{
    setSelectedItem(prev=>[...prev,id])

    }


  }



  useMemo(() => {
    console.log('Fetching Sales Data');
    setIsLoading(true);
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
        setSalesData(res.data.DATA);
        setIsLoading(false);
        // ComputeSalesData(res.data, time);
        console.log('Successfully Setted Data ');
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, [show]);

  /* Sales Data filter by search Text */

  const FilterSalesData = useMemo(() => {
    // Compare two data `salesData` and `data` with receiptNumber and intereset the result

    if (salesData.length === 0) return salesData;
  
    if(data.length === 0) return salesData;



    if(data) return salesData.filter(item => !data?.find(dataItem => dataItem.receiptNumber == item.receiptNumber));



  }, [salesData,data]);


  const onClickAddSelected = ()=>{
    if(selectedItem.length == 0) return Alert.alert("","Please Select Item!")

    setLoading(true);
    axios.put('/api/customer/',{
      customer_id:customerid,
      sales:selectedItem,
      
    }).then(res=>{
      setLoading(false);
      setSelectedItem([])
      reload();
      onClose();
    }).catch(err=>{
      setLoading(false);
      onClose();
    })
  }

  //   console.log("Filter Sales Data", JSON.stringify(FilterSalesData[0]))

  return (
    <>
    <MessageModalNormal show={show} onClose={onClose} width={'90%'}>
      <View style={{height:Dimensions.get('window').height -10}}>
      <View style={{flexDirection:'row'}}>
      <Text style={{...s.bold_label}}>Please Select Voucher</Text>
      <Text style={{...s.normal_label, marginLeft:'auto'}}>{selectedItem.length} Selected</Text>

      </View>
      <Text style={{...s.bold_label, color:'white', padding:4, backgroundColor:'black', borderRadius:15, alignItems:'center',textAlign:'center'}}>Recent Sales</Text>
        

        {isLoading ? (
          <ActivityIndicator size="large" color={C.red} />
        ) : (
        <>{FilterSalesData.length > 0 ?
          <FlatList
            data={FilterSalesData}
            renderItem={({item,index})=>
              <RPItem item={item} key={index} selectedItem={selectedItem} onSelectItem={onSelectItem}/>
            }
            keyExtractor={(item, index) => index.toString()}
          />
           :<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
           <Text style={{...s.bold_label, color:'black'}}>No Items To Select</Text>
         </View>}
          </>
        )}
        <View>
          
          <TouchableOpacity style={{...s.blue_button}} onPress={onClickAddSelected}>
          <Text style={{...s.bold_label, color:'white'}}>Add Selected</Text>
            
          </TouchableOpacity>

          <TouchableOpacity style={{...s.blue_button,backgroundColor:'red'}} onPress={onClose}>
          <Text style={{...s.bold_label, color:'white'}}>Close</Text>
            
          </TouchableOpacity>
        </View>
      </View>
    </MessageModalNormal>
    <Loading show={loading} />

    </>
  );
};



  const RPItem = ({item, onSelectItem, selectedItem}) => {
    return (
      <TouchableOpacity
        onPress={() => {
         onSelectItem(item.receiptNumber)
        }}>
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            backgroundColor: C.white,
            borderColor:selectedItem.includes(item.receiptNumber) ? C.bluecolor : C.white,
            borderWidth:3,
            margin: 5,
            borderRadius: 15,
            padding: 10,
            elevation: 2,
          }}>
          <View>
            <Text style={{...s.bold_label}}>
              {item.customerName == '' ? 'Unknown' : item.customerName}
            </Text>
            <Text style={{...s.normal_label}}>{item.voucherNumber}</Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              Total : {numberWithCommas(item.grandtotal)} Ks
            </Text>
          </View>
          <View style={{flexDirection :'column'}}>
            <Text style={{...s.normal_label}}>
              {new Date(item.date)
                .toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
                .toString()}
            </Text>
            <Text style={{...s.normal_label}}>
              {new Date(item.date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </Text>

           
          </View>
        </View>
      </TouchableOpacity>
    );
  }



export default CustomerReceiptView;
