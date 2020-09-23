import React, {Component} from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    AsyncStorage,
  } from 'react-native';
  
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCart: [],
    };
  }

  

  increase(item){
      console.log(item);
  }
  
  reduce(item){
      console.log(item);
  }

  renderItem(item) {
    return (
      <TouchableOpacity style={styles.list}>
        <View style={{padding: 16}}>
          <Text style={styles.productName}>{item.product.name} x  {item.quantity}</Text>
          <Text style={styles.productPrice}>$ {item.prices}</Text>

          <TouchableOpacity style={styles.btn}
          
            onPress={()=>this.increase(item)}
          >
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn}
            onPress={()=>this.reduce(item)}
          >
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
    );
  }


  componentDidMount() {
    AsyncStorage.getItem('cart')
      .then(cart => {
        if (cart !== null) {
          // We have data!!
          const cartfood = JSON.parse(cart);
            console.log(cartfood);
          this.setState({dataCart: cartfood});
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    return (
      <View>
        <Text>Cart</Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          data={this.state.dataCart}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f3f3f3',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    list: {
      margin: 20,
      borderRadius: 16,
      backgroundColor: '#fff',
    },
    itemImage: {
      width: '100%',
      height: 500,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    productName: {
      fontSize: 20,
    },
    productPrice: {
      fontSize: 18,
      opacity: 0.5,
    },
    btn: {
      backgroundColor: '#222',
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 14,
    },
    btnText: {
      padding: 12,
      color: '#fff',
    },
  });
export default Cart;
