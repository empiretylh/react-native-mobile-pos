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
  Modal,
  ScrollView,
  Button,
  Alert,
  BackHandler,
  PermissionsAndroid,
  RefreshControl,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {
  IMAGE,
  STYLE as s,
  COLOR as C,
  ALERT as a,
  numberWithCommas,
} from '../../Database';
import EncryptedStorage from 'react-native-encrypted-storage';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MessageModalNormal} from '../MessageModal';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import ProductField from './extra/productfield';
import Purchase from './Purchase';
import Loading from '../Loading';
import {useTranslation} from 'react-i18next';
import '../../assets/i18n/i18n';
const Stack = createNativeStackNavigator();

import axios from 'axios';
import {nullLiteralTypeAnnotation} from '@babel/types';

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};
const Product = ({navigation}) => {
  const RemoveToken = () => {
    EncryptedStorage.removeItem('secure_token');
  };

  const {t, i18n} = useTranslation();

  const [apmodal, setapmodal] = useState(false);
  const [cmodal, setcmodal] = useState(false);
  const [pmodal, setpmodal] = useState(false);

  const onCloseapmodal = () => setapmodal(false);
  const onClosecmodal = () => setcmodal(false);
  const onClosepmodal = () => setpmodal(false);

  const Category = () => {};
  // let t;
  const [categorytext, setCtext] = useState();

  const [categoryData, setCategoryData] = useState([]);
  const [ProductData, setProductData] = useState([]);
  const [load, setLoad] = useState(false);

  const [isUpload, setIsUpload] = useState(false);

  const GetCategoryFromServer = () => {
    setpRefreshing(true);
    axios.get('/api/categorys/').then(res => {
      let a = [];
      res.data.forEach(item => {
        a.push({label: item.title, value: item.id, id: item.id});
      });
      console.log(a);
      setCategoryData(a);
      setpRefreshing(false);
    });
  };

  useEffect(() => {
    if (load === false) {
      setTimeout(() => {
        Load();
      }, 1000);
    }
  }, []);

  const Load = () => {
    GetCategoryFromServer();
    GetProdcutsFromServer();
    setLoad(true);
  };

  const PostCategoryToServer = () => {
    axios
      .post('/api/categorys/', {title: categorytext})
      .then(res => {
        setCtext(null);
        onClosecmodal();
        GetCategoryFromServer();
      })
      .catch(err => a.spe());
  };

  const PostProductsToServer = (pd, pic) => {
    setIsUpload(true);
    const d = new FormData();
    d.append('name', pd.name);
    d.append('price', pd.price);
    d.append('qty', pd.qty);

    d.append('category', pd.category);
    d.append('description', pd.description);
    d.append('pic', pic);

    console.log(d);

    axios
      .post('/api/products/', d, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        onClosepmodal();
        setPdData({
          price: '',
          category: value,
        });
        Load();
        setIsUpload(false);
      })
      .catch(err => a.spe());
  };

  const PutProductsToServer = (pd, pic, id) => {
    setIsUpload(true);
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
        onClosepmodal();
        setPdData({
          price: '',
          category: value,
        });
        Load();
        setIsUpload(false);
      })
      .catch(err => a.spe());
  };

  const GetProdcutsFromServer = () => {
    setpRefreshing(true);
    axios
      .get('/api/products/', pdtData)
      .then(res => {
        console.log(res.data);
        setProductData(res.data);
        setpRefreshing(false);
        setSp(res.data);
      })
      .catch(err => a.spe());
  };

  const [selectItem, setSelectedItem] = useState();

  const [open, setOpen] = useState(false); //#DropDrwonPicker
  const [dopen, setDopen] = useState(false); //DatePicker
  const [value, setValue] = useState(1);

  const [date, setDate] = useState(new Date());
  const [isImage, setImage] = useState();
  const LaunchCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permisions',
          message: 'This app needs camera permsions to take photo',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        ImagePicker.launchCamera(options, res => {
          console.log('Response = ', res);
          if (res.didCancel) {
            console.log('User cancelled image picker');
          } else if (res.error) {
            console.log('ImagePicker Error: ', res.error);
          } else if (res.customButton) {
            console.log('User tapped custom button: ', res.customButton);
            alert(res.customButton);
          } else {
            const source = {
              uri: res.assets[0].uri,
              name: res.assets[0].fileName,
              type: res.assets[0].type,
            };
            setImage(source);
            console.log(source, 'The ending...');
          }
        });
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {
          uri: response.assets[0].uri,
          name: response.assets[0].fileName,
          type: response.assets[0].type,
        };

        
        setImage(source);
        console.log(source, 'The ending...');
      }
    });
  };
  const [pdtData, setPdData] = useState({
    price: '',
    category: value,
  });

  console.log(pdtData);

  const onHandlePdtData = (e, name) => {
    const temp = {...pdtData, [name]: e};

    console.log(temp);
    setPdData(temp);
  };

  const CategoryToText = id => {
    if (ProductData && categoryData) {
      const c = categoryData.filter(item => item.value == id);

      return c[0] ? c[0].label : '...';
    }
    return '...';
  };

  const SumProductBalance = pd => {
    let price = 0;
    pd.forEach(item => {
      price +=
        parseInt(item.price.replaceAllTxt(',', '').replaceAllTxt(' ', '')) *
        parseInt(item.qty);
    });

    return price;
  };

  const [prefreshing, setpRefreshing] = useState(false);
  const [sp, setSp] = useState(ProductData);

  const SearchProducts = text => {
    const data = ProductData.filter(e => {
      console.log(e.name);
      console.log(text);
      console.log(e.name === text);
      var b = e.name.replaceAllTxt(' ', '').toLowerCase();

      var f = e.description.replaceAllTxt(' ', '').toLowerCase();
      var d = CategoryToText(e.category).replaceAllTxt(' ', '').toLowerCase();
      var c = text.replaceAllTxt(' ', '').toLowerCase();

      return b.includes(c) || d.includes(c) || f.includes(c);
    });

    setSp(data);
  };

  const [filtershow, setFilterShow] = useState(false);

  const onCloseFiltershow = () => {
    setFilterShow(false);
  };

  const ProductView = ({navigation}) => {
    console.log('product view');
    const [showed, setShowed] = useState(false);
    const [editpd, seteditpd] = useState();

    const [isImage, setImage] = useState(null);

    const LaunchCamera = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permisions',
            message: 'This app needs camera permsions to take photo',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          let options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          };

          ImagePicker.launchCamera(options, res => {
            console.log('Response = ', res);
            if (res.didCancel) {
              console.log('User cancelled image picker');
            } else if (res.error) {
              console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
              console.log('User tapped custom button: ', res.customButton);
              alert(res.customButton);
            } else {
              const source = {
                uri: res.assets[0].uri,
                name: res.assets[0].fileName,
                type: res.assets[0].type,
              };
              setImage(source);
              console.log(source, 'The ending...');
            }
          });
        } else {
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const launchImageLibrary = () => {
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      ImagePicker.launchImageLibrary(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          const source = {
            uri: response.assets[0].uri,
            name: response.assets[0].fileName,
            type: response.assets[0].type,
          };

          setImage(source);
          console.log(source, 'The ending...');
        }
      });
    };

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
            <Text
              style={{
                ...s.normal_label,
                backgroundColor: C.bluecolor,
                color: 'white',
                padding: 3,
                borderRadius: 15,

                marginTop: 5,
              }}>
              {CategoryToText(item.category)}
            </Text>

            <Text style={{...s.bold_label, fontSize: 15, marginTop: 5}}>
              {numberWithCommas(item.price)} MMK
            </Text>
          </View>
          <View style={{position: 'absolute', right: 5, top: 8}}>
            <TouchableOpacity
              onPress={() => {
                setShowed(true);
                seteditpd(item);
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

    const onCloseShow = () => {
      setShowed(false);
    };

    const [depdshow, setDepdshow] = useState(false);
    const onCloseDepShow = () => {
      setDepdshow(false);
    };
    const DeleteProducts = id_ => {
      console.log(id_);
      // const fd = new FormData()
      // fd.append('cid',id_)
      axios
        .delete('/api/products/', {data: {id: id_}})
        .then(res => {
          onCloseShow();
          GetProdcutsFromServer();
          onCloseDepShow();
        })
        .catch(err => console.log(err));
    };

    const [editpdshow, setEditpdshow] = useState(false);

    const onCloseeditpdshow = () => {
      setEditpdshow(false);
      setShowed(false);
    };

    const [open, setOpen] = useState(false); //#DropDrwonPicker

    const [value, setValue] = useState();

    const onHandleEPdtData = (e, name) => {
      const temp = {...editpd, [name]: e};

      console.log(temp, '');
      seteditpd(temp);
    };

    return (
      <View>
        {editpd ? (
          <MessageModalNormal
            show={editpdshow}
            onClose={onCloseeditpdshow}
            width={'100%'}
            nobackExit={true}>
            <ScrollView style={{}}>
              <View
                style={{
                  backgroundColor: C.bluecolor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  borderRadius: 15,
                }}>
                <Image
                  source={{
                    uri: isImage
                      ? isImage.uri
                      : 'https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png',
                  }}
                  style={{width: '100%', height: 180, backgroundColor: 'black'}}
                />
                <View style={{...s.flexrow_aligncenter_j_between}}>
                  <TouchableOpacity onPress={() => LaunchCamera()}>
                    <Icons
                      name={'camera'}
                      size={30}
                      color={'#fff'}
                      style={{margin: 5}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => launchImageLibrary()}>
                    <Icons
                      name={'image'}
                      size={30}
                      color={'#fff'}
                      style={{margin: 5}}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{marginTop: 10}}>
                <Text style={{...s.bold_label}}>{t('ProductName')}</Text>
                <TextInput
                  style={{
                    padding: 10,
                    fontSize: 16,
                    fontWeight: '900',

                    ...inputS,
                  }}
                  placeholder={'Product Name'}
                  autoFocus={true}
                  defaultValue={editpd.name}
                  onChangeText={e => onHandleEPdtData(e, 'name')}
                />
                <Text style={{...s.bold_label}}>{t('Category')}</Text>
                <DropDownPicker
                  open={open}
                  value={editpd.category}
                  items={categoryData.reverse()}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setCategoryData}
                  autoScroll
                  listMode={'SCROLLVIEW'}
                  style={{
                    ...inputS,
                    backgroundColor: 'transparent',
                  }}
                  onSelectItem={item => {
                    onHandleEPdtData(item.value, 'category');
                  }}
                />
                <Text style={{...s.bold_label, marginTop: 5}}>
                  {t('Quantity')}
                </Text>
                <TextInput
                  style={{
                    padding: 10,
                    fontSize: 16,
                    fontWeight: '900',

                    ...inputS,
                  }}
                  placeholder={'Qty'}
                  keyboardType={'number-pad'}
                  defaultValue={editpd.qty}
                  onChangeText={e =>
                    onHandleEPdtData(e.replaceAllTxt(' ', ''), 'qty')
                  }
                />
                <Text style={{...s.bold_label, marginTop: 5}}>
                  {t('Price3')}
                </Text>
                <TextInput
                  style={{
                    padding: 10,
                    fontSize: 16,
                    fontWeight: '900',

                    ...inputS,
                  }}
                  placeholder={t('Price3')}
                  keyboardType={'number-pad'}
                  defaultValue={editpd.price}
                  onChangeText={e =>
                    onHandleEPdtData(e.replaceAllTxt(' ', ''), 'price')
                  }
                />

                <Text style={{...s.bold_label, marginTop: 5}}>
                  {t('Description')}
                </Text>
                <TextInput
                  style={{
                    padding: 10,
                    fontSize: 16,
                    fontWeight: '900',
                    ...inputS,
                    height: 100,
                    textAlign: 'auto',
                  }}
                  placeholder={'Description'}
                  multiline
                  defaultValue={editpd.description}
                  onChangeText={e => onHandleEPdtData(e, 'description')}
                />

                <TouchableOpacity
                  disabled={isUpload}
                  onPress={() => {
                    if (
                      editpd.name &&
                      editpd.category &&
                      editpd.price &&
                      editpd.qty
                    ) {
                      PutProductsToServer(editpd, isImage, editpd.id);
                    } else {
                      a.rqf();
                    }
                  }}>
                  <View
                    style={{
                      ...s.flexrow_aligncenter_j_center,
                      padding: 10,
                      ...s.blue_button,
                    }}>
                    <Text style={{...s.font_bold, color: 'white', padding: 10}}>
                      {t('Edit_Product')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </MessageModalNormal>
        ) : null}

        <MessageModalNormal
          show={depdshow}
          onClose={onCloseDepShow}
          width={'95%'}>
          <View style={{justifyContent: 'center'}}>
            <View style={{}}>
              <Text style={{...s.bold_label, marginBottom: 5}}>
                {t('ASWDP')}
                {' \n'}
                {editpd ? editpd.name : ''}
              </Text>
              <Text style={{...s.normal_label}}>{t('ASWDP2')}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                DeleteProducts(editpd.id);
              }}>
              <View
                style={{
                  ...s.flexrow_aligncenter,
                  padding: 10,
                  backgroundColor: 'red',
                  borderRadius: 15,
                }}>
                <Icons name={'trash'} size={30} color={'#fff'} />
                <Text style={{...s.bold_label, marginLeft: 5, color: 'white'}}>
                  {t('DPAnyway')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDepdshow(false);
              }}>
              <View
                style={{
                  ...s.flexrow_aligncenter,
                  padding: 10,
                  backgroundColor: '#32a852',
                  borderRadius: 15,
                  marginTop: 5,
                }}>
                <Icons name={'close'} size={30} color={'#fff'} />
                <Text style={{...s.bold_label, marginLeft: 5, color: 'white'}}>
                  {t('Cancel')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </MessageModalNormal>
        <MessageModalNormal show={showed} onClose={onCloseShow}>
          <View style={{justifyContent: 'center'}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{...s.bold_label, marginBottom: 5}}>
                {editpd ? editpd.name : ''}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setEditpdshow(true);
              }}>
              <View
                style={{
                  ...s.flexrow_aligncenter,
                  padding: 20,
                  backgroundColor: C.bluecolor,
                  borderRadius: 15,
                  marginBottom: 8,
                }}>
                <Icons name={'create-outline'} size={30} color={'#fff'} />
                <Text
                  style={{
                    ...s.bold_label,
                    marginLeft: 5,
                    color: 'white',
                    fontSize: 22,
                  }}>
                  {t('Edit_Product')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDepdshow(true);
              }}>
              <View
                style={{
                  ...s.flexrow_aligncenter,
                  padding: 10,
                  backgroundColor: 'red',
                  borderRadius: 15,
                }}>
                <Icons name={'trash'} size={30} color={'#fff'} />
                <Text style={{...s.bold_label, marginLeft: 5, color: 'white'}}>
                  {t('Delete_Product')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </MessageModalNormal>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={prefreshing}
              onRefresh={GetProdcutsFromServer}
            />
          }
          style={{backgroundColor: C.white}}
          data={sp}
          renderItem={PDITEM}
          keyExtractor={i => i.id}
        />
      </View>
    );
  };

  const CategoryView = ({navigation}) => {
    const PDITEM = ({item}) => {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 10,
            margin: 5,
            borderRadius: 15,
          }}>
          <Text style={{...s.bold_label}}>{item.label}</Text>
        </View>
      );
    };
    return (
      <View>
        <FlatList
          data={categoryData.reverse()}
          refreshControl={
            <RefreshControl
              refreshing={prefreshing}
              onRefresh={GetCategoryFromServer}
            />
          }
          renderItem={PDITEM}
          keyExtractor={i => i.id}
          style={{backgroundColor: 'white'}}
        />
      </View>
    );
  };

  const [focusView, setFocusView] = useState('p');

  const SortProduct = type => {
    const temp_product = [...sp];
    if (type === 'name')
      temp_product.sort((p1, p2) => (p1.name > p2.name ? 1 : -1));
    if (type === 'qty') temp_product.sort((p1, p2) => p1.qty - p2.qty);
    if (type === 'price') temp_product.sort((p1, p2) => p1.price - p2.price);
    setSp(temp_product);
    onCloseFiltershow();
  };

  return (
    <View style={{...s.Container}}>
      <Loading show={isUpload} infotext={'Creating Product'} />
      <MessageModalNormal show={filtershow} onClose={onCloseFiltershow}>
        <View>
          <Text style={{...s.bold_label}}>Sort Product</Text>
          <View>
            <TouchableOpacity
              onPress={() => {
                SortProduct('name');
              }}
              style={{...s.blue_button, marginTop: 8, padding: 10}}>
              <Text style={{...s.bold_label, color: 'white'}}>
                Sort By Name
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                SortProduct('qty');
              }}
              style={{...s.blue_button, marginTop: 8, padding: 10}}>
              <Text style={{...s.bold_label, color: 'white'}}>Sort By Qty</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                SortProduct('price');
              }}
              style={{...s.blue_button, marginTop: 8, padding: 10}}>
              <Text style={{...s.bold_label, color: 'white'}}>
                Sort By Price
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </MessageModalNormal>

      <MessageModalNormal
        show={pmodal}
        onClose={onClosepmodal}
        width={'100%'}
        nobackExit={true}>
        <ScrollView style={{}}>
          <View
            style={{
              backgroundColor: C.bluecolor,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              borderRadius: 15,
            }}>
            <Image
              source={{
                uri: isImage
                  ? isImage.uri
                  : 'https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png',
              }}
              style={{width: '100%', height: 180, backgroundColor: 'black'}}
            />
            <View style={{...s.flexrow_aligncenter_j_between}}>
              <TouchableOpacity onPress={() => LaunchCamera()}>
                <Icons
                  name={'camera'}
                  size={30}
                  color={'#fff'}
                  style={{margin: 5}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => launchImageLibrary()}>
                <Icons
                  name={'image'}
                  size={30}
                  color={'#fff'}
                  style={{margin: 5}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{marginTop: 10}}>
            <Text style={{...s.bold_label}}>{t('ProductName')}</Text>
            <TextInput
              style={{
                padding: 10,
                fontSize: 16,
                fontWeight: '900',

                ...inputS,
              }}
              placeholder={t('PrdocutName')}
              autoFocus={true}
              onChangeText={e => onHandlePdtData(e, 'name')}
            />
            <Text style={{...s.bold_label}}>{t('Category')}</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={categoryData.reverse()}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setCategoryData}
              autoScroll
              listMode={'SCROLLVIEW'}
              style={{
                ...inputS,
                backgroundColor: 'transparent',
              }}
              onSelectItem={item => {
                onHandlePdtData(item.value, 'category');
              }}
            />
            <Text style={{...s.bold_label, marginTop: 5}}>{t('Quantity')}</Text>
            <TextInput
              style={{
                padding: 10,
                fontSize: 16,
                fontWeight: '900',

                ...inputS,
              }}
              placeholder={'Qty'}
              keyboardType={'number-pad'}
              onChangeText={e =>
                onHandlePdtData(e.replaceAllTxt(' ', ''), 'qty')
              }
            />
            <Text style={{...s.bold_label, marginTop: 5}}>{t('Price3')}</Text>
            <TextInput
              style={{
                padding: 10,
                fontSize: 16,
                fontWeight: '900',

                ...inputS,
              }}
              placeholder={t('Price3')}
              keyboardType={'number-pad'}
              value={pdtData.price}
              onChangeText={e =>
                onHandlePdtData(e.replaceAllTxt(' ', ''), 'price')
              }
            />
            {/* <Text style={{...s.bold_label, marginTop: 5}}>Date</Text>
            <View style={{...s.flexrow_aligncenter_j_center, ...inputS}}>
              <TextInput
                style={{
                  flex: 1,
                  padding: 10,
                  fontSize: 16,
                  fontWeight: '900',
                }}
                placeholder={'Date'}
                value={date.toLocaleDateString()}
                defaultValue={date.toLocaleDateString()}
                onChangeText={e => onHandlePdtData(date, 'date')}
              />
              <TouchableOpacity onPress={() => setDopen(true)}>
                <Icons name={'calendar'} size={25} color={'#000'} />
              </TouchableOpacity>
              <DatePicker
                modal
                open={dopen}
                date={date}
                mode={'date'}
                onConfirm={date => {
                  setDopen(false);
                  setDate(date);
                  console.log(date);
                  onHandlePdtData(date, 'date');
                }}
                onCancel={() => {
                  setDopen(false);
                }}
              />
            </View> */}
            <Text style={{...s.bold_label, marginTop: 5}}>
              {t('Description')}
            </Text>
            <TextInput
              style={{
                padding: 10,
                fontSize: 16,
                fontWeight: '900',
                ...inputS,
                height: 100,
                textAlign: 'auto',
              }}
              placeholder={t('Description')}
              multiline
              onChangeText={e => onHandlePdtData(e, 'description')}
            />

            <TouchableOpacity
              disabled={isUpload}
              onPress={() => {
                if (
                  pdtData.name &&
                  pdtData.category &&
                  pdtData.price &&
                  pdtData.qty
                ) {
                  PostProductsToServer(pdtData, isImage);
                } else {
                  a.rqf();
                }
              }}>
              <View
                style={{
                  ...s.flexrow_aligncenter_j_center,
                  padding: 10,
                  ...s.blue_button,
                }}>
                <Text style={{...s.font_bold, color: 'white', padding: 10}}>
                  {t('Add_Product')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </MessageModalNormal>
      <MessageModalNormal show={cmodal} onClose={onClosecmodal}>
        <View>
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
              placeholder={t('Category')}
              autoFocus={true}
              value={categorytext}
              onChangeText={e => setCtext(e)}
            />
            <TouchableOpacity onPress={() => setCtext(null)}>
              <Icons name={'close-outline'} size={20} color={'#000'} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            disabled={isUpload}
            onPress={() => {
              if (categorytext) {
                PostCategoryToServer();
              } else {
                a.rqf();
              }
            }}>
            <View
              style={{
                ...s.flexrow_aligncenter_j_center,
                padding: 10,
                ...s.blue_button,
              }}>
              <Text style={{...s.font_bold, color: 'white', padding: 10}}>
                {t('Add_Category')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </MessageModalNormal>
      <MessageModalNormal show={apmodal} onClose={onCloseapmodal}>
        <View>
          <TouchableOpacity
            onPress={() => {
              setcmodal(true);

              onCloseapmodal();
            }}>
            <View style={{...s.flexrow_aligncenter, padding: 10}}>
              <Icons name={'duplicate-outline'} size={30} color={'#000'} />
              <Text style={{...s.bold_label, marginLeft: 5}}>
                {t('Add_Category')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setpmodal(true);
              setImage(null);
              onCloseapmodal();
            }}>
            <View style={{...s.flexrow_aligncenter, padding: 10}}>
              <MIcons
                name={'package-variant-closed'}
                size={30}
                color={'#000'}
              />
              <Text style={{...s.bold_label, marginLeft: 5}}>
                {t('Add_Product')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </MessageModalNormal>

      {/* appbar */}
      <View
        style={{
          ...s.flexrow_aligncenter_j_between,
          padding: 8,
        }}>
        <Text style={{...s.bold_label, fontSize: 23}}>{t('Products')}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{...s.bold_label}}>
            {numberWithCommas(SumProductBalance(ProductData))} MMK
          </Text>
        </View>
      </View>
      {/* view */}
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
            flex: 1,
            fontWeight: '900',
          }}
          placeholder={t('Search_Products')}
          onChangeText={e => SearchProducts(e)}
        />
        <Icons name={'search'} size={20} color={'#000'} />
      </View>
      <View style={{...s.flexrow_aligncenter_j_center}}>
        <TouchableOpacity onPress={() => setFilterShow(true)}>
          <Icons name={'filter'} size={25} color={'#000'} />
        </TouchableOpacity>
        <ScrollView
          style={{flexDirection: 'row'}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('p');
              setFocusView('p');
            }}>
            <Text
              style={{
                ...s.normal_label,
                ...s.black_button,
                color: focusView === 'p' ? 'white' : 'black',
                backgroundColor: focusView === 'p' ? C.blackbutton : '#f0f0f0',
                padding: 10,
                borderRadius: 15,
                fontSize: 15,
              }}>
              {t('Products')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('c');
              setFocusView('c');
            }}>
            <Text
              style={{
                ...s.normal_label,
                ...s.black_button,
                color: focusView === 'c' ? 'white' : 'black',
                backgroundColor: focusView === 'c' ? C.blackbutton : '#f0f0f0',
                padding: 10,
                borderRadius: 15,
                fontSize: 15,
              }}>
              {t('Category')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('cpurchase');
            }}>
            <Text
              style={{
                ...s.normal_label,
                ...s.black_button,
                color: 'black',
                backgroundColor: '#f0f0f0',
                padding: 10,
                borderRadius: 15,
                fontSize: 15,
              }}>
              {t('Purchase')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity>
          <Text style={{...s.bold_label, fontSize: 14, padding: 5}}>
            {ProductData.length}
          </Text>
        </TouchableOpacity>
      </View>

      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={'p'} component={ProductView} />
        <Stack.Screen name={'c'} component={CategoryView} />
      </Stack.Navigator>
      <View
        style={{
          ...s.blue_button,
          borderRadius: 50,
          position: 'absolute',
          bottom: 55,
          right: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            console.log('apmodal');
            setapmodal(true);
          }}>
          <Icons name={'add'} size={35} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Container = ({navigation}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'cproduct'} component={Product} />
      <Stack.Screen name={'cpurchase'} component={Purchase} />
    </Stack.Navigator>
  );
};

export default Container;

const inputS = {
  ...s.flexrow_aligncenter_j_between,
  borderRadius: 15,
  height: 45,
  borderColor: 'black',
  borderWidth: 1.5,
  paddingRight: 10,
  marginTop: 10,
};
