import React, {Component} from 'react';
import {View, Button, Text, TextInput, Image,StatusBar} from 'react-native';

import database from '@react-native-firebase/database';
 

export default class Login extends Component {
 

   render(){

     return(
     
     <View style={{flex:1,backgroundColor:'#fff'}}>
        <StatusBar
          translucent={true}
          backgroundColor={'#fff'}
          barStyle={'dark-content'}
        />
         <Text>Login</Text>
       </View>
     )
   }
}
