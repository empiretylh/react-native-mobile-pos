import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {IMAGE, COLOR} from '../../Database';
import Icon from 'react-native-vector-icons/Ionicons';

import Icon2 from 'react-native-vector-icons/FontAwesome5Pro';
const Home = () => {
  const data = [
    {
      id: 1,
      name: 'Charlie',
      active: true,
      profilepic: IMAGE.charlie,
      text: 'Hello',
    },
    {
      id: 2,
      name: 'Lisa',
      active: true,
      profilepic: IMAGE.lisa,
      text: 'hey',
    },
    {
      id: 3,
      name: 'Rose',
      active: true,
      profilepic: IMAGE.rose,
      text: 'Wanna Date?',
    },
    {
      id: 6,
      name: 'Jisso',
      active: true,
      profilepic: IMAGE.jisoo,
      text: 'See you',
    },
    {
      id: 4,
      name: 'Selna',
      active: true,
      profilepic: IMAGE.selna,
      text: 'I wanna tell you something',
    },
    {
      id: 5,
      name: 'facebook',
      active: true,
      profilepic: IMAGE.fb,
      text: 'Is Clone?',
    },
  ];

  const post = [
    {
      id: 1,
      username: 'lalisa_mm',
      profilepic: IMAGE.lisa,
      info: 'South Korea',
      caption: 'Today Mood',
      pic: IMAGE.pic1,
      react: 1000,
    },
    {
      id: 2,
      username: 'rose',
      profilepic: IMAGE.rose,
      info: 'Sponser',
      caption: 'I  am Spider',
      pic: IMAGE.pic2,
      react: 50,
    },
    {
      id: 3,
      username: 'selna',
      profilepic: IMAGE.selna,
      info: 'Sponser',
      caption: 'MCU ',
      pic: IMAGE.pic5,
      react: 250,
    },
    {
      id: 4,
      username: 'jisoo',
      profilepic: IMAGE.jisoo,
      info: 'Sponser',
      caption: 'blackpink in instagram clone  ',
      pic: IMAGE.pic4,
      react: 250,
    },
    {
      id: 5,
      username: 'charlie',
      profilepic: IMAGE.charlie,
      info: 'North America',
      caption: 'MCU ',
      pic: IMAGE.pic3,
      react: 250,
    },
  ];

  const mix = [
    {
      id: 1,
      pic: IMAGE.ghost,
      text: 'Mix - Electronic music',
      info: 'Justin Bebier and more',
    },
  ];

  const vdata = [
    {
      id: 1,
      pic: IMAGE.choy,
      profilepic: IMAGE.charlie,
      title: 'Charlie Puth - Cheating On You',
      info: 'Charlie Puth . 256M views . 3 years ago',
    },
    {
      id: 2,
      pic: IMAGE.allweknow,
      profilepic: IMAGE.rose,
      title: 'The Chainsmokers - All We Know ft. Phoebe Ryan',
      info: 'The Chainsmokers . 15M views . 6 years ago',
    },
    {
      id: 3,
      pic: IMAGE.mars,
      profilepic: IMAGE.nasa,
      title: 'We will destory this planet (MARS)',
      info: 'NASA . 15K views . 1 Month ago',
    },
    {
      id: 4,
      pic: IMAGE.mon,
      profilepic: IMAGE.thura,
      title: 'MIDDLE OF THE NIGHT',
      info: '7 Clouds . 100K views . 1 day ago',
    },
    {
      id: 5,
      pic: IMAGE.saveme,
      profilepic: IMAGE.lisa,
      title: 'DEAMN - Save Me',
      info: '7 Clouds . 100K views . 2 day ago',
    },
  ];

  const profile = ({item}) => {
    return (
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            borderRadius: 50,
            borderColor: 'red',
            borderWidth: 2,
            margin: 2,
          }}>
          <Image
            source={item.profilepic}
            style={{
              width: 50,
              height: 50,
              borderRadius: 45,
              borderColor: 'white',
              borderWidth: 2,
            }}
          />
        </View>
        <Text>{item.name}</Text>
      </View>
    );
  };

  const postItem = ({item}) => {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <Image
            source={item.pic}
            style={{width: COLOR.windowWidth * 100, height: 155}}
          />
          <View style={{backgroundColor: '#3e5282', alignItems: 'center'}}>
            <Icon name={'radio'} size={25} color={'#fff'} />
          </View>
        </View>
        <View style={{padding: 10}}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
            {item.text}
          </Text>
          <Text style={{fontSize: 13, color: 'black'}}>{item.info}</Text>
        </View>
      </View>
    );
  };

  const shortItem = ({item}) => {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            width: 150,
            height: 250,
            margin: 10,
            backgroundColor: 'black',
          }}>
          <Image source={item.pic} style={{width: 150, height: 245}} />
          <Text
            style={{
              color: 'white',
              position: 'absolute',
              fontSize: 14,
              fontWeight: 'bold',
              bottom: 5,
              padding: 5,
            }}>
            {item.title}
          </Text>
          <Icon
            name={'ellipsis-vertical-outline'}
            size={20}
            color={'#fff'}
            style={{position: 'absolute', top: 5, right: 5}}
          />
        </View>
      </View>
    );
  };

  const VideoItem = ({item}) => {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <Image
            source={item.pic}
            style={{width: COLOR.windowWidth * 100, height: 155}}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
          <Image
            source={item.profilepic}
            style={{width: 40, height: 40, borderRadius: 40}}
            P
          />

          <View style={{padding: 10}}>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
              {item.title}
            </Text>

            <Text style={{fontSize: 13}}>{item.info}</Text>
          </View>
        </View>
      </View>
    );
  };
  const Mix = () => {
    return (
      <View style={{marginBottom: 10}}>
        <FlatList
          data={mix}
          renderItem={postItem}
          scrollEnabled={true}
          keyExtractor={i => i.id}
          initialNumToRender={2} // Reduce initial render amount
          maxToRenderPerBatch={1} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
        />
      </View>
    );
  };

  const Video = () => {
    return (
      <View style={{marginBottom: 10}}>
        <FlatList
          data={vdata}
          renderItem={VideoItem}
          scrollEnabled={true}
          keyExtractor={i => i.id}
          initialNumToRender={2} // Reduce initial render amount
          maxToRenderPerBatch={1} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
        />
      </View>
    );
  };
  const Short = () => {
    return (
      <View style={{marginBottom: 10}}>
        <FlatList
          horizontal
          data={vdata}
          renderItem={shortItem}
          scrollEnabled={true}
          keyExtractor={i => i.id}
          initialNumToRender={2} // Reduce initial render amount
          maxToRenderPerBatch={1} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
        />
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 5,
          backgroundColor: 'white',
        }}>
        <Image
          source={IMAGE.yt}
          style={{width: 100, height: 25}}
          resizeMode={'contain'}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon2
            name={'chromecast'}
            size={25}
            color={'#000'}
            style={{margin: 10}}
          />
          <Icon
            name={'notifications-outline'}
            size={25}
            color={'#000'}
            style={{margin: 10}}
          />
          <Icon
            name={'search-outline'}
            size={25}
            color={'#000'}
            style={{margin: 10}}
          />
          <Image
            source={IMAGE.charlie}
            style={{width: 40, height: 40, borderRadius: 50}}
            resizeMode={'contain'}
          />
        </View>
      </View>
      <View style={{backgroundColor: 'white'}}>
        <ScrollView horizontal>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              backgroundColor: '#f0f0f0',
              borderRadius: 15,
              margin: 5,
              marginBottom:10,
            }}>
            <Icon name={'compass-outline'} size={25} color={'#000'} />
            <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              Explore
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              backgroundColor: '#f0f0f0',
              borderRadius: 15,
              margin: 5,
            }}>
            <Text style={{color: 'black', fontSize: 18}}> Mixes</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              backgroundColor: '#f0f0f0',
              borderRadius: 15,
              margin: 5,
            }}>
            <Text style={{color: 'black', fontSize: 18}}> Music</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              backgroundColor: '#f0f0f0',
              borderRadius: 15,
              margin: 5,
            }}>
            <Text style={{color: 'black', fontSize: 18}}> Electronic</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              backgroundColor: '#f0f0f0',
              borderRadius: 15,
              margin: 5,
            }}>
            <Text style={{color: 'black', fontSize: 18}}> Sports</Text>
          </View>
        </ScrollView>
      </View>
      <ScrollView style={{backgroundColor: '#f0f0f0', flex: 1}}>
        {Mix()}
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: 'white',
              padding: 5,
            }}>
            <Image source={IMAGE.short} style={{width: 25, height: 25}} />
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
              {' '}
              Shorts
            </Text>
          </View>

          {Short()}
          {Video()}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
