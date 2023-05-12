import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';


type ProductProps = {
    navigation: StackNavigationProp<any>;
    route: any;
  };


const ProductDetails: React.FC<ProductProps> = ({ route, navigation }) => {
  const [product, setProduct] = useState(null);
  const [id, setId] = useState(route.params.id);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {

    console.log("id in product detail is: " + JSON.stringify(id));
    
    fetch(`https://cig-et0r.onrender.com/product/products/${route.params.id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error(error));
  }, []);

  const addToCart = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('https://cig-et0r.onrender.com/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({
            product_id: id,
            quantity: quantity
          })
        });
        const responseData = await response.json();
        console.log(responseData);
            navigation.navigate('MainTabs', { screen: 'Home' })
      } catch (error) {
        console.error(error);
  };
  };
  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image_url }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price} DH</Text>
      <Text style={styles.description}>{product.description}</Text>
      <View style={styles.quantityPicker}>
        <Text style={styles.quantityText}>Quantity:</Text>
        <Picker
          selectedValue={quantity}
          onValueChange={(itemValue) => setQuantity(itemValue)}
          style={styles.picker}
        >
          {[...Array(10)].map((_, i) => (
            <Picker.Item key={i} label={String(i + 1)} value={i + 1} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={addToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
    marginVertical: 8,
    justifyContent: 'center',
    width: '100%',
  },
  picker: {
    color: '#333',
    fontSize: 16,
  },
});

export default ProductDetails;
