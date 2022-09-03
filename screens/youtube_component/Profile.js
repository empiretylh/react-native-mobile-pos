/* eslint-disable react-native/no-inline-styles */
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

const Profile = () => {
  const Imaged = [
    {id: 1, pic: IMAGE.pic1},
    {id: 2, pic: IMAGE.pic2},
    {id: 3, pic: IMAGE.pic3},
    {id: 4, pic: IMAGE.pic4},
    {id: 5, pic: IMAGE.pic6},
    {id: 6, pic: IMAGE.pic5},
    {id: 7, pic: IMAGE.thura},
  ];

  const Item = ({item}) => {
    return (
      <View style={{margin: 2}}>
        <Image
          source={item.pic}
          style={{
            width: (COLOR.windowWidth * 100) / 3,
            height: (COLOR.windowWidth * 100) / 3,
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
          margin: 5,
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
          thuralinhtut__
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Icon name={'add'} size={25} color={'#000'} style={{padding: 5}} />
          <Icon name={'list'} size={25} color={'#000'} style={{padding: 5}} />
        </View>
      </View>
      <ScrollView>
        <View style={{margin: 5, padding: 5}}>
          <View style={{margin: 10}}>
            <View style={{flexDirection: 'row'}}>
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
                </View>
              </View>
              <View style={{marginLeft: 30, flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text
                    style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
                    7
                  </Text>
                  <Text style={{color: 'black', fontSize: 16}}>Posts</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}>
                  <Text
                    style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
                    54 M
                  </Text>
                  <Text style={{color: 'black', fontSize: 16}}>Followers</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}>
                  <Text
                    style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
                    0
                  </Text>
                  <Text style={{color: 'black', fontSize: 16}}>Following</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Text
              Text
              style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
              Thura Lin Htut
            </Text>
            <Text Text style={{color: 'black', fontSize: 15}}>
              Create your own Empire
            </Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: '#f0f0f0',
                alignItems: 'center',
                borderRadius: 15,
                flexGrow: 2,
              }}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                {' '}
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: '#f0f0f0',
                alignItems: 'center',
                borderRadius: 15,
                flexGrow: 0,
              }}>
              <Icon name={'people-outline'} size={20} color={'#000'} />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, margin: 10}}>
            <View
              style={{
                flexDirection: 'column',
                width: 55,
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  borderRadius: 50,
                  borderColor: 'black',
                  borderWidth: 2,
                  alignItems: 'center',
                }}>
                <Icon name={'add'} color={'#000'} size={30} />
              </View>
              <Text>Add</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              margin: 10,
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
              }}>
              <Icon
                name={'grid'}
                size={25}
                color={'#000'}
                style={{
                  padding: 10,
                }}
              />
            </View>
            <Icon
              name={'people-outline'}
              size={25}
              color={'#000'}
              style={{padding: 10}}
            />
          </View>
          <View style={{margin: 5}}>
            <FlatList data={Imaged} renderItem={Item} numColumns={3} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
