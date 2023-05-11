import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, []);

  const renderProductItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
      <Text style={{ fontSize: 14 }}>{item.description}</Text>
      <Text style={{ fontSize: 14, color: 'green' }}>{item.price} USD</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id.toString()}
        refreshing={!products.length}
        onRefresh={() => {
          fetch('http://localhost:5000/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error(error));
        }}
      />
    </View>
  );
};

export default ProductsList;
