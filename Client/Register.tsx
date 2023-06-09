// src/Register.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  Image,
  KeyboardAvoidingView
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './components/LoadingScreen';
import Toast from 'react-native-toast-message';



type RootStackParamList = {
    Register: undefined;
    Login: undefined;
  };
  

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type RegisterProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Register'>;
    onRegistred: () => void;
  };

  type LoginProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
  };


const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const goToLogin = () => {
    navigation.navigate('Login');
  };
  const handleSubmit = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://cig-et0r.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Registration successful!',
          visibilityTime: 2000,
        });        
        await AsyncStorage.setItem('userStatus', 'registered');
        navigation.navigate('Login'); // Navigate to the Login screen if you have one
      } else {
        if (data === 'This email already exists') {
            setErrorMessage(data || 'This email already exists');
            setIsLoading(false);
        } else if (data === 'This username is Taken') {
            setErrorMessage(data || 'This username is Taken');
            setIsLoading(false);
        } else if (data === 'Passwords do not match') {
            setErrorMessage(data || 'Passwords do not match');
            setIsLoading(false);
        } else {
            setErrorMessage(data || 'Registration failed');
            setIsLoading(false);
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            setIsLoading(false);
            return;
          }
      
      }
      setIsLoading(false);
    } catch (error) {
        setErrorMessage('Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image source={require('./assets/logo.png')} style={styles.logo}/>
      </View>
      <Text style={styles.title}>Register</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />
      
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToLogin}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
      <LoadingScreen isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  keyboard: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#E5F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222E50',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1B9AAA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1B9AAA',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#1B9AAA',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  errorText: {
    color: '#222E50',
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default Register;
