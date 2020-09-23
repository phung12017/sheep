import React, {Component} from 'react';
import database from '@react-native-firebase/database'
import {
  View,
 
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

 
 
import Color from '../assets/Color';
 
export default class UploadName extends Component {
  state = {
    name: '',
    uid: this.props.route.params.uid,
  };

  updateLocation = async n => {
     
    let uid = this.state.uid;

    //this.props.navigation.navigate('UploadLocation')
   await database()
      .ref('users/')
      .child(uid)
      .update({
        location: n,
      }).then(()=>{
        
        this.props.navigation.navigate('UploadImage')
       
      })
      
  };

  render() {
    const {name} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Color.white}}>
        <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
        <View style={{paddingHorizontal: 32}}>
          <Text style={styles.title}>Location </Text>
          <TextInput
            style={{
              marginTop: 15,
              marginBottom: 15,
              borderBottomColor: Color.primary,
              borderBottomWidth: 3,
              color: Color.inputStyle,
              fontSize: 20,
            }}
            onChangeText={name => this.setState({name: name})}
            value={name}
          />
          <TouchableOpacity
            style={{
              backgroundColor: Color.primary,
              padding: 15,
              alignItems: 'center',
              borderRadius: 444,
              marginVertical: 32,
            }}
            onPress={() => this.updateLocation(name)}>
            <Text style={{color: Color.white, fontWeight: '700'}}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 32,
  },
});
