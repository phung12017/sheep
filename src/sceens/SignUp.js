import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, StatusBar} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../assets/Color';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from '../firebase/api';
import database from '@react-native-firebase/database';
import ProgressDialog from 'react-native-progress-dialog';

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

      itemUrl: null,
      name: null,
      username: null,
      password: null,
      visible:false
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
    let ref = database().ref('users');

    const {name, username, password, uri} = this.state;

    if (uri === null) {
      alert('Please choose a photo !');
    } else {
      if (name === null || username === null || password === null) {
        alert('Please fill again !');
      } else {
        //check
        let query = ref.orderByChild('username').equalTo(username);

        query.once('value', sn => {
          if (sn.exists()) {
            alert('Account already exists');
          } else {
            this.createAccount(name, username, password, uri);
          }
        });
      }
    }
  };
  createAccount(name, u, p, uri) {

    this.setState({visible:true})

    let ref = database().ref('users');
    let key = ref.push().key;
    this.uploadImage(uri).then(url => {
      let photoRef = database().ref('photos');

      photoRef.push({
        photoURL: uri,
        uid: key,
      });

      ref
        .child(key)
        .set({  
          name: name,
          password: p,
          username: u,
          u_p: u + '_' + p,
          photoURL: url,
        })
        .then(() => {
          this.setState({visible:false})
          alert('Sign up successful');
          this.setState({
            avatarSource: null,
            uri: '',
            imageUrl: null,
            dataSource: null,
            itemUrl: null,
            name: null,
            username: null,
            password: null,
          });
        });
    });
  }

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
    const {name, username, password} = this.state;
    return (
      <View style={{backgroundColor: Color.white, flex: 1, padding: 24}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />

        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => this.props.navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Sign up</Text>

        <View style={{width: '100%', alignItems: 'center'}}>
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

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.updateProfile()}>
            <Text style={styles.txtButton}>Save</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
            }}>
            <Text>Already have account </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={{fontWeight: 'bold'}}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ProgressDialog visible={this.state.visible}/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnBack: {
    marginTop: 24,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
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
