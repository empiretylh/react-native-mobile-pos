import {Dimensions, StyleSheet, Alert} from 'react-native';

export const COLOR = {
  backgroundcolor: '#f0f0f0',
  white: '#fff',
  black: '#000000',
  textmuted: '#656363',
  blackbutton: '#323232',
  textfield: '#C4C4C4',
  bluecolor: '#0d6efd',
  windowWidth: Dimensions.get('window').width / 100,
  windowHeight: Dimensions.get('window').height / 100,
};

export const STYLE = StyleSheet.create({
  font_bold: {
    fontWeight: 'bold',
  },
  normal_label: {
    color: 'black',
    fontSize: 16,
  },
  bold_label: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  Container: {
    flex: 1,
    backgroundColor: COLOR.white,
    padding: 8,
  },
  defaultTextInput: {
    backgroundColor: COLOR.white,
    borderBottomColor: COLOR.black,
    borderBottomWidth: 1,
    padding: 1,
    margin: 5,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Pyidaungsu-Book',
  },

  textInputnormal: {
    fontSize: 16,
    fontWeight: '900',
    flex: 1,
  },

  blue_button: {
    backgroundColor: COLOR.bluecolor,
    padding: 8,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  black_button: {
    backgroundColor: COLOR.blackbutton,
    padding: 8,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  flexrow_aligncenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexrow_aligncenter_j_between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexrow_aligncenter_j_center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const IMAGE = {
  d1: require('./assets/color/d1.png'),
  d2: require('./assets/color/d2.png'),
  d3: require('./assets/color/d3.png'),
  d4: require('./assets/color/d4.png'),

  app_logo: require('./assets/image/app_logo.png'),

  thura: require('./assets/image/i.png'),

  spinnerloadgif: require('./assets/image/spinnerloading.gif'),
  profile: require('./assets/image/profile_images.jpeg'),
};

export const ALERT = {
  rqf: () => Alert.alert('', 'Please fill require fields.', [{text: 'OK'}]),
  lqy: () => Alert.alert('', 'Limited Qty', [{text: 'OK'}]),
  spe: () => Alert.alert('Error', 'Cannot connect to server', [{text: 'OK'}]),
  asc: yes =>
    Alert.alert('', 'Are you sure want to close?', [
      {text: 'Yes', onPress: yes},
      {text: 'No'},
    ]),
  aslogout: yes =>
    Alert.alert('', 'Are you sure want to Logout?', [
      {text: 'Yes', onPress: yes},
      {text: 'No'},
    ]),
  sus: () =>
    Alert.alert('Successfully', 'Successfully Uploaded.', [{text: 'OK'}]),
  c_b: () =>
    Alert.alert(
      'Error',
      'The package cannot be purchased after the plan has been requested.',
      [{text: 'OK'}],
    ),
};
export const numberWithCommas = (x = 0) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const isArrayhasData = (arr = []) => {
  return arr.length >= 1;
};

export const baseUrl = 'https://empirepos.pythonanywhere.com';

// export const baseUrl = 'http://192.168.43.247:8000';
export const appversion = '1.0';
