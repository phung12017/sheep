import React, {Component} from 'react';
import {Text, View, StatusBar, StyleSheet, Image} from 'react-native';
import Color from '../assets/Color';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {Dimensions} from 'react-native';

export default class Welcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <View>
          <TouchableOpacity style={styles.buttonLogin}
          
            onPress={()=>this.props.navigation.navigate('Login')}
          
          >
            <Text style={styles.textButton}>Log in</Text>
          </TouchableOpacity>

          <Image
            source={require('../assets/image/neon-preset-1-2.jpg')}
            style={styles.image}
          />
        </View>

        <Text style={styles.bigTit}>{'Meet new\nfriends faster'}</Text>
        <Text style={styles.title}>
          {'Swipe to meet new friends, join group\nand live your best life.'}
        </Text>
        <TouchableOpacity style={styles.button}
          onPress={()=>this.props.navigation.navigate('Signup')}
        
        >
          <Text style={styles.textButton}>Create account</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.seccond,
    flex: 1,
    padding: 24,
  },
  image: {
    width: windowWidth - 48,
    height: windowWidth,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Color.primary,
    borderRadius: 99,
    height: 48,
    width: 185,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bigTit: {
    fontSize: 44,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    color: '#fff',

    marginBottom: 24,
  },

  buttonLogin: {
    alignSelf: 'flex-end',
    marginVertical: 24,
  },
});
