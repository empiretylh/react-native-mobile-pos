import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {IMAGE} from '../Database';
const  Setting = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
          Setting
        </Text>

        <Image
          source={IMAGE.thura}
          style={{width: 40, height: 40, borderRadius: 50}}
        />
      </View>
      <View style={styles.userdebtinfo}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  appbar: {
    padding: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userdebtinfo: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
});

export default Setting