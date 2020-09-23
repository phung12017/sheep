import React, {Component} from 'react';
import {View, Button, Text, AsyncStorage,TextInput, Image,StatusBar, StyleSheet} from 'react-native';

import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Color from '../assets/Color';
 
 


export default class Login extends Component {
 
  state={
    username:'phung12017',
    password:'123456',
  }

   

   login(u,p){
    const {navigation}= this.props

    if(String(u).length>0 && String(p).length>0){
      
      let ref = database().ref('users').orderByChild('u_p').equalTo(u+"_"+p)

      ref.once('value',sn=>{
        if(sn.exists()){
 
          var key = Object.keys(sn.val())[0];
          
           
                AsyncStorage.setItem(
                'uid',
                key
                
              );
             
          
          navigation.navigate('Dashboard', {
            screen: "Home",
            params: { uid:key},
          });



        }else{
          alert('Login fail')
        }
        
      })

    }else{
      alert('Please fill again')
    }

  }
   render(){

    const {username,password}=this.state

     return(
     


     <View style={{flex:1,backgroundColor:'#fff',padding:24}}>
      
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        
        <TouchableOpacity style={styles.btnBack} 
          onPress={()=>this.props.navigation.goBack()}
        >
          <Icon name="arrow-left" size={24}/>
        </TouchableOpacity>
      
        <Text style={styles.pageTitle}>Login</Text>

          <View style={{marginTop: 32}}>
              <Text style={styles.inputTitle}>Username</Text>
              <TextInput
                style={styles.input}
                onChangeText={username => this.setState({username: username})}
                value={username}
              />
          </View>

          <View style={{marginTop: 32}}>
              <Text style={styles.inputTitle}>Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={password => this.setState({password: password})}
                value={password}
                secureTextEntry
              />
          </View>

          
          <TouchableOpacity style={styles.button}
          
          onPress={()=>this.login(username,password)
          
            
          }
          
          >
            <Text style={styles.textButton}>Login</Text>
          </TouchableOpacity>

          <View style={{flexDirection:'row',justifyContent:'center',position:'absolute',bottom:24,right:24,left:24}}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              onPress={()=>this.props.navigation.navigate('Signup')}
            >
              <Text style={{fontWeight:'bold'}}>Sign up</Text>
            </TouchableOpacity>

          </View>
       </View>
     )
   }
}

const styles = StyleSheet.create({

  btnBack:{
    marginTop:24,
    marginBottom:24
  },
  pageTitle:{
    fontSize:28,
    fontWeight:'bold',
    marginBottom:32
  },
  input: {
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 2,
    color: Color.inputStyle,
    fontSize: 16,
  },
  inputTitle: {
    color: '#000',
    fontWeight: 'bold',
    opacity:0.3
    
  },
  button: {
    backgroundColor: Color.primary,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:32
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    paddingVertical:12
  },

})