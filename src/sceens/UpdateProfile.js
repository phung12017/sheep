import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, StatusBar} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../assets/Color';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from '../firebase/api';
import database from '@react-native-firebase/database';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
const options = {
  title: 'Select Image',
  //customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
      uri: null,
      imageUrl: null,
      dataSource: null,
      modalVisible: false,
      ImagemodalVisible: false,
      itemUrl: null,
      uid: this.props.route.params.uid,
    };
  }

  pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          uri: response.uri,
        });
      }
    });
  };

  updateProfile = () => {

 

    this.uploadImage(this.state.uri).then(url => {
   
        let uid = this.state.uid

        let ref = database().ref('users').child(uid)

        ref.update({
            name:this.state.name,
            photoURL:url,
            location:this.state.location
        })
        console.log("finish");
        
        this.props.navigation.navigate("Dashboard")
     
    });
  };

 


  uploadImage = (uri, mime = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
      let imgUri = uri;
      let uploadBlob = null;
      const uploadUri =
        Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
      const Id = new Date().getTime();
      const imageRef = firebase
        .storage()
        .ref('images')
        .child(`${Id}.jpg`);

      fs.readFile(uploadUri, 'base64')
        .then(data => {
          return Blob.build(data, {type: `${mime};BASE64`});
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, {contentType: mime});
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
        })

        .catch(error => {
          reject(error);
        });
    });
  };

  render() {

     
    const {name, location} = this.state;
    return (
      <View style={{backgroundColor: Color.white, flex: 1}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text style={styles.title}>
            {'Hello!\nUpload Profile to get started'}
          </Text>

          <View style={{position: 'relative'}}>
            <Image style={styles.image} source={this.state.avatarSource} />
            <View
              style={{
                position: 'absolute',
                bottom: -10,
                right: -10,
                borderRadius: 500,
              }}>
              <TouchableOpacity
                style={styles.add}
                onPress={() => this.pickImage()}>
                <Icon name="plus" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          
        </View>

        <View style={styles.form}>
          <View style={{marginTop: 32}}>
            <Text style={styles.inputTitle}>Full name</Text>
            <TextInput
              style={styles.input}
              onChangeText={name => this.setState({name: name})}
              value={name}
            />
          </View>

          <View style={{marginTop: 32}}>
            <Text style={styles.inputTitle}>Location</Text>
            <TextInput
              style={styles.input}
              onChangeText={location => this.setState({location: location})}
              value={location}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.updateProfile()}>
            <Text style={styles.txtButton}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 32,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: '#ccc',
  },
  input: {
    borderBottomColor: '#dadada',
    borderBottomWidth: 2,
    color: Color.inputStyle,
    fontSize: 16,
  },
  inputTitle: {
    color: '#DADADA',
    fontWeight: 'bold',
  },
  add: {
    width: 40,
    height: 40,
    backgroundColor: Color.primary,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: Color.white,
  },
  form: {
    paddingHorizontal: 32,
  },
  button: {
    backgroundColor: Color.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  txtButton: {
    color: Color.white,
    fontWeight: 'bold',
  },
});
