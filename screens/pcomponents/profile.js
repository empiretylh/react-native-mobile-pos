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
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import axios from 'axios';
import Icons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import {IMAGE as I, COLOR as C} from '../../Database';
import {MessageModalNormal} from '../MessageModal';

const Icon = props => <Icons {...props} color={'#000'} />;

const Profile = ({navigation, route}) => {
  const [pdata, setPddata] = useState(null);
  const [showmodal, setShowModal] = useState(false);
  const [showeditmodal, setShowEditModal] = useState(false);
  const [editdata, setEditData] = useState(null);

  const [imagedata, setImageData] = useState([]);
  const [isPostSuccess, setIspostsuccess] = useState();

  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    LoadProfile();
  }, []);

  const LoadProfile = () => {
    setIsLoad(true);
    axios
      .get('/api/profile/')
      .then(res => {
        console.log(res.data);
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
          Change Profile Picture
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
            Take a Photo
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
            Choose Image
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
            Cancel
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

  console.log(route);

  let rdco;

  const randomcolor = () => {
    let maxVal = 0xffffff; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    console.log(randColor.toUpperCase());
    rdco = `#${randColor.toUpperCase()}`;
    return `#${randColor.toUpperCase()}`;
  };

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
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.contianer}>
      <RenderChooseImageModal show={showmodal} />

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
          <Text style={{color: 'black', fontSize: 16}}>Profile</Text>
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
              <Text style={{color: 'black', fontWeight: 'bold'}}>Name</Text>
              <Text style={styles.buttonFont}>{pdata.name}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.buttonColor}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Username</Text>
              <Text style={styles.buttonFont}>{pdata.username}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.buttonColor}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                Phone Number
              </Text>
              <Text style={styles.buttonFont}>{pdata.phoneno}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.LastButtonStyle}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Email</Text>
              <Text style={styles.buttonFont}>{pdata.email}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{margin: 20, marginBottom: 2}}>
          <Text style={{color: 'black', fontSize: 16}}>Settings</Text>
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
              <Text style={{color: 'black', fontWeight: 'bold'}}>Language</Text>
              <Text style={styles.buttonFont}>{pdata.name}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.buttonColor}>
              <Text style={{color: 'black', fontWeight: 'bold'}}></Text>
              <Text style={styles.buttonFont}>{pdata.phoneno}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.LastButtonStyle}>
            
              <Text style={{color: 'black', fontWeight: 'bold'}}>Logout</Text>
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
