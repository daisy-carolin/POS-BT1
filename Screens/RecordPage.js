import * as Network from "expo-network";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef, useMemo } from "react";
import DropdownComponent from "../Components/DropDown";
import Header from "../Components/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useBluetooth } from "rn-bluetooth-classic";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../Database/config";
import { store } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { setSuppliers, setCollections, setLocations } from "../store";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import RNBluetooth from "react-native-bluetooth-classic";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import data from "../store/dummyData"; 

const RecordPage = ({ route, navigation }) => {
  const {category, origin,destination} = route.params;
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.settings.collections);
  const suppliers = useSelector((state) => state.settings.suppliers);
  const { BusinessId, user } = useSelector((state) => state.settings);

  const [selectedProductType, setSelectedProductType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [scaleStability, setScaleStability] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [appData] = useState(data);


const bottomSheetModalRef = useRef(null);

  const {
    devices,
    connectToDevice,
    receivedData,
    isConnected,
    disconnectDevice,
    writeToDevice,
    readFromDevice,
  } = useBluetooth();

  const [scaleData, setScaleData] = useState({ });
  useEffect(() => {
    if (receivedData) {
      const parsedData = parseBluetoothData(receivedData);
  
      // Ensure parsedData.reading is not null before proceeding
      if (parsedData.reading !== null && JSON.stringify(parsedData) !== JSON.stringify(scaleData)) {
        setScaleData(parsedData);
        console.log("PARSED", parsedData);
        console.log("scaledata:", scaleData);
      }
    }
  }, [receivedData]);

useEffect(() => {
    const newTotalQuantity = products.reduce(
      (acc, item) => acc + parseInt(item.quantity),
      0
    );
    const newTotalWeight = products.reduce(
      (acc, item) => acc + parseFloat(item.weight),
      0
    );
    // const newTotalPrice = newTotalWeight * product.price;
    setTotalQuantity(newTotalQuantity);
    setTotalWeight(newTotalWeight.toFixed(2));
    // setTotalPrice(newTotalPrice.toFixed(2));
  }, [products]);

const parseBluetoothData = (data) => {
  console.log("Received data:", data);

  let numericValue = null;

  // Try to extract a numeric value from the data
  if (typeof data === 'string') {
    // First, try to decode if it's base64 encoded
    try {
      const decodedData = atob(data);
      const match = decodedData.match(/-?\d+(\.\d+)?/);
      if (match) {
        numericValue = parseFloat(match[0]);
      }
    } catch (error) {
      // If decoding fails, it's not base64, so we'll try to extract numbers directly
      const match = data.match(/-?\d+(\.\d+)?/);
      if (match) {
        console.log("value",match)
        numericValue = parseFloat(match[0]);
      }
    }
  } else if (typeof data === 'number') {
    console.log("test",data);
    numericValue = data;
  }

  // If we found a valid numeric value, return it with 'kg' appended
  if (numericValue !== null) {
    console.log("Check1", numericValue)

    return {
      reading: numericValue.toFixed(2) + 'kg',
      isStable: true // Always set to true as per requirement
    };
  }

  // If no valid numeric value was found, return null reading
  return {
     reading: null,
    isStable: true // Always set to true as per requirement
  };
};
  
const handleSwitchBt = async () => {
    const printer = store.getState().settings.printerAddress;
    connectToDevice(printer);
    console.log("Printer: ", printer);
  };

const saveData = async () => {
    console.log("test", category);
  
    if (category && origin && destination && selectedProductType) {
      Alert.alert(
        "Confirm Save",
        "Are you sure you want to save this record?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Save canceled"),
            style: "cancel"
          },
          {
            text: "Save",
            onPress: async () => {
              try {
                await addDoc(collection(db, "records"), {
                  selectedSupplier,
                  category,
                  // productType: selectedProductType.Name,
                  origin,
                  destination,
                  products,
                  createdAt: new Date(),
                });
                ToastAndroid.show("Record saved successfully!", ToastAndroid.LONG);

                setModalVisible(true);
                //Reset Data
              } catch (error) {
                alert("Error saving record: " + error.message);
              }
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      alert("Please select all fields before saving.");
    }
  };
const showPrinterReceipt = async () => {
    console.log("DDATA:",selectedSupplier);
    try {
        // Ensure these variables are defined
        const supplier = selectedSupplier || "N/A";
        const originLocation = origin || "Unknown";
        const destinationLocation = destination || "Unknown";
        const category = category || "N/A";
        const items = products || [];
        const separator = "-----------------------------\n";

        // Initialize receipt data
        let receiptData = "";
        receiptData += "====== RWANDAIR RECIEPT =====\n\n";
         receiptData += `Supplier Name: ${supplier.padEnd(10, ' ')}\n`;
        receiptData += `Origin: ${originLocation.padEnd(10, ' ')}\n`;
        receiptData += `Destination: ${destinationLocation.padEnd(10, ' ')}\n`;
        receiptData += `Date:${new Date().toLocaleDateString().padEnd(9, ' ')} Time:${new Date().toLocaleTimeString()}\n\n`;

        receiptData += "----------- Products -----------\n";
        receiptData += "ProductName  Qty   Weight(Kg)  \n";
        
        let totalQuantity = 0;
        let totalWeight = 0;
        let totalPrice = 0;

        items.forEach((item) => {
            const { label = item.productName || "Unknown", quantity = 0, weight = 0, price = 0 } = item;
            // const pName = productName;
            const qty = parseInt(quantity, 10);
            const wgt = parseFloat(weight);
            const prc = parseFloat(price);

            totalQuantity += qty;
            totalWeight += wgt;
            totalPrice += prc;

            receiptData += `${label.padEnd(8, ' ')} ${qty.toString().padStart(2, ' ')} ${wgt.toFixed(2).padStart(9, ' ')}\n`;
        });

        receiptData += separator;
        receiptData += `Total: ${totalQuantity.toString().padStart(6, ' ')} ${totalWeight.toFixed(2).padStart(10, ' ')} \n\n`;

        receiptData += "Thank you for your business!\n";
        receiptData += "===========================\n";
        receiptData += "\n\n\n"; // Extra lines for printer feed

        console.log(receiptData); // For debugging

        const printer = store.getState().settings.printerAddress;
        writeToDevice(printer, receiptData, "ascii");
        console.log("Receipt sent to the printer");
    } catch (error) {
        console.error("Error generating the receipt:", error);
    }
};
return (
    <View style={styles.container}>
      <Header />
      <TextInput
      value={selectedSupplier}
      onChangeText={(text) => setSelectedSupplier(text)}
      placeholder="Supplier"
      style={styles.supplier}
    />
      <DropdownComponent
        title={"Product Type"}
        onChange={(value) => setSelectedProductType(value)}
        data={appData.productType} 
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalNav}>
              <View style={styles.modaltouchable}>
                <Text style={styles.touchableText}>Print Receipt</Text>
              </View>
            </View>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={[, styles.button, { borderRadius: 20 }]}
                onPress={handleSwitchBt}
              >
                <AntDesign name="printer" size={34} color="blue" />
                <Text style={styles.textButton}>Reconnect printer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={showPrinterReceipt}
              >
                <Text style={styles.textButton}>Print</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

          <View
            style={[
              styles.display,
              {
                backgroundColor: scaleData.isStable ? "green" : "red",
              },
            ]}
          >
            <View style={styles.data}>
              <Text style={styles.textBold}>Connected Device:</Text>
              <Text style={styles.textRegular}>
                {receivedData ? "Connected" : "Disconnected"}
              </Text>
              <Text style={styles.textBold}>Scale Stability:</Text>
              <Text style={styles.textRegular}>
                {scaleData.isStable ? "Stable" : "Unstable"}
              </Text>
            </View>
            <View>
              <Text style={styles.textWeight}>
                {scaleData.reading }
              </Text>
            </View>
          </View>

          <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (scaleData.reading) {
              setProducts((prevProducts) => [
                ...prevProducts,
                {
                  ...selectedProductType,
                  quantity: 1,
                  weight: parseFloat(scaleData.reading),
                  productName: selectedProductType.Name
                },
              ]);
            } else {
              ToastAndroid.show("No valid weight reading", ToastAndroid.SHORT);
            }
          }}
        >
          <Text style={styles.textButton}>Capture</Text>
        </TouchableOpacity>

       <View style={styles.preview}>
        <ScrollView style={styles.scroll}>
          <View style={styles.table}>
            <Text style={styles.tableHeader}>Records</Text>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Item</Text>
              <Text style={styles.tableHeader}>Quantity</Text>
              <Text style={styles.tableHeader}>Weight</Text>
            </View>
            {products.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{item.productName}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.weight}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.tableCell}>Total</Text>
              <Text style={styles.tableCell}>{totalQuantity}</Text>
              <Text style={styles.tableCell}>{totalWeight}</Text>
            </View>
            
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: loading ? "#ccc" : "green" }]}
        onPress={saveData}
      >
        {loading ? (
          <ActivityIndicator color="#00FF00" />
        ) : (
          <Text style={[styles.textButton, { color: "#fff" }]}>
            Save Record
          </Text>
        )}
      </TouchableOpacity>

    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    backgroundColor: "#F9F9F9",
  },
  display: {
    height: 100,
    width: screenWidth * 0.9,
    borderRadius: 10,
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  data: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  supplier:{
    padding:10,
    backgroundColor: "grey",
    width: screenWidth * 0.8,
    marginBottom: 5,
    borderRadius: 20
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: screenWidth * 0.9,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: screenWidth * 0.9,
    backgroundColor: "#F2F2F2",
    paddingVertical: 12,
    alignItems: "center",
    margin: 10,
    borderRadius: 50,
  },
  textButton: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  preview: {
    height: 200,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    flex: 1,
    width: screenWidth * 0.9,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  scroll: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 10,
  },
  table: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f1f1f1",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  textBold: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "white",
  },
  textRegular: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "white",
  },
  textWeight: {
    fontFamily: "Poppins-Regular",
    fontSize: 24,
    color: "white",
  },
  advancementSummary: {
    width: screenWidth * 0.8,
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  summaryText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    marginBottom: 5,
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  advanceTypeSelection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  advanceTypeButton: {
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedAdvanceType: {
    backgroundColor: "#e0e0e0",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  advanceButtonText: {
    color: "#000000",
    fontWeight: "bold",
  },
});

export default RecordPage;
