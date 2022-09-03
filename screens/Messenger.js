import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {IMAGE} from '../Database';
import Icon from 'react-native-vector-icons/Ionicons';
import {FlatList, TextInput} from 'react-native-gesture-handler';

const MessengerUI = () => {
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

  const Chat = ({item}) => {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        {profile(item.profilepic)}
        <View style={{marginLeft: 10}}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>{item.name}</Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: 'black'}}>{item.text}</Text>
          </View>
        </View>
      </View>
    );
  };
  const profile = url => {
    return (
      <View style={{borderRadius: 45, borderColor: 'blue', borderWidth: 2}}>
        <Image
          source={url}
          style={{
            width: 45,
            height: 45,
            borderRadius: 45,
            borderColor: 'white',
            borderWidth: 2,
          }}
          resizeMode={'contain'}
        />
        <View
          style={{
            position: 'absolute',
            right: 2,
            bottom: 0,
            backgroundColor: 'green',
            width: 10,
            height: 10,
            borderRadius: 5,
          }}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          padding: 15,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{padding: 5, backgroundColor: 'black', borderRadius: 50}}>
            <Image
              source={IMAGE.thura}
              style={{width: 30, height: 30}}
              resizeMode={'contain'}
            />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
              marginLeft: 10,
            }}>
            Chats
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.button}>
            <Icon name={'camera'} size={20} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name={'pencil'} size={20} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#f0f0f0',
              alignItems: 'center',
              margin: 10,
              padding: 5,
              borderRadius: 15,
            }}>
            <Icon name={'search'} size={20} color={'black'} />
            <TextInput style={styles.search} placeholder={'Search'} />
          </View>
        </View>
        <View>
          <ScrollView
            horizontal={true}
            style={{height: 75, position: 'absolute'}}>
            <View style={{flexDirection: 'row', height: 75}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 80,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#f0f0f0',
                    padding: 15,
                    borderRadius: 25,
                  }}>
                  <Icon name={'videocam'} size={25} color={'black'} />
                </TouchableOpacity>
                <Text style={{color: 'black'}}>Create Room</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 65,
                }}>
                {profile(IMAGE.lisa)}
                <Text style={{color: 'black'}}>Lisa</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 65,
                }}>
                {profile(IMAGE.charlie)}
                <Text style={{color: 'black'}}>Charlie</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 65,
                }}>
                {profile(IMAGE.jisoo)}
                <Text style={{color: 'black'}}>Jisoo</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 65,
                }}>
                {profile(IMAGE.selna)}
                <Text style={{color: 'black'}}>Selna</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <FlatList
          style={{marginTop: 80, padding: 10}}
          data={data}
          renderItem={Chat}
          keyExtractor={i => i.id}
        />
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Icon name={'chatbubble'} size={25} color={'black'} />
          <Text>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Icon name={'people-circle-outline'} size={25} color={'black'} />
          <Text>Group</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{alignItems: 'center'}}>
          <Icon name={'call-outline'} size={25} color={'black'} />
          <Text>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Icon name={'albums-outline'} size={25} color={'black'} />
          <Text>Stories</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    margin: 5,
  },
  search: {
    backgroundColor: '#f0f0f0',
    padding: 0,
    paddingLeft: 10,
    height: 30,
    fontSize: 15,
    borderRadius: 15,
  },
});

export default MessengerUI;
