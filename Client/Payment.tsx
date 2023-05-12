import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

const Payment =  () => {
  const [cartItems, setCartItems] = useState([]);
  useEffect( () => {
    const getCart =  async () =>{
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
          } else {
            console.error(data.message);
          }
        })
        .catch(error => console.error(error));
    };
    getCart();
      
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price} DH</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
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
  }
});

export default Payment;
