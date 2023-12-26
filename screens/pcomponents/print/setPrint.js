/**
 * Created by januslo on 2018/12/27.
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  PermissionsAndroid,
  ScrollView,
  DeviceEventEmitter,
  NativeEventEmitter,
  Switch,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ToastAndroid,
  Modal,
} from 'react-native';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import EscPos from './escpos';
import Icon from 'react-native-vector-icons/Ionicons';
import EncryptedStorage from 'react-native-encrypted-storage';

var { height, width } = Dimensions.get('window');
export default class Home extends Component {
  _listeners = [];

  constructor() {
    super();
    this.state = {
      devices: null,
      pairedDs: [],
      foundDs: [],
      bleOpend: false,
      show_connect_custom_modal: false,
      loading: true,
      boundAddress: '',
      debugMsg: '',
      footerText: '',
      paperWidth: '',
    };
  }


  requestBluetoothConnectPermissions() {
    const granted = PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE])

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the Bluetooth');
    } else {
      console.log('Bluetooth permission denied');
    }
  }



  requestBluetoothScanPermissions() {


    const granted = PermissionsAndroid.request(PermissionsAndroid.BLUETOOTH_SCAN, {
      title: 'Bluetooth Permission',
      message: 'App needs Bluetooth permission for printer connection.',
      buttonPositive: 'OK',
      buttonNegative: 'Cancel',
    })
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the Bluetooth');
    } else {
      console.log('Bluetooth permission denied');
    }
  }

  requestBluetoothAdvertisePermissions() {
    const granted = PermissionsAndroid.request(PermissionsAndroid.BLUETOOTH_ADVERTISE, {
      title: 'Bluetooth Permission',
      message: 'App needs Bluetooth permission for printer connection.',
      buttonPositive: 'OK',
      buttonNegative: 'Cancel',
    })
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the Bluetooth');
    } else {
      console.log('Bluetooth permission denied');
    }
  }

  componentDidMount() {
    //alert(BluetoothManager)
    console.log("Component Did Mount")
    this.requestBluetoothConnectPermissions();
    // this.requestBluetoothScanPermissions();
    // this.requestBluetoothAdvertisePermissions();

    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        this.setState({
          bleOpend: Boolean(enabled),
          loading: false,
        });
      },
      err => {
        err;
      },
    );





    this._getFooterTextFromStorage();
    this._getPaperWidthFromStorage();


    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
          },
        ),
      );
    } else if (Platform.OS === 'android') {
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () => {
            ToastAndroid.show(
              'Device Not Support Bluetooth !',
              ToastAndroid.LONG,
            );
          },
        ),
      );
    }
  }

  componentWillUnmount() {
    //for (let ls in this._listeners) {
    //    this._listeners[ls].remove();
    //}
  }

  componentDidUpdate(prevProps, prevState) {
    // This block of code will run after the component updates
    // You can compare current props and state with previous props and state

    // Example: Check if a specific prop has changed
    if (this.state.bleOpend !== prevState.bleOpend) {
      console.log('searching..')
      BluetoothManager.enableBluetooth().then(
        r => {
          var paired = [];
          if (r && r.length > 0) {
            for (var i = 0; i < r.length; i++) {
              try {
                paired.push(JSON.parse(r[i]));
              } catch (e) {
                //ignore
              }
            }
          }
          this.setState({
            bleOpend: true,
            loading: false,
            pairedDs: paired,
          });
        },
        err => {
          this.setState({
            loading: false,
          });
          alert(err);
        },
      );
    }
  }


  _getFooterTextFromStorage = async () => {
    const footerText = await EncryptedStorage.getItem('footerText');
    if (footerText != null) {

      this.setState({ footerText: footerText });
    } else {
      this.setState({ footerText: 'Thanks for your shopping' });
    }
  }

  _setFooterTextToStorage = async (text) => {
    this.setState({ footerText: text })
    await EncryptedStorage.setItem('footerText', text);
  }

  _getPaperWidthFromStorage = async () => {
    const paperWidth = await EncryptedStorage.getItem('paperWidth');

    if (paperWidth != null) {
      this.setState({ paperWidth: paperWidth });
    } else {
      this.setState({ paperWidth: '800' });
    }
  }
  _setPaperWidthToStorage = async (width) => {
    this.setState({ paperWidth: width })
    await EncryptedStorage.setItem('paperWidth', width);
  }

  _deviceAlreadPaired(rsp) {
    var ds = null;
    if (typeof rsp.devices == 'object') {
      ds = rsp.devices;
    } else {
      try {
        ds = JSON.parse(rsp.devices);
      } catch (e) { }
    }
    if (ds && ds.length) {
      let pared = this.state.pairedDs;
      pared = pared.concat(ds || []);
      this.setState({
        pairedDs: pared,
      });
    }
  }

  _deviceFoundEvent(rsp) {
    //alert(JSON.stringify(rsp))
    var r = null;
    try {
      if (typeof rsp.device == 'object') {
        r = rsp.device;
      } else {
        r = JSON.parse(rsp.device);
      }
    } catch (e) {
      //alert(e.message);
      //ignore
    }
    //alert('f')
    if (r) {
      let found = this.state.foundDs || [];
      if (found.findIndex) {
        let duplicated = found.findIndex(function (x) {
          return x.address == r.address;
        });
        //CHECK DEPLICATED HERE...
        if (duplicated == -1) {
          found.push(r);
          this.setState({
            foundDs: found,
          });
        }
      }
    }
  }

  _renderRow(rows) {
    let items = [];
    for (let i in rows) {
      let row = rows[i];
      if (row.address) {
        items.push(
          <TouchableOpacity
            key={new Date().getTime() + i}
            style={styles.wtf}
            onPress={() => {
              this.setState({
                loading: true,
              });
              BluetoothManager.connect(row.address).then(
                s => {
                  this.setState({
                    loading: false,
                    boundAddress: row.address,
                    name: row.name || 'UNKNOWN',
                  });
                  EncryptedStorage.setItem(
                    'printer',
                    JSON.stringify({
                      boundAddress: row.address,
                      name: row.name || 'UNKNOWN',
                    }),
                  );
                },
                e => {
                  this.setState({
                    loading: false,
                  });
                  alert(e);
                },
              );
            }}>
            <Text style={styles.name}>{row.name || 'UNKNOWN'}</Text>
            <Text style={styles.address}>{row.address}</Text>
          </TouchableOpacity>,
        );
      }
    }
    return items;
  }

  render() {
    return (
      <ScrollView style={styles.container}>

        <View>
          <View style={{ ...styles.wtf, padding: 10 }}>
            <View>
              <Icon name="bluetooth" size={30} color="black" />
            </View>
            <Text style={{ color: 'black' }}>Bluetooth</Text>
            <Switch
              value={this.state.bleOpend}
              onValueChange={v => {
                this.setState({
                  loading: true,
                });
                if (!v) {
                  BluetoothManager.disableBluetooth().then(
                    () => {
                      this.setState({
                        bleOpend: false,
                        loading: false,
                        foundDs: [],
                        pairedDs: [],
                      });
                    },
                    err => {
                      alert(err);
                    },
                  );
                } else {
                  BluetoothManager.enableBluetooth().then(
                    r => {
                      var paired = [];
                      if (r && r.length > 0) {
                        for (var i = 0; i < r.length; i++) {
                          try {
                            paired.push(JSON.parse(r[i]));
                          } catch (e) {
                            //ignore
                          }
                        }
                      }
                      this.setState({
                        bleOpend: true,
                        loading: false,
                        pairedDs: paired,
                      });
                    },
                    err => {
                      this.setState({
                        loading: false,
                      });
                      alert(err);
                    },
                  );
                }
              }}
            />
          </View>
        </View>
        <Text style={styles.title}>
          Connected:
          <Text style={{ color: 'blue' }}>
            {!this.state.name ? 'No Devices' : this.state.name}
          </Text>
        </Text>
        <Text style={styles.title}>Paired:</Text>
        {this.state.loading ? <ActivityIndicator animating={true} /> : null}
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {this._renderRow(this.state.pairedDs)}
        </View>




        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>Paper Width (px)</Text>
          <TextInput
            multiline
            keyboardType="number-pad"
            style={{ padding: 4, borderColor: 'gray', borderWidth: 1 }}
            selectTextOnFocus={true}
            onChangeText={(text) => {
              this._setPaperWidthToStorage(text);
            }}
            value={this.state.paperWidth}
          />
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>Footer Text</Text>
          <TextInput
            multiline
            style={{ padding: 4, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(text) => {
              this._setFooterTextToStorage(text);
            }}
            value={this.state.footerText}
          />
        </View>
      </ScrollView>
    );
  }

  _selfTest() {
    this.setState(
      {
        loading: true,
      },
      () => {
        BluetoothEscposPrinter.selfTest(() => { });

        this.setState({
          loading: false,
        });
      },
    );
  }

  _scan() {
    this.setState({
      loading: true,
    });
    BluetoothManager.scanDevices().then(
      s => {
        var ss = s;
        var found = ss.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = this.state.foundDs;
        if (found && found.length) {
          fds = found;
        }
        this.setState({
          foundDs: fds,
          loading: false,
        });
      },
      er => {
        this.setState({
          loading: false,
        });
        alert('error' + JSON.stringify(er));
      },
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10,
  },

  title: {
    width: width,
    backgroundColor: '#eee',
    color: '#232323',
    paddingLeft: 8,
    paddingVertical: 4,
    textAlign: 'left',
  },
  wtf: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    textAlign: 'left',
    color: 'black',
  },
  address: {
    flex: 1,
    textAlign: 'right',
    color: 'black'
  },
});
