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

  np: require('./assets/image/logo.png'),
  loadgif: require('./assets/image/loading.gif'),
  spinnerloadgif: require('./assets/image/spinnerloading.gif'),
  profile: require('./assets/image/profile_images.jpeg'),
  viber: require('./assets/image/viber.png'),
  call: require('./assets/image/call.png'),
  fb: require('./assets/image/fb.png'),
  map: require('./assets/image/googlemaps.jpeg'),
  send: require('./assets/image/send.png'),
  send2: require('./assets/image/send2.png'),
  thura: require('./assets/image/i.png'),
  lisa: require('./assets/image/lisa.jpeg'),
  charlie: require('./assets/image/charlie.jpeg'),
  jisoo: require('./assets/image/jissio.jpeg'),
  selna: require('./assets/image/selna.jpeg'),
  rose: require('./assets/image/rose.jpg'),
  ig: require('./assets/image/instagram/iglogo.png'),

  pic1: require('./assets/image/instagram/pic1.jpg'),
  pic2: require('./assets/image/instagram/pic2.jpg'),
  pic3: require('./assets/image/instagram/pic3.jpg'),
  pic4: require('./assets/image/instagram/pic4.webp'),
  pic5: require('./assets/image/instagram/pic5.jpg'),
  pic6: require('./assets/image/instagram/pic6.png'),

  yt: require('./assets/image/youtube/youtube.png'),
  short: require('./assets/image/youtube/short.png'),
  stay: require('./assets/image/youtube/stay.jpeg'),
  allweknow: require('./assets/image/youtube/allweknow.jpeg'),
  mars: require('./assets/image/youtube/mars.jpeg'),
  mon: require('./assets/image/youtube/mon.jpeg'),
  saveme: require('./assets/image/youtube/saveme.jpeg'),
  choy: require('./assets/image/youtube/choy.jpeg'),
  ghost: require('./assets/image/youtube/ghost.jpeg'),

  jb: require('./assets/image/youtube/jb.jpeg'),
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
  sus: () =>
    Alert.alert('Successfully', 'Successfully Uploaded.', [{text: 'OK'}]),
};
export const numberWithCommas = (x = 0) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export const baseUrl = 'https://npweb.pythonanywhere.com';
export const appversion = '1.0';

export const isEdit = {
  isEdit: false,
  type: null,
  data: null,

  set ChangeEdit(n) {
    this.isEdit = n;
  },
  get getEdit() {
    return this.isEdit;
  },
  set setData(n) {
    this.data = n;
  },
  get getData() {
    return this.isEdit;
  },
  set setType(n) {
    this.type = n;
  },
  get getType() {
    return this.type;
  },
};
