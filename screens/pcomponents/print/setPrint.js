/**
 * Created by januslo on 2018/12/27.
 */

import React, {Component} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
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

var {height, width} = Dimensions.get('window');
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
    };
  }

  componentDidMount() {
    //alert(BluetoothManager)
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

  _deviceAlreadPaired(rsp) {
    var ds = null;
    if (typeof rsp.devices == 'object') {
      ds = rsp.devices;
    } else {
      try {
        ds = JSON.parse(rsp.devices);
      } catch (e) {}
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
        <Modal visible={this.state.show_connect_custom_modal}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Connect Custom
            </Text>
            <TextInput
              placeholder="Enter Printer Name"
              onChangeText={text => {
                this.setState({
                  name: text,
                });
              }}
            />
            <TextInput
              placeholder="Enter Bound Address"
              onChangeText={text => {
                this.setState({
                  boundAddress: text,
                });
              }}
            />

            <Button
              title="Connect"
              onPress={() => {
                EncryptedStorage.setItem(
                  'printer',
                  JSON.stringify({
                    boundAddress: this.state.boundAddress,
                    name: this.state.name,
                  }),
                );
                this.setState({
                  show_connect_custom_modal: false,
                });
                BluetoothManager.connect(this.state.boundAddress).then(
                  s => {
                    this.setState({
                      loading: false,
                      boundAddress: this.state.boundAddress,
                      name: this.state.name || 'UNKNOWN',
                    });
                  },
                  e => {
                    this.setState({
                      loading: false,
                    });
                    alert(e);
                  },
                );
              }}
            />
          </View>
        </Modal>

        <View>
          <View style={{...styles.wtf, padding: 10}}>
            <View>
              <Icon name="bluetooth" size={30} color="black" />
            </View>
            <Text style={{color: 'black'}}>Bluetooth</Text>
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
          <Button
            disabled={this.state.loading || !this.state.bleOpend}
            onPress={() => {
              this.setState({
                show_connect_custom_modal: true,
              });
            }}
            title="Connect Custom"
          />
          <Button
            disabled={this.state.loading || !this.state.bleOpend}
            onPress={() => {}}
            title="Scan"
          />
        </View>
        <Text style={styles.title}>
          Connected:
          <Text style={{color: 'blue'}}>
            {!this.state.name ? 'No Devices' : this.state.name}
          </Text>
        </Text>
        <Text style={styles.title}>Found(tap to connect):</Text>
        {this.state.loading ? <ActivityIndicator animating={true} /> : null}
        <View style={{flex: 1, flexDirection: 'column'}}>
          {this._renderRow(this.state.foundDs)}
        </View>
        <Text style={styles.title}>Paired:</Text>
        {this.state.loading ? <ActivityIndicator animating={true} /> : null}
        <View style={{flex: 1, flexDirection: 'column'}}>
          {this._renderRow(this.state.pairedDs)}
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
        BluetoothEscposPrinter.selfTest(() => {});

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
  },
  address: {
    flex: 1,
    textAlign: 'right',
  },
});
