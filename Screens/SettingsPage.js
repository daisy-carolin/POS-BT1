import React, { useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Octicons} from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useBluetooth } from 'rn-bluetooth-classic';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SettingsPage = ({ navigation }) => {
  const { scanDevices, devices, connectToDevice, connectedDevice } = useBluetooth();
  const [lookingForDevices, setLookingForDevices] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);

  useEffect(() => {
    const startScan = async () => {
      try {
        await scanDevices();
      } catch (e) {
        console.log('Error scanning devices:', e);
      }
    };
    startScan();
  }, []);

  useEffect(() => {
    console.log('Discovered Devices:', devices);
  }, [devices]);

  const handleConnectToScale = async (deviceAddress) => {
    setConnecting(true);
    console.log('Connecting to device', deviceAddress);
    try {
      const connected = await connectToDevice(deviceAddress);
      if (connected) {
        setConnectedDevice(deviceAddress);
        console.log('Connected to device', deviceAddress);
      } else {
        console.log('Connected to device', deviceAddress);
      }
    } catch (e) {
      console.log('Error connecting to device:', e);
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectToPrinter = async () => {
    if (devices.length > 0) {
      const deviceAddress = devices[0].address;
      setConnecting(true);
      try {
        const connected = await connectToDevice(deviceAddress);
        if (connected) {
          setConnectedDevice(deviceAddress);
          console.log('Connected to printer');
        } else {
          console.log('Failed to connect to printer');
        }
      } catch (e) {
        console.log('Error connecting to printer:', e);
      } finally {
        setConnecting(false);
      }
    } else {
      console.log('No devices found');
    }
  };

  const handleSignOut = () => {
    console.log('Sign Out button pressed');
    navigation.navigate('LoginPage');
  };

  return (
    <View style={styles.container}>
      <View style={{
        width: screenWidth,
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setLookingForDevices(true)}
      >
        <Text style={styles.buttonText}>Connect to Scale</Text>
        <Octicons name="meter" size={24} color="black" />
      </TouchableOpacity>
      {lookingForDevices && (
        <View
        >
          <Text style={{
            color: "#000000"
          }}>
            {devices[0]?.name || devices[0]?.address || 'No devices found'}
          </Text>
          <Text>Looking for devices...</Text>
          {devices.map((device) => (
            <View
              key={device.address}
              onPress={() => handleConnectToScale(device.address)}
            >
              <Text>{device.name || device.address}</Text>
            </View>
          ))}
        </View>
      )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleConnectToPrinter}>
        <Text style={styles.buttonText}>Connect to Printer</Text>
        <AntDesign name="printer" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
          <Octicons name="sign-out" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 70,
    width: screenWidth,
    height: screenHeight,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    marginRight: 20,
    fontFamily: 'Poppins-Regular',
  },
  deviceItem: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    marginVertical: 5,
    borderRadius: 5,
  },
  signOutContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  signOutButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FF0000',
    fontSize: 18,
    marginRight: 10,
    fontFamily: 'Poppins-Regular',
  },
});

export default SettingsPage;

// import React, { useEffect } from 'react';
// import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useBluetooth } from 'rn-bluetooth-classic';

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

// const SettingsPage = ({ navigation }) => {
//   const { scanDevices, devices, connectToDevice } = useBluetooth();
//   const [lookingForDevices, setLookingForDevices] = React.useState(false);

//   useEffect(() => {
//     try {
//       scanDevices();
//     } catch (e) {
//       console.log(e);
//     }
//   }, []);

//   useEffect(() => {
//     console.log('Discovered Devices:', devices);
//   }, [devices]); 

//   const handleConnectToScale = (deviceAddress) => {
//     console.log('Connecting to device', deviceAddress);
//     connectToDevice(deviceAddress);
//   };

//   const handleConnectToPrinter = () => {
//     if (devices.length > 0) {
//       connectToDevice(devices[0].address);
//       console.log('Connected to printer');
//     } else {
//       console.log('No devices found');
//     }
//   };

//   const handleSignOut = () => {
//     console.log('Sign Out button pressed');
//     navigation.navigate('LoginPage');
//   };

//   return (
//     <View style={styles.container}>
//       <View style={{
//         width: screenWidth,
//         alignItems: 'center',
//       }}>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => setLookingForDevices(true)}
//       >
//         <Text style={styles.buttonText}>Connect to Scale</Text>
//         <AntDesign name="scale" size={24} color="black" />
//       </TouchableOpacity>
//       {lookingForDevices && (
//         <View>
//           <Text style={{ color: "#000000" }}>
//             {devices[0]?.name || devices[0]?.address || 'No devices found'}
//           </Text>
//           <Text>Looking for devices...</Text>
//           {devices.map((device) => (
//             <TouchableOpacity
//               key={device.address}
//               style={styles.deviceItem}
//               onPress={() => handleConnectToScale(device.address)}
//             >
//               <Text>{device.name || device.address}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//       </View>
//       <TouchableOpacity style={styles.button} onPress={handleConnectToPrinter}>
//         <Text style={styles.buttonText}>Connect to Printer</Text>
//         <AntDesign name="printer" size={24} color="black" />
//       </TouchableOpacity>
//       <View style={styles.signOutContainer}>
//         <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
//           <Text style={styles.signOutButtonText}>Sign Out</Text>
//           <MaterialCommunityIcons name="logout" size={24} color="red" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingTop: 70,
//     width: screenWidth,
//     height: screenHeight,
//   },
//   button: {
//     width: '80%',
//     height: 50,
//     backgroundColor: '#E0E0E0',
//     borderRadius: 25,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: '#000000',
//     fontSize: 18,
//     marginRight: 20,
//     fontFamily: 'Poppins-Regular',
//   },
//   deviceItem: {
//     padding: 10,
//     backgroundColor: '#F0F0F0',
//     marginVertical: 5,
//     borderRadius: 5,
//   },
//   signOutContainer: {
//     position: 'absolute',
//     bottom: 30,
//     width: '100%',
//     alignItems: 'center',
//   },
//   signOutButton: {
//     width: '80%',
//     height: 50,
//     backgroundColor: '#E0E0E0',
//     borderRadius: 25,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   signOutButtonText: {
//     color: '#FF0000',
//     fontSize: 18,
//     marginRight: 10,
//     fontFamily: 'Poppins-Regular',
//   },
// });

// export default SettingsPage;

