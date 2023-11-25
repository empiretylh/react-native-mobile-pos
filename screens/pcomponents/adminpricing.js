/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {IMAGE} from '../../Database';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  STYLE as s,
  COLOR as C,
  IMAGE as I,
  ALERT as A,
  isArrayhasData,
} from '../../Database';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import Loading from './extra/Loading';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {MessageModalNormal} from '../MessageModal'


const Tab = createMaterialTopTabNavigator();

const PriceRequestProvider = React.createContext(null);



const AdminPricing = ({navigation, route}) => {
  const [modalVisible, SetmodalVisible] = useState(false);

  const [pricing, setPricing] = useState(null);
  const [requestPrice, setRequestPrice] = useState(null);

  useEffect(() => {
    GetPrice();
  }, []);

  const GetPrice = () => {
    SetmodalVisible(true);
    axios
      .get('/api/pricingrequest/')
      .then(res => {
        console.log(res.data);
        setPricing(res.data);

        SetmodalVisible(false);
      })
      .catch(err => {
        console.log(err);
        SetmodalVisible(false);
      });
  };

  const AcceptRequest = (id, username) => {
    SetmodalVisible(true);
    console.log(id, username);
    axios
      .post('/api/pricingrequest/', {rq_id: id, username: username})
      .then(res => {
        console.log(res.data);
        // setPricing(res.data);
        GetPrice();
        SetmodalVisible(false);
      })
      .catch(err => {
        console.log(err);
        SetmodalVisible(false);
      });
  };

  const RequestPrice = id => {
    console.log('Requesting Price');
    if (isArrayhasData(requestPrice)) {
      A.c_b();
    } else {
      SetmodalVisible(true);
      axios
        .post('/api/pricing/', {type: id})
        .then(res => {
          console.log(res.data);
          SetmodalVisible(false);
          GetPrice();
        })
        .catch(err => {
          console.log(err);
          SetmodalVisible(false);
        });
    }
  };

  const DeleteRequest = id => {
    console.log('Deleteing Request Price');
    SetmodalVisible(true);
    axios
      .delete('/api/pricingrequest/', {
        params: {
          id: id,
        },
      })
      .then(res => {
        console.log(res.data);
        SetmodalVisible(false);
        GetPrice();
      })
      .catch(err => {
        console.log(err);
        SetmodalVisible(false);
      });
  };

  const onDeleteUser = (id)=>{
      console.log('Deleteing Request Price');
    SetmodalVisible(true);
    axios
      .delete('/api/profile/', {
        params: {
          username: id,
        },
      })
      .then(res => {
        console.log(res.data);
        SetmodalVisible(false);
        GetPrice();
      })
      .catch(err => {
        console.log(err);
        SetmodalVisible(false);
      });
  }


  const RequestUser = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          borderRadius: 15,
          backgroundColor: 'white',
          padding: 10,
          marginTop: 5,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: axios.defaults.baseURL + item.user.profileimage}}
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{flexDirection: 'column', marginLeft: 8}}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
              {item.user.name}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.username}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.phoneno}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.email}
            </Text>
          </View>
        </View>
        <View style={{marginTop: 8}}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Requested Date
          </Text>
          <Text style={styles.text}>{new Date(item.date).toUTCString()}</Text>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Plan
          </Text>
          <Text style={styles.text}>{item.rq_price.title}</Text>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Price
          </Text>
          <Text style={styles.text}>{item.rq_price.price} MMK</Text>

          <TouchableOpacity
            style={{...s.blue_button, padding: 8}}
            onPress={() => AcceptRequest(item.id, item.user.username)}>
            <Text style={{color: 'white'}}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const AcceptedUser = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          borderRadius: 15,
          backgroundColor: 'white',
          padding: 10,
          marginTop: 5,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: axios.defaults.baseURL + item.user.profileimage}}
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{flexDirection: 'column', marginLeft: 8}}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
              {item.user.name}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.username}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.phoneno}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.email}
            </Text>
          </View>
        </View>
        <View style={{marginTop: 8}}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Requested Date
          </Text>
          <Text style={styles.text}>{new Date(item.date).toUTCString()}</Text>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Plan
          </Text>
          <Text style={styles.text}>{item.rq_price.title}</Text>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
            Price
          </Text>
          <Text style={styles.text}>{item.rq_price.price} MMK</Text>
        </View>
      </View>
    );
  };

  if (pricing) {
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
        <Loading
          modal={true}
          show={modalVisible}
          onClose={() => SetmodalVisible(false)}
          infotext={'Loading'}
        />
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginTop:10}}>
        <Image source={I.app_logo} style={{width:35, height:35, marginRight:5}}/>
          <Text
          style={{
            ...s.bold_label,
            color: 'black',
            fontSize: 15,
            textAlign: 'center',
          }}>
          Admin Pricing
        </Text>  
        </View>
    <PriceRequestProvider.Provider value={{pricing, setPricing, GetPrice, AcceptRequest, DeleteRequest,onDeleteUser}}>
      

        <Tab.Navigator 

        screenOptions={{
          headerShown:false,
          tabBarStyle:{
            backgroundColor:'white',
          }
        }}>
        <Tab.Screen name='Request' component={RequestComponent}/>
        <Tab.Screen name='Accepted' component={AcceptComponent}/>
          
        </Tab.Navigator>
    </PriceRequestProvider.Provider>
  
      </View>
    );
  }
  return <Loading />;
};


const RequestComponent = ({navigation})=>{

  const {pricing, setPricing, GetPrice, AcceptRequest, DeleteRequest} = useContext(PriceRequestProvider);
  const [searchText,setSearchText] = useState('');

  const FilterRequest = React.useMemo(()=>{
    if(pricing){
      let result = pricing.filter(e=> e.done == false).reverse().filter(item=> item.user.username.includes(searchText))
      return result
    }
  },[pricing, searchText])



  const RequestUser = ({item}) => {
    return (
      <View
        style={{
          flex:1,
          flexDirection: 'column',
          borderRadius: 15,
          backgroundColor: 'white',
          padding: 10,
          marginTop: 5,
        }}>
        <View style={{width:'100%',flexDirection: 'row'}}>
          <Image
            source={item.user.profileimage ? [{uri:axios.defaults.baseURL + item.user.profileimage}] : I.app_logo}
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{flexDirection: 'column', marginLeft: 8, flex:1}}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
              {item.user.name}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.username}
            </Text>
       
              <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.rq_price.title} Requested at {new Date(item.date).toLocaleDateString()}
            </Text>
             <View style={{marginTop: 8, flexDirection:'row'}}>
          <TouchableOpacity
            style={{...s.blue_button, padding: 8, flex:1, backgroundColor:'red'}}
            onPress={()=>{
              DeleteRequest(item.id)
            }}
           >             
            <Text style={{color: 'white'}}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...s.blue_button, padding: 8, flex:1}}

            onPress={()=>{
               AcceptRequest(item.id, item.user.username)
            }}
           >             
            <Text style={{color: 'white'}}>Accept</Text>
          </TouchableOpacity>

        </View>
          </View>

        </View>
        
      </View>
    );
  };


  return(
    <View style={{flex:1, padding:5}}>
    <TextInput style={{...inputS, margin:5}} placeholder="Search Username" onChangeText={e=>setSearchText(e)}/>
      <FlatList 
      data={FilterRequest}
      renderItem={RequestUser}
      keyExtractor={i=>i.id.toString()}
      />      
    </View>
    )
}

const AcceptComponent = ({navigation})=>{

  const {pricing, setPricing, GetPrice, AcceptRequest, DeleteRequest} = useContext(PriceRequestProvider);
  const [searchText,setSearchText] = useState('');
  const [user, setUser] = useState([])
  const [userShow, setUserShow] = useState(false);

  const FilterRequest = React.useMemo(()=>{
    if(pricing){
      let result = pricing.filter(e=> e.done == true).reverse().filter(item=> item.user.username.includes(searchText))
      return result
    }
  },[pricing, searchText])



  const RequestUser = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          flex:1,
          flexDirection: 'column',
          borderRadius: 15,
          backgroundColor: 'white',
          padding: 10,
          marginTop: 5,
        }}
        onPress={()=>{
          setUser(item.user)
          setUserShow(true);

        }}
        >
        <View style={{width:'100%',flexDirection: 'row'}}>
          <Image
            source={item.user.profileimage ? [{uri:axios.defaults.baseURL + item.user.profileimage}] : I.app_logo}
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{flexDirection: 'column', marginLeft: 8, flex:1}}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
              {item.user.name}
            </Text>
            <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal'}}>
              {item.user.username}
            </Text>
       
              <Text style={{color: 'black', fontSize: 15, fontWeight: 'normal', backgroundColor:'yellow', padding:2}}>
             {item.rq_price.title} PLAN EXPIRE IN {new Date(item.user.end_d).toLocaleDateString()}
            </Text>
             
          </View>

        </View>
        
      </TouchableOpacity>
    );
  };


  return(
    <View style={{flex:1, padding:5}}>
    <UserDetailModal data={user} show={userShow}  onClose={()=> setUserShow(false)}/>
    <TextInput style={{...inputS, margin:5}} placeholder="Search Username" onChangeText={e=>setSearchText(e)}/>
      <FlatList 
      data={FilterRequest}
      renderItem={RequestUser}
      keyExtractor={i=>i.id.toString()}
      />      
    </View>
    )
}

const UserDetailModal = ({show, onClose, data})=>{
  const tableItem = [
    {name:"Username", value:data.username},
    {name:"Email", value:data.email},
    {name:"Phone Number", value:data.phoneno},
    {name:"Address", value:data.address},
    {name:"Join Date", value: new Date(data.start_d).toLocaleDateString()},
    {name:"Plan End", value: new Date(data.end_d).toLocaleDateString()}

    ]

  const [delConfirmShow, setDelConfirmShow] = useState(false);
    
  return(
    <>
    <MessageModalNormal show={show} onClose={onClose} width={'90%'}>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <Text style={{...s.bold_label}}>User Detail</Text>
      </View>
      <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center', marginTop:10}}>
          <Image
            source={data.profileimage ? [{uri:axios.defaults.baseURL + data.profileimage}] : I.app_logo}
            style={{width: 80, height: 80, borderRadius: 80}}
          />
          <Text style={{...s.bold_label}}>{data.name}</Text>
          <Text style={{...s.normal_label}}>username : {data.username}</Text>
      </View>
      {
        data ? tableItem.map((item,index)=> 
          <View style={{flexDirection:'row', }}>
       <View style={{flex:1, padding:5, borderWidth:1, borderColor:'black',width:80, maxWidth:80}}>
         <Text style={{...s.normal_label}}>{item.name}</Text>
       </View>
       <View style={{flex:1, padding:5, borderWidth:1, borderColor:'black'}}>
         <Text style={{...s.normal_label}}>{item.value}</Text>
       </View>
     </View>):null
      }
      <View style={{flexDirection:'column', marginTop:5}}>{data.is_superuser?null:
             <TouchableOpacity style={{...s.blue_button, backgroundColor:'red'}} onPress={()=> setDelConfirmShow(true)}>
                <Text style={{...s.bold_label, color:'white'}}>Delete User</Text>
              </TouchableOpacity>}
        <TouchableOpacity style={{...s.blue_button, color:'white'}} onPress={onClose}>
          <Text style={{...s.bold_label, color:'white'}}>Close</Text>
        </TouchableOpacity>
      </View>
    
    </MessageModalNormal>
    <ConfirmDelShow show={delConfirmShow} onClose={()=> setDelConfirmShow(false)} data={data} onApply={onClose}/>
    </>
    )
}

const ConfirmDelShow = ({show,onClose, data, onApply})=>{

  const [typeusername, setTypeusername] = useState('')
  const { onDeleteUser} = useContext(PriceRequestProvider);
  

    return(
     <MessageModalNormal show={show} onClose={onClose} width={'90%'}>
    
      <Text style={{...s.bold_label}}>Are you sure want to delete this user?</Text>
      <Text style={{...s.normal_label, color:'red'}}>After deleting the user, Their associated data is also deleted on the server.</Text>
      <Text style={{...s.bold_label}}>To Confirm that type their username exctaly.</Text>
      <Text style={{...s.bold_label, textAlign:'center'}}>{data.username}</Text>

      <TextInput style={{...inputS}} placeholder={'Type Username'} onChangeText={e=> setTypeusername(e)}/>

      <View style={{flexDirection:'column', marginTop:5}}>{data.is_superuser?null:
             <TouchableOpacity style={{...s.blue_button, backgroundColor:'red'}} onPress={()=>{
              if(data.username == typeusername){
                onDeleteUser(data.username)
                onClose();
                onApply();
              }else{
                Alert.alert("","If you want to delete this user, please type " + data.username+ " exctaly.")
              }
             }}>
                <Text style={{...s.bold_label, color:'white'}}>Delete</Text>
              </TouchableOpacity>}
        <TouchableOpacity style={{...s.blue_button, color:'white'}} onPress={onClose}>
          <Text style={{...s.bold_label, color:'white'}}>Cancel</Text>
        </TouchableOpacity>
      </View>
    
    </MessageModalNormal>
    )

}


const inputS = {
  ...s.flexrow_aligncenter_j_between,
  borderRadius: 15,
  height: 45,
  borderColor: 'black',
  borderWidth: 1.5,
  paddingRight: 10,
  marginTop: 10,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#357cf0',
    padding: 10,
  },
  appbar: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userdebtinfo: {
    backgroundColor: 'orange',
    height: 150,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginBottom: 5,
  },
  usertotaldebt: {
    backgroundColor: '#346beb',
    height: 80,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginTop: 0,
  },
  citem: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    borderRadius: 15,
  },
  text: {
    color: 'white',
    fontSize: 15,
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 15,
    textAlign: 'center',
  },
});

export default AdminPricing;
