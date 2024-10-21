import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Database/config'// Adjust the path as necessary

const screenWidth = Dimensions.get("window").width;

const DataPage = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'records'));
        const recordsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecords(recordsList);
      } catch (error) {
        console.error("Error fetching records: ", error);
      }
    };

    fetchRecords();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.pressable}>
      <Text style={styles.dInfo}>Id: {item.id}</Text>
      <Text style={styles.dInfo}>Supplier: {item.selectedSupplier}</Text>
      <Text style={styles.dInfo}>Origin: {item.origin}</Text>
      <Text style={styles.dInfo}>Destination: {item.destination}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>RwandAir Weight Records</Text>
      <TextInput
    //   value={selectedSupplier}
    //   onChangeText={(text) => setSelectedSupplier(text)}
      placeholder="Search ..."
      style={styles.search}
    />
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default DataPage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F084B',
    marginBottom: 20,
  },
  search:{
    padding:10,
    backgroundColor: "grey",
    width: screenWidth * 0.8,
    marginBottom: 5,
    borderRadius: 20
  },
  pressable: {
    width: screenWidth * 0.9,
    padding: 10,
    margin: 5,
    backgroundColor: '#1D84B5',
    borderRadius: 10,
  },
});
