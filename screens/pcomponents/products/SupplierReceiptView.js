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
  Image,
} from 'react-native';
import axios from 'axios';
import {baseUrl, numberWithCommas} from '../../../Database';
import {STYLE as s, COLOR as C, IMAGE as I} from '../../../Database';
import Icons from 'react-native-vector-icons/MaterialIcons';
import IIcons from 'react-native-vector-icons/Ionicons';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {getCustomerSales} from '../extra/CustomerDataProvider';
import {getSupplierProducts} from '../extra/SupplierDataProvider';
import {MessageModalNormal} from '../../MessageModal'
import LoadingModal from '../../Loading';
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
  const {productsData, loading, getSupplierData} = getSupplierProducts(data.id);
  const {productsData:allProductData} = getSupplierProducts('all');

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
    if (productsData.length === 0) return 0;

    let total = 0;
    productsData.forEach(item => {
      let remaing = parseInt(item.cost) * parseInt(item.qty)

      total +=  remaing - parseInt(item.supplier_payment)
    });

    return total;
  }, [productsData]);

  /* Sales Data filter by search Text */

  const FilterSalesData = useMemo(() => {
    if (productsData.length === 0) return productsData.reverse();

    if(searchText == '') return productsData;
    return productsData.filter(item=> searchText.includes(item.name))

    return productsData;
  }, [searchText, productsData, isSort]);

  //   console.log("Filter Sales Data", JSON.stringify(FilterSalesData[0]))

  const onDelete = (selectedSales)=>{
    axios.delete('/api/supplier/',{
      params:{
      supplier_id:data.id,
      products:selectedSales,
    }
    }).then(res=>{
      getSupplierData();
    }).catch(res=>{
    })
  }

  const [showPayModal, setShowPayModal] = useState(false);
  const [showPayData,setShowPayData] = useState([]);


  const RPItem = useCallback(({item}) => {

    const remaingamount = ()=>{
      let re =   parseInt(item.cost) * parseInt(item.qty);
    return re -  parseInt(item.supplier_payment)
    }

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
                  item.pic === '/media/null' || item.pic === null
                    ? 'https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png'
                    : axios.defaults.baseURL + item.pic,
              }}
              style={{width: 100, height: 100}}
            />
            <View style={{marginLeft: 10}}>
              <Text style={{...s.bold_label, fontSize: 18}}>{item.name}</Text>
         

              <Text style={{...s.bold_label, fontSize: 15, marginTop: 5}}>
               {t('Payyan')} : {numberWithCommas(parseInt(item.cost) * parseInt(item.qty))} Ks
              </Text>
          
               <Text  style={{...s.bold_label, fontSize: 15, marginTop: 5 , color:'red'}}>{t('SRemaing') +' : '+ numberWithCommas(remaingamount())} Ks</Text>
            
            <View style={{flexDirection:'row', alignItems:'center'}}>

            <TouchableOpacity style={{...s.blue_button}} onPress={()=>{
              setShowPayModal(true);
              setShowPayData(item);
            }}>
              <Text style={{...s.normal_label, color:'white'}}>Set Payment</Text>
            </TouchableOpacity>
             {remaingamount() == 0 ?  <TouchableOpacity 
                      onPress={()=>{
                        Alert.alert("","Are you sure want to remove?",[ {text:"No"},{text:"Yes", onPress:()=>{onDelete(item.id)} },])
                      }}
                      style={{backgroundColor:'red', padding:8, alignItems:'center', justifyContent:'center', borderRadius:2}}>
                        <IIcons name='trash' size={19} color={'#fff'}/>
                      </TouchableOpacity>:null}
            </View>
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
  }, []);



  return (
    <View style={{flex: 1, padding: 10, backgroundColor: 'white'}}>
     
      <ProductsModal  show={showSelected} onClose={()=>setShowSelected(false)} data={allProductData} supplierid={data.id} reload={getSupplierData}/>
      <PaymentModal
        show={showPayModal}
        onClose={() => {
          setShowPayModal(false);
          getSupplierData();
         
        }}
        data={showPayData}
      
      />

      <View
        style={{flexDirection: 'row', marginBottom: 5, alignItems: 'center'}}>
        <MIcons name="file-chart" size={25} color={'#000'} />
        <Text style={{...s.bold_label, marginLeft: 3}}>
          {data.name + "'s Products"}
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
            placeholder={'Search Products'}
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

const ProductsModal = ({show, onClose, data, setData, navigation, reload, supplierid}) => {


  const {t, i18n} = useTranslation();
  const [productsData, setProductData] = useState([]);
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
    setIsLoading(true);
    axios
      .get('/api/products/')
      .then(res => {
        setProductData(res.data);
        setIsLoading(false);
        // ComputeSalesData(res.data, time);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, [show]);

  /* Sales Data filter by search Text */

  const FilterSalesData = useMemo(() => {
    // Compare two data `productsData` and `data` with receiptNumber and intereset the result

    if (productsData.length === 0) return productsData;
  
    if(data.length === 0) return productsData;



    if(data) return productsData.filter(item => !data?.find(dataItem => dataItem.id == item.id)).reverse().filter(item=> item.name.includes(searchText));

    // return productsData;

  }, [productsData,data,searchText]);


  const onClickAddSelected = ()=>{
    if(selectedItem.length == 0) return Alert.alert("","Please Select Item!")

    setLoading(true);
    axios.put('/api/supplier/',{
      supplier_id:supplierid,
      products:selectedItem,
      
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
      <Text style={{...s.bold_label}}>Please Select Products</Text>
      <Text style={{...s.normal_label, marginLeft:'auto'}}>{selectedItem.length} Selected</Text>

      </View>
      <View>
        <TextInput style={{...inputS}} placeholder="Search Product" onChangeText={e=> setSearchText(e)}/>
      </View>

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

          <TouchableOpacity style={{...s.blue_button,backgroundColor:'red'}} onPress={()=>{
            onClose();
            setSelectedItem([])
          }}>
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

    const {t} = useTranslation();
    return (
      <TouchableOpacity
        onPress={() => {
         onSelectItem(item.id)
        }}>
        <View
          style={{
            ...s.flexrow_aligncenter_j_between,
            backgroundColor: C.white,
            borderColor:selectedItem.includes(item.id) ? C.bluecolor : C.white,
            borderWidth:3,
            margin: 5,
            borderRadius: 15,
            padding: 10,
            elevation: 2,
          }}>
          <View>
            <Text style={{...s.bold_label}}>
              {item.name == '' ? 'Unknown' : item.name}
            </Text>
            <Text style={{...s.normal_label, fontWeight: 'bold'}}>
              {t('Price5')} : {numberWithCommas(item.cost)} Ks
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



const PaymentModal = ({show, onClose, data}) => {
  const [paymentamount, setPayamount] = useState('');
  const [loading, setLoading] = useState(false);

  const remaingamount = (parseInt(data.cost) * parseInt(data.qty)) - parseInt(data.supplier_payment);

  const onApply = () => {
    if (paymentamount == '')
      return Alert.alert('', 'Please Enter Payment Amount');
    setLoading(true);
    axios
      .put('/api/supplier/', {
        product_id:data.id,
        supplier_payment: paymentamount,
      })
      .then(res => {
        console.log(res);
        setPayamount('');
        setLoading(false);
        onClose();
      })
      .catch(err => {
        setLoading(false);
        setPayamount('');
        console.log(err);
        onClose();
      });
  };

  return (
    <MessageModalNormal show={show} onClose={onClose} width={'97%'}>
      <View>
        <Text style={{...s.bold_label}}>Enter Payment Amount</Text>
        <View style={{...inputS, flexDirection: 'row'}}>
          <TextInput
            style={{height: 45, flex: 1}}
            keyboardType="numeric"
            placeholder="Payment Amount"
            value={paymentamount + ''}
            onChangeText={e => setPayamount(e)}
          />
          {paymentamount !== remaingamount ? (
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 8,
                paddingLeft: 4,
                paddingRight: 4,
                padding: 7,
                borderRadius:5,
                backgroundColor: 'red',
              }}
              onPress={() => setPayamount(remaingamount)}>
              <Text
                style={{...s.normal_label, fontWeight: 'bold', color: 'white'}}>
                {remaingamount}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={{...s.blue_button}} onPress={onApply}>
          <Text style={{...s.bold_label, color: 'white'}}>Apply</Text>
        </TouchableOpacity>
      </View>
      <LoadingModal show={loading} infotext={'Updating'} />
    </MessageModalNormal>
  );  
};


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




export default CustomerReceiptView;
