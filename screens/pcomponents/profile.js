/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Linking,
  Text,
} from 'react-native';
import axios from 'axios';
import Icons from 'react-native-vector-icons/Ionicons';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import {
  IMAGE as I,
  COLOR as C,
  STYLE as s,
  ALERT as a,
  appversion,
} from '../../Database';
import {MessageModalNormal} from '../MessageModal';

import {useTranslation} from 'react-i18next';
import '../../assets/i18n/i18n';
import EncryptedStorage from 'react-native-encrypted-storage';
import Container from '../Container';
import CheckBox from '@react-native-community/checkbox';
import {TextInput} from 'react-native-gesture-handler';
import Loading from '../pcomponents/extra/Loading';

const Icon = props => <Icons {...props} color={'#000'} />;

const Profile = ({navigation, route}) => {
  const [pdata, setPddata] = useState(null);
  const [showmodal, setShowModal] = useState(false);
  const [showeditmodal, setShowEditModal] = useState(false);
  const [editdata, setEditData] = useState(null);

  const [imagedata, setImageData] = useState([]);
  const [isPostSuccess, setIspostsuccess] = useState();

  const [clickcount, setClickCount] = useState(0);

  const [isLoad, setIsLoad] = useState(false);
  const {token} = route.params;
  const RemoveToken = () => {
    EncryptedStorage.removeItem('secure_token');
    // Container.InfoToken.setUserToken(null);

    token(null);
  };
  useEffect(() => {
    LoadProfile();
    getSettings();
  }, []);

  const {t, i18n} = useTranslation();

  const LoadProfile = () => {
    setIsLoad(true);
    axios
      .get('/api/profile/')
      .then(res => {
        setPddata(res.data);
        setIsLoad(false);
      })
      .catch(res => {
        console.log(res);
        setIsLoad(false);
      });
  };

  const PostImage = source => {
    let data = new FormData();
    setIsLoad(true);
    data.append('image', source);
    console.log(source);
    console.log(data);
    axios
      .post('/api/profile/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        setIsLoad(false);
        setPddata(res.data);
      })
      .catch(err => {
        console.log(err);
        setIsLoad(false);
      });
  };

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
            PostImage(source);
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

        console.log(source, 'The ending...');
        PostImage(source);
      }
    });
  };

  const RenderChooseImageModal = props => {
    return (
      <MessageModalNormal {...props}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            padding: 10,
            color: 'black',
          }}>
          {t('Change_Profile_Picture')}
        </Text>
        <TouchableOpacity
          style={styles.chooseimagebutton}
          onPress={() => {
            console.log('Take a photo');
            LaunchCamera();
            setShowModal(false);
          }}>
          <Icon name={'camera-outline'} size={25} />
          <Text
            style={{
              fontSize: 18,
              marginLeft: 5,
              fontWeight: '500',
              color: 'black',
            }}>
            {t('Take_Photo')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chooseimagebutton}
          onPress={() => {
            console.log('Choose Image From Gallery');
            launchImageLibrary();
            setShowModal(false);
          }}>
          <Icon name={'image-outline'} size={25} />
          <Text
            style={{
              fontSize: 18,
              marginLeft: 5,
              fontWeight: '500',
              color: 'black',
            }}>
            {t('Choose_Image')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chooseimagebutton_cancel}
          onPress={() => setShowModal(false)}>
          <Text
            style={{
              fontSize: 18,
              marginLeft: 5,
              fontWeight: '500',
              color: 'black',
            }}>
            {t('Cancel')}
          </Text>
        </TouchableOpacity>
      </MessageModalNormal>
    );
  };

  const OnEditApply = d => {
    const data = {};
    data[d.title] = d.value;
    console.log(d);
    setIsLoad(true);
    axios
      .post('/api/profile/', data)
      .then(res => {
        setPddata(res.data);
        setIsLoad(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoad(true);
      });
  };

  const RenderEditModal = props => {
    const [editd, seteditd] = useState(null);
    const onEditData = (e, name) => {
      const tempdata = {...editd, [name]: e};
      console.log(tempdata);
      seteditd(tempdata);
      console.log(e, name);
    };

    useEffect(() => {
      if (editd === null) {
        seteditd(editdata);
      }
    }, []);

    return (
      <Modal {...props} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            width: C.windowWidth * 100,
            height: C.windowHeight * 100,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '80%',

              backgroundColor: 'white',
              borderRadius: 15,
              padding: 10,
              shadowColor: 'black',
              shadowOffset: {width: 2, height: 3},
              shadowRadius: 5,
              shadowOpacity: 0.4,
            }}>
            <Text style={{fontSize: 20, fontWeight: '600', padding: 10}}>
              Change {editd ? editd.title : ''}
            </Text>
            <View>
              <TextInput
                style={{
                  backgroundColor: C.textfield,
                  height: editd && editd.title == 'Purpose' ? 100 : 40,
                  borderRadius: 15,
                  paddingTop: editd && editd.title == 'Purpose' ? 6 : 0,
                  paddingLeft: 6,
                  paddingRight: 5,
                  fontSize: 16,
                }}
                defaultValue={editd ? editd.value : ''}
                multiline={editd && editd.title == 'Purpose' ? true : false}
                onChangeText={text => onEditData(text, 'value')}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.chooseimagebutton_cancel}
                onPress={() => setShowEditModal(false)}>
                <Text style={{fontSize: 18, padding: 10, fontWeight: '500'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chooseimagebutton_cancel}
                onPress={() => {
                  setShowEditModal(false);
                  console.log(editd.value);
                  OnEditApply(editd);
                }}>
                <Text style={{fontSize: 18, padding: 10, fontWeight: '500'}}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const [settings, setSettings] = useState({language: 'en', datascope: 'year'});
  const [fbshow, setFbshow] = useState(false);
  const [feedback, setFeedback] = useState();
  const [showthura, setShowThura] = useState(false);

  const SaveSettings = async setting => {
    await EncryptedStorage.setItem('setting_data', JSON.stringify(setting));
    console.log('Setting Saved', JSON.stringify(setting));
  };

  const getSettings = () => {
    // Set language from i18n
    setSettings({...settings, ['language']: i18n.language});

    EncryptedStorage.getItem('setting_data')
      .then(res => {
        console.log('get Settings', res);
        if (res !== null) {
          setSettings(JSON.parse(res));
        }
      })
      .catch(err => console.log(err));
  };

  let rdco;

  const bwcolor = color => {
    if (color.includes('F')) {
      return 'white';
    } else {
      return 'black';
    }
  };

  function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
  }

  function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  if (pdata === null) {
    return <Loading />;
  }

  const HandleSettings = (value, name) => {
    const setting_temp = {...settings, [name]: value};
    setSettings(setting_temp);
    console.log('Handle Setting,', settings);
    if (name === 'language') {
      i18n
        .changeLanguage(value)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
    SaveSettings(setting_temp);
  };

  const FeedbackModal = () => (
    <View>
      <Text style={{fontSize: 18, color: 'black'}}>Feedback</Text>
      <Text style={{color: 'black'}}>Type your Feedback</Text>
      <TextInput
        multiline
        placeholder="Type your feedback here"
        style={{...inputS, color: '#0f0f0f'}}
        onChangeText={e => setFeedback(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (feedback) {
            PostFeedBack(feedback);
          } else {
            a.rqf();
          }
        }}
        style={{...s.blue_button, marginTop: 8, padding: 10}}>
        <Text style={{...s.bold_label, color: 'white'}}>
          {t('Send FeedBack')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const Thura_Modal = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      <Image
        source={I.thura}
        style={{width: 150, height: 150}}
        resizeMode={'contain'}
      />
      <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>
        Developed By Thura Lin Htut
      </Text>
      <View style={{flexDirection: 'row', marginTop: 8}}>
        <TouchableOpacity
          style={{margin: 5}}
          onPress={() =>
            Linking.openURL('https://facebook.com/thuralinhtut.developer')
          }>
          <MIcons name={'facebook'} color={'#fff'} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{margin: 5}}
          onPress={() =>
            Linking.openURL('https://instagram.com/thuralinhtut__')
          }>
          <MIcons name={'instagram'} color={'#fff'} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{margin: 5}}
          onPress={() =>
            Linking.openURL('https://github.com/thuralinhtutxero')
          }>
          <MIcons name={'github'} color={'#fff'} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{margin: 5}}
          onPress={() => Linking.openURL('mailto:thuradevloper@gmail.com')}>
          <MIcons name={'gmail'} color={'#fff'} size={30} />
        </TouchableOpacity>
      </View>
      <Text
        style={{color: 'white', fontSize: 15, position: 'absolute', bottom: 1}}>
        Copyright Ⓒ 2022
      </Text>
    </View>
  );

  const OnCloseFbShow = () => setFbshow(!fbshow);
  const PostFeedBack = message => {
    axios
      .post('/api/feedback/', {message: message})
      .then(res => {
        console.log(res);
        OnCloseFbShow();
      })
      .catch(err => console.log(err));
  };

  const HandleVersionCount = () => {
    if (clickcount === 3) {
      setClickCount(0);
      setShowThura(true);
    } else {
      setClickCount(clickcount + 1);
    }
  };
  const onCloseShowThura = () => {
    setShowThura(!showthura);
    setClickCount(0);
  };

  return (
    <View style={styles.contianer}>
      <RenderChooseImageModal show={showmodal} />
      <MessageModalNormal show={fbshow} onClose={OnCloseFbShow}>
        {FeedbackModal()}
      </MessageModalNormal>
      <MessageModalNormal
        show={showthura}
        onClose={onCloseShowThura}
        width={'100%'}
        height={'100%'}
        radius={0}
        backgroundColor={'black'}>
        {Thura_Modal()}
      </MessageModalNormal>
      <ScrollView style={styles.contianer}>
        <View style={styles.profileimage}>
          <View
            style={{
              position: 'absolute',
              flexDirection: 'column',

              alignItems: 'center',
              bottom: '-50%',
            }}>
            <View style={{}}>
              <Image
                source={
                  pdata.profileimage
                    ? {
                        uri: axios.defaults.baseURL + pdata.profileimage,
                      }
                    : I.profile
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  borderColor: 'white',
                  borderWidth: 3,
                }}
                resizeMode="cover"
              />
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <Icon
                  name="camera"
                  style={{
                    position: 'absolute',
                    right: -5,
                    bottom: 0,
                    backgroundColor: 'white',
                    borderRadius: 100,
                    padding: 5,
                  }}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: '700',
                color: 'black',
              }}>
              {pdata.name}
            </Text>
            <Text>{pdata.username}</Text>
          </View>
        </View>
        <View style={{margin: 20, marginBottom: 2}}>
          <Text style={{color: 'black', fontSize: 16}}>{t('Profile')}</Text>
        </View>
        <View
          style={{
            marginTop: 0,
            borderColor: 'black',
            borderWidth: 0.8,
            margin: 20,
            borderRadius: 10,
            backgroundColor: '#f0f0f0',
          }}>
          <TouchableOpacity>
            <View style={styles.FirstButtonStyle}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {t('Name')}
              </Text>
              <Text style={styles.buttonFont}>{pdata.name}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.buttonColor}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {t('Username')}
              </Text>
              <Text style={styles.buttonFont}>{pdata.username}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.buttonColor}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {t('Phone_Number')}
              </Text>
              <Text style={styles.buttonFont}>{pdata.phoneno}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.buttonColor}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {t('Address')}
              </Text>
              <Text style={styles.buttonFont}>
                {pdata.address ? pdata.address : 'No Address'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.LastButtonStyle}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {t('Email')}
              </Text>
              <Text style={styles.buttonFont}>{pdata.email}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{margin: 20, marginBottom: 2}}>
          <Text style={{color: 'black', fontSize: 16}}>{t('Settings')}</Text>
        </View>
        <View
          style={{
            marginTop: 0,
            borderColor: 'black',
            borderWidth: 0.8,
            margin: 20,
            borderRadius: 10,
            backgroundColor: '#f0f0f0',
          }}>
          <View style={styles.FirstButtonStyle}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {t('Language')}
            </Text>
            <View style={{...s.flexrow_aligncenter}}>
              <Icons name={'language-outline'} size={30} color={'#000'} />
              <View style={{...s.flexrow_aligncenter}}>
                <TouchableOpacity
                  onPress={() =>
                    HandleSettings(
                      settings.language === 'en' ? 'mm' : 'en',
                      'language',
                    )
                  }>
                  <View style={{...s.flexrow_aligncenter, margin: 5}}>
                    <CheckBox
                      value={settings.language === 'en'}
                      onValueChange={e =>
                        HandleSettings(e === true ? 'en' : 'mm', 'language')
                      }
                    />
                    <Text style={{fontSize: 15, color: 'black', margin: 5}}>
                      English
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    HandleSettings(
                      settings.language === 'mm' ? 'en' : 'mm',
                      'language',
                    )
                  }>
                  <View style={{...s.flexrow_aligncenter, margin: 5}}>
                    <CheckBox
                      value={settings.language === 'mm'}
                      onValueChange={e =>
                        HandleSettings(e === true ? 'mm' : 'en', 'language')
                      }
                    />
                    <Text style={{fontSize: 15, color: 'black', margin: 5}}>
                      Myanmar
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity>
            <View style={styles.buttonColor}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {t('RTS')}
              </Text>
              <View style={{...s.flexrow_aligncenter}}>
                <Icons name={'calendar-outline'} size={30} color={'#000'} />
                <View style={{...s.flexrow_aligncenter}}>
                  <TouchableOpacity
                    onPress={() => HandleSettings('year', 'datascope')}>
                    <View style={{...s.flexrow_aligncenter, margin: 5}}>
                      <CheckBox
                        value={settings.datascope === 'year'}
                        onValueChange={e => HandleSettings('year', 'datascope')}
                      />
                      <Text style={{fontSize: 15, color: 'black', margin: 5}}>
                        {settings.datascope === 'year' ? 'Year' : 'Y'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => HandleSettings('month', 'datascope')}>
                    <View style={{...s.flexrow_aligncenter, margin: 5}}>
                      <CheckBox
                        value={settings.datascope === 'month'}
                        onValueChange={e =>
                          HandleSettings('month', 'datascope')
                        }
                      />
                      <Text style={{fontSize: 15, color: 'black', margin: 5}}>
                        {settings.datascope === 'month' ? 'Month' : 'M'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => HandleSettings('today', 'datascope')}>
                    <View style={{...s.flexrow_aligncenter, margin: 5}}>
                      <CheckBox
                        value={settings.datascope === 'today'}
                        onValueChange={e =>
                          HandleSettings('today', 'datascope')
                        }
                      />
                      <Text style={{fontSize: 15, color: 'black', margin: 5}}>
                        {settings.datascope === 'today' ? 'Today' : 'T'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log(pdata.is_superuser);
              navigation.navigate({
                name: pdata.is_superuser ? 'admin_pricing' : 'pricing',
                params: route.params,
              });
            }}>
            <View style={{...styles.buttonColor, borderBottomWidth: 1}}>
              <View style={{...s.flexrow_aligncenter}}>
                <Icons name={'card-outline'} size={30} color={'#000'} />
                <Text
                  style={{color: 'black', fontWeight: 'bold', marginLeft: 5}}>
                  Pricing
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFbshow(true)}>
            <View style={{...styles.buttonColor, borderBottomWidth: 1}}>
              <View style={{...s.flexrow_aligncenter}}>
                <Icons name={'mail-open-outline'} size={30} color={'#000'} />
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    marginLeft: 5,
                  }}>
                  Feedback
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => HandleVersionCount()}>
            <View style={{...styles.buttonColor, borderBottomWidth: 1}}>
              <View style={{...s.flexrow_aligncenter}}>
                <Image
                  source={I.app_logo}
                  style={{width: 30, height: 30}}
                  resizeMode={'contain'}
                />
                <Text
                  style={{color: 'black', fontWeight: 'bold', marginLeft: 5}}>
                  {t('App Version') + ' ' + appversion}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => a.aslogout(RemoveToken)}>
            <View style={styles.LastButtonStyle}>
              <View style={{...s.flexrow_aligncenter}}>
                <Icons name={'log-out-outline'} size={30} color={'#000'} />
                <Text
                  style={{color: 'black', fontWeight: 'bold', marginLeft: 5}}>
                  {t('Logout')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileimage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: C.windowWidth * 100,
    height: 150,
    backgroundColor: '#212529',
    marginBottom: '20%',
  },
  backgroundcover: {},
  chooseimagebutton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 5,
    borderRadius: 15,
  },
  chooseimagebutton_cancel: {
    padding: 10,

    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 5,
    borderRadius: 15,
  },
  buttonColor: {
    backgroundColor: '#f0f0f0',
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    padding: 8,
  },
  buttonFont: {
    color: 'black',
    fontSize: 15,
  },
  FirstButtonStyle: {
    backgroundColor: '#f0f0f0',
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    padding: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  LastButtonStyle: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
});

export default Profile;

const inputS = {
  ...s.flexrow_aligncenter_j_between,
  borderRadius: 15,
  minHeight: 45,
  maxHeight: 100,
  borderColor: 'black',
  borderWidth: 1.5,
  padding: 10,
  paddingRight: 10,
  marginTop: 10,
};
