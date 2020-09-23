import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
export default class Source extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Source Listing',
      headerStyle: {backgroundColor: '#fff'},
      headerTitleStyle: {textAlign: 'center', flex: 1},
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
    };
  }
  componentDidMount() {
    fetch('https://phung-fashion.herokuapp.com/api/products')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          loading: false,
          dataSource: responseJson,
        });
      })
      .catch(error => console.log(error)); //to catch the errors if any
  }

 

  PostData() {
    console.log("post");
    let url = 'https://phung-fashion.herokuapp.com/category/add';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txtName: 'yourValue',
      }),
    }).then(() => {
      //this.getCategories();
    });
  }

  renderItem = data => (
    <TouchableOpacity style={styles.list} onPress={() => alert(data.id)}>
      <Image
        style={styles.itemImage}
        source={{
          uri: 'https://phung-fashion.herokuapp.com/uploads/' + data.item.image,
        }}
      />

      <View style={{padding: 16}}>
        <Text style={styles.productName}>{data.item.name}</Text>
        <Text style={styles.productPrice}>$ {data.item.prices}</Text>
      </View>
    </TouchableOpacity>
  );
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={()=>this.PostData()}

        style={{backgroundColor:"#222",padding:16,alignItems:"center"}}>
          <Text style={{color:"#fff"}}>Save</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={item => this.renderItem(item)}
          keyExtractor={item => item._id.toString()}
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
});
