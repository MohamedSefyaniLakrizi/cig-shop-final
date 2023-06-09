import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const Payment =  () => {
  const [cartItems, setCartItems] = useState([]);


  const getCart = async () => {
    const token = await AsyncStorage.getItem('token');
    fetch('https://cig-et0r.onrender.com/cart/cart', {
      method: 'GET',
      headers: {
        token: token,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCartItems(data.cartItems);
          console.log("cart items are: " + JSON.stringify(data.cartItems));
          
        } else {
          console.error(data.message);
        }
      })
      .catch(error => console.error(error));
  };

  useEffect( () => {
    getCart();
  }, []);

  const removeCartItem = async (productId) => {
    console.log("product id is: " + productId);
    const token = await AsyncStorage.getItem('token');
    fetch(`https://cig-et0r.onrender.com/cart/cart/${productId}`, {
      method: 'PUT',
      headers: {
        token: token,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log("success");
          
          // Refresh the cart after removing the item
          getCart();
        } else {
          console.error(data.message);
        }
      })
      .catch(error => console.error(error));
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price} DH</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
        <TouchableOpacity style={styles.removeItemButton} onPress={() => removeCartItem(item.product_id)} />
        <Text style={styles.removeItemButtonText}>Remove Item</Text>
      </View>
    </View>
  );


  
  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={() => <Text style={styles.emptyList}>Your cart is empty.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff'
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  emptyList: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20
  },
  removeItemButton: {
    backgroundColor: '#ff0000',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10
  },
  removeItemButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Payment;
