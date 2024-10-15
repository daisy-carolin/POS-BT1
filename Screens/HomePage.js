// Importing necessary modules and components from React, React Native, and other libraries
import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DropdownComponent from "../Components/DropDown"; 
import Header from "../Components/Header";
import data from "../store/dummyData"; 
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const HomePage = () => {
  const navigation = useNavigation(); 
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [appData] = useState(data); 

  
  const handleStart = () => {
    console.log(selectedCategory.Name)
    if (selectedCategory  && selectedOrigin && selectedDestination) {
      navigation.navigate("RecordPage", {
        category: selectedCategory.Name,
        origin: selectedOrigin.Name,
        destination: selectedDestination.Name,
      });
    } else {
      alert("Please select all fields before starting.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <View style={styles.container}>
        <Header />
        <View style={styles.recordSection}>
          <Text style={styles.heading}>Total Records</Text>
          <Text style={styles.normalText}>{}</Text>
        </View>
        <View style={{ marginTop: 30, gap: 5, flex: 1 }}>
          <DropdownComponent
            title={"Category"}
            onChange={(value) => setSelectedCategory(value)}
            data={appData.category} 
          />
          
          <DropdownComponent
            title={"Origin"}
            onChange={(value) => setSelectedOrigin(value)}
            data={appData.originLocations} 
          />
          <DropdownComponent
            title={"Destination"}
            onChange={(value) => setSelectedDestination(value)}
            data={appData.destinationLocations} 
          />
        </View>
        <TouchableOpacity
          onPress={handleStart} 
          style={[styles.button, styles.button_Bg, { marginTop: 30 }]}
        >
        <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.button_Bg, { marginTop: 30 }]}
        >
          <Text style={styles.buttonText}>Connect to Scale</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#F9F9F9",
    paddingVertical: 10,
    paddingTop: 50,
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
  },
  normalText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  recordSection: {
    display: "flex",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    width: screenWidth * 0.9,
    marginTop: 20,
  },
  button: {
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.9,
  },
  button_Bg: {
    backgroundColor: "#F2F2F2",
  },
});

export default HomePage; 