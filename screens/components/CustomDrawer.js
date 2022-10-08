import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {IMAGE} from '../../Database';
import {TouchableOpacity} from 'react-native-gesture-handler';
const CustomDrawer = props => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 5,
          backgroundColor: '#486575',
        }}>
        <Image source={IMAGE.fb} style={styles.pfimage} />
        <View>
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
              Thura Lin Htut
            </Text>
            <Text style={{fontSize: 15, color: 'white'}}>09796632873</Text>
          </View>
        </View>
      </View>
      <DrawerContentScrollView>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{flex: 1, position: 'absolute', bottom: 0}}>
        <TouchableOpacity>
          <Text>LogOut</Text>
        </TouchableOpacity>
        <Text>Version 1.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pfimage: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
});

export default CustomDrawer;
