import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../Database/config'; // Import your database instance if using Firebase
import { doc, setDoc } from 'firebase/firestore'; // Firebase Firestore functions

const AdminDetailsPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [timestamp] = useState(new Date().toLocaleString()); // Static timestamp for creation time
  const [subscription, setSubscription] = useState('');

  // Function to save admin details
  const handleSubmitDetails = async () => {
    const adminDetails = {
      name,
      category,
      location,
      timestamp,
      subscription,
    };

    try {
      // Save admin details to Firestore (or another database)
      await setDoc(doc(db, 'admins', name), adminDetails); // 'name' as ID, or another unique identifier
      console.log('Admin details saved:', adminDetails);

      // Navigate to the SubscriptionPage after saving
      navigation.navigate('SubscriptionPage');
    } catch (error) {
      console.error("Error saving admin's details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Timestamp"
        value={timestamp}
        editable={false} // Make timestamp read-only
      />

      <TextInput
        style={styles.input}
        placeholder="Subscription Plan"
        value={subscription}
        onChangeText={setSubscription}
      />

      <Button title="Submit Details" onPress={handleSubmitDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default AdminDetailsPage;
