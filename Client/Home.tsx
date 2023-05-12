import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoRoundComponent from './components/Dart/NoRound';
import AddRound from './routes/AddRound';
import { StackNavigationProp } from '@react-navigation/stack';
import Swiper from 'react-native-swiper';
import NoMonth from './components/Home/roundComponents/NoMonth';
import MonthContainer from './components/Home/roundComponents/MonthContainer';
import SmallMonthWrapper from './components/Home/roundComponents/SmallMonthWrapper';
import LoadingScreen from './components/LoadingScreen';

type HomeProps = {
  navigation: StackNavigationProp<any>;
};

const Home: React.FC<HomeProps> = ({navigation}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://cig-et0r.onrender.com/product/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, []);

  

  const handleProductPress = (id: number) => {
    console.log("id is : " + id);
    
    //navigation.navigate('AppTabs', {id, screen: 'ProductDetails' });
    navigation.navigate('ProductDetails', { id });

  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item.id)}>
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 80, height: 80, marginRight: 10 }}
            source={{ uri: item.image_url }}
            resizeMode='contain'
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ fontSize: 14 }}>{item.description}</Text>
            <Text style={{ fontSize: 14, color: 'green' }}>{item.price} DH</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Taric Shop</Text>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id.toString()}
        refreshing={!products.length}
        onRefresh={() => {
          fetch('https://cig-et0r.onrender.com/product/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error(error));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Home;
