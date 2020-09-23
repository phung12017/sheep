import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../firebase/api';
import RNFetchBlob from 'react-native-fetch-blob';
import {FlatList} from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
const numColumns = 3;
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

export default class uploadImage extends Component {
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
    };
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  setImageModalVisible = visible => {
    this.setState({ImagemodalVisible: visible});
  };

  componentDidMount() {
    let uid = this.props.route.params.uid;
    var mData =   database().ref('Album/'+uid);
    mData.on('value', dataSnapshot => {
      var list = [];
      dataSnapshot.forEach(child => {
        list.push({
          imageUrl: child.val().imageUrl,
        });
      });
      this.setState({
        dataSource: list,
      });
    
  })

  
  



}

  saveImageUrl = () => {
    let uid = this.props.route.params.uid;

    //create model
    const Pic = {
      imageUrl: this.state.imageUrl,
    };

    let ref = database().ref('users').child(uid)
    ref.update({

      photoURL:Pic.imageUrl
    })
  
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

  takeImage = () => {
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
  render() {
    return (
      <View style={styles.container}>
        <View>
          <LinearGradient
            style={styles.header}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#298A08', '#31B404', '#40FF00']}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />

              <View
                style={{
                  width: '70%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.text}>Thư Viện Ảnh</Text>
              </View>
            </View>
          </LinearGradient>

          {this.state.avatarSource ? (
            <Image source={this.state.avatarSource} style={styles.image} />
          ) : (
            <Image style={styles.image} />
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            height: 50,
            marginBottom: 15,
            justifyContent: 'space-around',
            width: '100%',
          }}>
          <TouchableOpacity onPress={this.takeImage}>
            <LinearGradient
              style={styles.takePic}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#D8D8D8', '#D8D8D8', '#D8D8D8']}>
              <Icon name="camera" size={25} color="black" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (this.state.avatarSource == null) {
                alert('Vui lòng chọn ảnh!');
              } else {
                this.setModalVisible(true);
                this.uploadImage(this.state.uri).then(url => {
                  this.setModalVisible(false);
                  this.setState({imageUrl: url});
                  this.saveImageUrl();
                  alert('Upload thành công!');
                });
              }
            }}>
            <LinearGradient
              style={styles.Upload}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#31B404', '#31B404', '#31B404']}>
              <Icon name="upload" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontFamily: 'icielflanton',
            fontSize: 25,
            marginHorizontal: width_modal * 0.05,
            fontWeight: 'bold',
            marginBottom: 10,
            marginTop: -10,
            color: '#172737',
          }}>
          Album
        </Text>

        {this.state.dataSource ? (
          <FlatList
            style={{
              marginHorizontal: width_modal * 0.05,
              width: '100%',
              marginBottom: 20,
              height: '100%',
            }}
            data={this.state.dataSource}
            keyExtractor={item => item.index}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    itemUrl: item.imageUrl,
                  }),
                    this.setImageModalVisible(true);
                }}>
                <View>
                  <Image
                    source={{
                      uri: item.imageUrl,
                    }}
                    resizeMode="cover"
                    style={{
                      width: width_modal * 0.295,
                      height: width_modal * 0.295,
                      marginRight: width_modal * 0.01,
                      marginBottom: width_modal * 0.01,
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
            numColumns={numColumns}
          />
        ) : (
          <View
            style={{
              padding: 50,
            }}>
            <ActivityIndicator size={'large'} color="green" />
          </View>
        )}
        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
            }}>
            <ActivityIndicator size={50} color="white" />
          </View>
        </Modal>

        {/* Image Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.ImagemodalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
            }}>
            <Image
              resizeMode="cover"
              source={{uri: this.state.itemUrl}}
              style={{
                backgroundColor: 'white',
                borderRadius: 5,
                height: width_modal * 0.85,
                width: width_modal * 0.85,
              }}
            />
            <View
              style={{
                height: 30,
                width: 35,
                borderRadius: 5,
                marginTop: -15,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
              }}>
              <Icon
                onPress={() => {
                  this.setState({ImagemodalVisible: false});
                }}
                name="window-close"
                size={35}
                color="#fff"
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const {width, height} = Dimensions.get('window');
const width_modal = width;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: 'icielflanton',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  header: {
    height: 50,
    justifyContent: 'center',
  },
  Upload: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: width_modal * 0.425,
    height: 45,
    borderRadius: 5,
    marginRight: width_modal * 0.05,
    marginLeft: width_modal * 0.025,
  },
  takePic: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: width_modal * 0.425,
    height: 45,
    borderRadius: 5,
    marginLeft: width_modal * 0.05,
    marginRight: width_modal * 0.025,
  },
  image: {
    margin: width_modal * 0.05,
    height: 300,
    width: '90%',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#172737',
    resizeMode: 'cover',
  },
});
