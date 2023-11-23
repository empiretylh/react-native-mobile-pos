/* eslint-disable react-native/no-inline-styles */
import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import axios from 'axios';
import {baseUrl, numberWithCommas} from '../../../Database';
import {STYLE as s, COLOR as C, IMAGE as I} from '../../../Database';
import Icons from 'react-native-vector-icons/MaterialIcons';
import IIcons from 'react-native-vector-icons/Ionicons';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {useCustomer} from '../extra/CustomerDataProvider';
import {useSupplier} from '../extra/SupplierDataProvider';
import {RefreshControl} from 'react-native-gesture-handler';
import AddNewSupplier from './AddNewSupplier';
/*
    This view is receipt voucher's view from the sales using
    first we need to get the data from the sales
    and then show the receipt numbers and the date

    if the user click the receipt number, it will show the receipt details
    and the user can edit the receipt details and print the receipt
    
*/

const SupplierView = ({route, navigation}) => {
  const {t, i18n} = useTranslation();
  const [type, setType] = useState('all');
  const [time, setTime] = useState('today');
  const [startd, setStartd] = useState('');
  const [endd, setEndd] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState('');

  const [showVoucher, setShowVoucher] = useState(false);
  const [vocherData, setVoucherData] = useState([]);
  const [showCustomer, setShowCustomer] = useState(false);

  const {supplierData, loading, getSupplierData} = useSupplier();
  

  const [isSort, setIsSort] = useState(null);



  useMemo(() => {
    console.log('Fetching Sales Data');
    getSupplierData();
  }, []);

  /* Sales Data filter by search Text */

  const FilterCustomerData = useMemo(() => {
    if (supplierData.length === 0) return supplierData;
    //Sort by sales length

    return supplierData.filter(item=> item.name.includes(searchText));
  
  }, [searchText, supplierData, isSort]);

  //   console.log("Filter Sales Data", JSON.stringify(FilterSalesData[0]))

  const onCustomerAdd = ({supplierName, description}) => {
    setIsLoading(true);
    axios
      .post('/api/supplier/', {supplierName, description})
      .then(res => {
        setIsLoading(false);
        getSupplierData();
      })
      .catch(err => {
        setIsLoading(false);
      });
  };


   const onDelete = (id)=>{
    setIsLoading(true)
    axios.delete('/api/supplier/',{
      params:{
      supplier_id:id,
    }
    }).then(res=>{
      getSupplierData()
      setIsLoading(false);
    }).catch(res=>{
      setIsLoading(false)
    })
  }

  const RPItem = useCallback(({item}) => {
    const computesales = () => {
      let total = 0;
      item.products.forEach((item)=>{
        console.log(item.suppiler_payment)
        let total_payment =  parseInt(item.cost) * parseInt(item.qty)
        console.log(total_payment)
        total +=  parseInt(total_payment) - parseInt(item.supplier_payment);

      })

      console.log(total)

      return total;
    };

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('supplierproducts', {data: item});
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
              {item.name == '' ? 'Unknown' : item.name}
            </Text>
            <Text style={{...s.normal_label}}>
              {item.description}
            </Text>
            
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              {t('SRemaing')} : {computesales()} Ks
            </Text>
          </View>
          <View>
           <Text style={{...s.normal_label}}>
              {item.products.length} Products
            </Text>
             <TouchableOpacity 
                      onPress={()=>{
                        Alert.alert("","Are you sure want to delete the supplier?",[ {text:"No"},{text:"Yes", onPress:()=>{onDelete(item.id)} },])
                      }}
                      style={{backgroundColor:'#f5425a', padding:5, alignItems:'center', justifyContent:'center', borderRadius:15}}>
                        <IIcons name='trash' size={20} color={'#fff'}/>
                      </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#f0f0f0'}}>
     <AddNewSupplier show={showCustomer} onClose={()=> setShowCustomer(false)} onAdd={onCustomerAdd}/>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 5,
          alginItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MIcons name="package-down" size={25} color={'#000'} />
          <Text style={{...s.bold_label, marginLeft: 4}}>Supplier</Text>
        </View>
        <TouchableOpacity
          style={{...s.blue_button}}
          onPress={() => setShowCustomer(true)}>
          <Text style={{...s.bold_label, color: 'white'}}>
            + Add New Supplier
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            flex: 1,
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
            placeholder={'Search Supplier'}
            onChangeText={e => setSearchText(e)}
          />

          <Icons name={'search'} size={30} color={'#000'} />
        </View>
        <TouchableOpacity
          style={{
            padding: 3,
            backgroundColor: isSort ? C.bluecolor : C.white,
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
      </View>
      <View style={{flex: 1}}>
        {isLoading ? (
          <ActivityIndicator size="large" color={C.red} />
        ) : (
          <FlatList
            data={FilterCustomerData}
            renderItem={RPItem}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                onRefresh={getSupplierData}
                refreshing={loading}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

export default SupplierView;
