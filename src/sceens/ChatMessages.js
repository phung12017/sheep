import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Image,
} from 'react-native';
import {
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import database from '@react-native-firebase/database';
import Color from '../assets/Color';
 

 

export default class ChatMess extends Component {
  state = {

    user:{
      uid:this.props.route.params.user.uid,
    },

    
    person: {
      name: this.props.route.params.person.name,
      photoURL: this.props.route.params.person.photoURL,
      uid: this.props.route.params.person.uid,
    },


    textMessage: '',
    messageList: [],
    dbRef: database().ref('messages'),
    
  };

  componentDidMount() {
   this.readMessage();
  }

    readMessage() {
    
    const {user,person}=this.state

      this.state.dbRef
      .child(user.uid)
      .child(person.uid)
      .on('value', snapshot => {
        const messages = [];
        snapshot.forEach(function(doc) {
          messages.push({
            key: doc.key,
            from: doc.child('from').val(),
            message: doc.child('message').val(),
      
          });

         });

        this.setState({messageList: messages});

         
      });
  }

  async sendMessage(textMessage) {

    const {user,person}= this.state

    if(String(textMessage).length>0){
      
      let msgId = this.state.dbRef.child(user.uid).child(person.uid).push().key
      
      let updates = {}
      
      let message = {
        message: textMessage,
        from: user.uid
      }

    updates[user.uid + '/' + person.uid+ '/' + msgId] = message;
    
    updates[person.uid + '/' + user.uid+ '/' + msgId] = message;

    this.state.dbRef.update(updates);

    this.setState({textMessage: ''});

    }

  }
 

  renderItem(item) {
    if (item.from === this.state.user.uid) {
      return (
        <View style={{flexDirection: 'row', alignSelf: 'flex-end',margin:4}}>
          <Text
            style={{
              backgroundColor: Color.primary,
              color: '#fff',
              borderRadius: 16,
              maxWidth: '60%',
              padding: 12,
              marginBottom: 4,
            }}>
            {item.message}
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignSelf: 'flex-start',
            position: 'relative',
            marginBottom: 8,
            marginLeft:4
          }}>
          <Text
            style={{
              backgroundColor: '#f1f1f1',
              color: '#000',
              borderRadius: 16,
              maxWidth: '60%',
              padding: 24,
              marginBottom: 4,
            }}>
            {item.message}
          </Text>

          <Image
            source={{
              uri: this.state.person.photoURL,
            }}
            style={{
              position: 'absolute',
              width: 24,
              height: 24,
              left: 0,
              bottom: 0,
              borderRadius: 20,
            }}
          />
        </View>
      );
    }
  }
  render() {
   
    const {name, photoURL} = this.state.person;

    const{textMessage}= this.state
    
    return (
      <View
        style={{flex: 1, backgroundColor: '#272D69', flexDirection: 'column',}}>
        {/* Status Bar */}
        <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
        {/* Status Bar */}

        {/* Top Coitainer   */}
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-left" size={24} />
          </TouchableOpacity>
          <Image style={styles.topImage} source={{uri: photoURL}} />
          <Text style={styles.topTitle}>{name}</Text>
        </View>
        {/* Top Coitainer  

        {/* Chat */}
        <View style={styles.container}>
          <FlatList
            style={{marginHorizontal:24,marginVertical:24}}
            showsHorizontalScrollIndicator={false}
            horizontal={false}
            data={this.state.messageList}
            renderItem={({item}) => this.renderItem(item)}
            keyExtractor={item => item.id}
          />
        </View>

        {/* Chat */}

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.bottomInput}
            value={this.state.textMessage}
            onChangeText={text => this.setState({textMessage: text})}
          />

          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => this.sendMessage(textMessage)}>
            <Icon name="send" size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
        {/* Bottom Container */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
   
  },

  topContainer: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginTop:24
  },
  topImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginHorizontal: 16,
  },
  topTitle: {
    fontWeight: '700',
    fontSize: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding: 24,
  },

  bottomInput: {
    height: 50,
    borderRadius: 50,
    flex: 1,
    marginRight: 16,
    backgroundColor: 'rgba(252, 252, 252, 0.16)',
    paddingHorizontal: 24,
    color: 'rgba(252, 252, 252, 1)',
  },
  bottomButton: {
    height: 50,
    width: 50,
    backgroundColor: Color.primary,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
