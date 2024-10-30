import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../Database/config'; // Ensure Firebase auth is correctly imported
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = ({ route, navigation }) => {
  const { role } = route.params || { role: 'user' }; // Defaults to 'user' if not passed
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Helper function to reset error messages
  const resetError = () => setErrorMessage('');

  // Helper function for validation (admin or user)
  const validateCredentials = () => {
    if (role === 'admin') {
      if (!email || !password) {
        setErrorMessage('Please enter both email and password.');
        return false;
      }
    } else if (role === 'user') {
      if (!phoneNumber || !idNumber) {
        setErrorMessage('Please enter both phone number and ID number.');
        return false;
      }
    }
    return true;
  };

  // Login handler
  const handleLogin = async () => {
    resetError();

    if (!validateCredentials()) return;

    try {
      if (role === 'admin') {
        // Admin authentication using Firebase email/password
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('SubscriptionPage');
      } else if (role === 'user') {
        // Simple user validation (can be replaced with real authentication)
        if (validateUserCredentials()) {
          navigation.navigate('UserHomePage');
        } else {
          setErrorMessage('Invalid user credentials.');
        }
      }
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
    }
  };

  // Simple validation for users (mock example)
  const validateUserCredentials = () => {
    return phoneNumber === '123456789' && idNumber === '12345';
  };

  // Redirect to signup page if the admin doesn't have an account
  const handleSignupRedirect = () => {
    navigation.navigate('SignupPage', { role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{role === 'admin' ? 'Admin Login' : 'User Login'}</Text>
      
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {role === 'admin' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </>
      )}

      {role === 'user' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="ID Number"
            value={idNumber}
            onChangeText={setIdNumber}
            keyboardType="numeric"
          />
        </>
      )}

      <Button title="Login" onPress={handleLogin} />

      {role === 'admin' && (
        <TouchableOpacity onPress={handleSignupRedirect} style={styles.signupLink}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  signupLink: {
    marginTop: 20,
  },
  signupText: {
    color: '#0F084B',
  },
});

export default LoginPage;
