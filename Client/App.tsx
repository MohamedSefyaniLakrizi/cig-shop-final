import React, { useState, useEffect } from 'react';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createStackNavigator,  } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Payment from './Payment';
import Profile from './Profile';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AuthContext from './AuthContext';
import AddRound from './routes/AddRound';
import AddRib from './routes/AddRib';
import AddRibSuccessful from './routes/AddRibSuccessful';
import AddRoundSuccessful from './routes/AddRoundSuccessful';
import AddRoundSuccessfulInvited from './routes/AddRoundSuccessfulInvited';
import ProductDetails from './ProductDetails';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';
import RoundComponent from './components/Dart/RoundStarted';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

type AppTabsProps = {
  navigation: NavigationProp<any>;
};
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

type MainTabsProps = {
  navigation: NavigationProp<any>;
};

const MainTabs: React.FC<MainTabsProps> = ({navigation}) => {
  return (
    <BottomTab.Navigator screenOptions={{ headerShown: false }}>
      <BottomTab.Screen name="Home" component={Home} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          
        }} 
        initialParams={{ navigation: navigation }}
        />
      <BottomTab.Screen name="Payment" component={Payment} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="credit-card" color={color} size={size} />
          ),
        }}/>
      <BottomTab.Screen name="Profile" component={Profile} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}/>
    </BottomTab.Navigator>
  );
};

const AppTabs: React.FC<AppTabsProps> = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product Details' }} initialParams={ { id: 1 } }/>
    </Stack.Navigator>
  );
};


const App: React.FC = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  console.log("checking authentication");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
        'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
        'Lato-Bold': require('./assets/fonts/Lato-Bold.ttf'),
      });
      setIsFontLoaded(true);
    }
    loadFonts();
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('https://cig-et0r.onrender.com/auth/is-verify', {
        method: 'GET',
        headers: {
          'token': token,
        },
      });
      
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Error retrieving authentication token:', error);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Auth" component={AuthStack} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="AppTabs" component={AppTabs} />
            
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
