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
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  width: 40,
                  height: 40,
                  borderRadius: 45,
                  borderColor: 'white',
                  borderWidth: 2,
                }}
                resizeMode={'contain'}
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {item.username}
              </Text>
              <Text style={{fontSize: 12}}>{item.info}</Text>
            </View>
          </View>
          <Icon name={'ellipsis-vertical-outline'} size={25} color={'black'} />
        </View>
        <Image
          source={item.pic}
          style={{width: COLOR.windowWidth * 100, height: 300}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={{padding: 2}}>
              <Icon name={'heart-outline'} size={25} color={'black'} />
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 2}}>
              <Icon name={'chatbubble-outline'} size={25} color={'black'} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name={'paper-plane-outline'} size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Icon name={'bookmark-outline'} size={25} color={'black'} />
          </TouchableOpacity>
        </View>
        <Text style={{fontSize: 13}}>liked by .. and {item.react} others</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'blue', fontSize: 13}}>@{item.username}</Text>
          <Text style={{color: 'black', fontSize: 13}}> {item.caption}</Text>
        </View>
      </View>
    );
  };

  const Post = () => {
    return (
      <View style={{margin: 5, flex: 1}}>
        <FlatList
          data={post}
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

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
          alignItems: 'center',
        }}>
        <Image
          source={IMAGE.ig}
          style={{width: 100, height: 40}}
          resizeMode={'contain'}
        />
        <View style={{flexDirection: 'row'}}>
          <Icon
            name={'heart-outline'}
            size={20}
            color={'#000'}
            style={{marginLeft: 5, padding: 3}}
          />
          <Icon
            name={'paper-plane-outline'}
            size={20}
            color={'#000'}
            style={{marginLeft: 5, padding: 3}}
          />
        </View>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{margin: 5}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{}}>
              <View
                style={{
                  flexDirection: 'column',
                  width: 55,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    padding: 8,
                    backgroundColor: 'black',
                    borderRadius: 50,
                    alignItems: 'center',
                  }}>
                  <Image source={IMAGE.thura} style={{width: 40, height: 40}} />
                  <View
                    style={{
                      padding: 2,
                      backgroundColor: 'skyblue',
                      borderRadius: 25,
                      position: 'absolute',
                      bottom: -2,
                      right: -4,
                      borderColor: 'white',
                      borderWidth: 3,
                    }}>
                    <Icon name={'add'} size={15} color={'#fff'} />
                  </View>
                </View>
                <Text>Your Story</Text>
              </View>
            </View>
            <FlatList
              horizontal
              data={data}
              renderItem={profile}
              initialNumToRender={2} // Reduce initial render amount
              maxToRenderPerBatch={1} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
            />
          </View>
        </View>

        {/* post */}
        {Post()}
      </ScrollView>
    </View>
  );
};

export default Home;
