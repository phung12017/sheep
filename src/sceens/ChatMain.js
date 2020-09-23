import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, AsyncStorage,Image} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../assets/Color';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class ChatMain extends Component {
  state = {
    chats: [],

    user:{
      uid:''
    }

  };

  componentDidMount() {

    this._retrieveData()
 
    

  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('uid');
      if (value !== null) {
        // We have data!!
        
          this.setState({user:{
            uid:value,
          }}) 
          if(this.state.user.uid != null){

          

          this.getChatList(value)
          }
         
      }
    } catch (error) {
      // Error retrieving data
    }
  };

   getChatList(uid){

    let ref = database().ref('users')

      ref.on('value',sn=>{
      let items =[]
      sn.forEach(userSnap=>{
        
        if(userSnap.key!=uid){

          let item = {
            uid: userSnap.key,
            name: userSnap.child('name').val(),
            photoURL: userSnap.child('photoURL').val(),
            lastMess:'Lorem Ipsndard dummy text ever since the 1500, when an unknown  printer took a galley of type a...'
          };

          items.push(item);

          this.setState({chats: items});
          
        }

      })
 
    })
    
 
  
  }
   
  

  renderItem(item) {
    
     const {user} = this.state;

 
     

    return (
      <TouchableOpacity
        style={{flexDirection: 'row',marginBottom:16}}
        onPress={() =>
          this.props.navigation.navigate('ChatMess', {user: user, person: item})
        }>
        <Image
          source={{uri: item.photoURL}}
          style={{width: 54, height: 54, marginRight: 12,borderRadius:555}}
        />
        <View>
           <Text style={{color:Color.primary}}>{item.name}</Text>
           <Text style={{fontWeight:'bold'}}>{item.lastMess}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
     return (
      <View style={{flex:1,backgroundColor:"#fff",paddingHorizontal:24}}>
       
      
        <Text style={{marginTop:32}}></Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          data={this.state.chats}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={item => item.id}
        />  
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 3,
  },
  button: {
    backgroundColor: Color.primary,
    padding: 15,
    alignItems: 'center',
    marginVertical: 32,
  },
  buttonDisable: {
    backgroundColor: Color.primary,
    padding: 15,
    alignItems: 'center',
    marginVertical: 32,
    opacity: 0.5,
  },
  textButton: {
    color: Color.white,
  },
});
