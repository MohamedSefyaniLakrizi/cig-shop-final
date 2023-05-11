import { View, Text, StyleSheet, FlatList } from 'react-native';
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

export default Home;

//{user ? <Text style={styles.text}>Hi {user.username}</Text> : <Text>Loading...</Text>}

/*
                <Text style={styles.text}>Hi {user}</Text>
              <Text style={styles.text}>User ID: {userId}</Text>
              <Text style={styles.text}>Email: {userEmail}</Text>
*/

/*      
      */