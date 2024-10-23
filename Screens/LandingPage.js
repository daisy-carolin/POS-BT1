// LandingPage.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Change FontAwesome to any icon library you prefer

const LandingPage = ({ navigation }) => {
  const handleNavigation = (role) => {
    navigation.navigate('LoginPage', { role });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={() => handleNavigation('admin')}>
        <Icon name="user-secret" size={150} color="#0F084B" />
        <Text style={styles.cardText}>Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => handleNavigation('user')}>
        <Icon name="user" size={150} color="#0F084B" />
        <Text style={styles.cardText}>User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Align items in a row
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: 400,
    height: 400
  },
  cardText: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: 'semibold',
  },
});

export default LandingPage;
