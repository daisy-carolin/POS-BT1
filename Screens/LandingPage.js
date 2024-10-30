import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LandingPage = ({ navigation }) => {
  const { width } = useWindowDimensions();

  const handleNavigation = (role) => {
    console.log(`Navigating to ${role} Login Page`);
    navigation.navigate('LoginPage', { role });
  };

  const isLargeScreen = width > 768;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, isLargeScreen ? styles.largeCard : styles.smallCard]}
        onPress={() => handleNavigation('admin')}
      >
        <Icon name="user-secret" size={isLargeScreen ? 150 : 80} color="#0F084B" />
        <Text style={isLargeScreen ? styles.largeCardText : styles.smallCardText}>Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, isLargeScreen ? styles.largeCard : styles.smallCard]}
        onPress={() => handleNavigation('user')}
      >
        <Icon name="user" size={isLargeScreen ? 150 : 80} color="#0F084B" />
        <Text style={isLargeScreen ? styles.largeCardText : styles.smallCardText}>User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20, 
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10, // Ensuring the card is clickable
  },
  largeCard: {
    width: 300,
    height: 300,
  },
  smallCard: {
    width: 150,
    height: 150,
  },
  largeCardText: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: 'bold',
  },
  smallCardText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingPage;
