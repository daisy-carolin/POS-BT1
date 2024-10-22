import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoggedIn, setBusinessId } from "../store";
import { auth, db } from "../Database/config";
import {
  collection,
  getDocs,
  addDoc
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const LoginPage = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const { loggedIn } = useSelector((state) => state.settings);
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

 // Handle user state changes
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        if (user) {
          // Navigate to 'TabLayout' only if there is a user
          navigation.navigate('TabLayout');
        } else {
          // Optionally, navigate to a login screen if user is null
          navigation.navigate('LoginPage'); // Replace with your login screen route
        }
      });
    
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('TabLayout'); // Navigate to your desired screen after login
      ToastAndroid.show("Welcome", ToastAndroid.LONG)
    } catch (err) {
      setError(err.message);
    }
  };

const handleSignup = async () => {
    const auth = getAuth();
    setLoading(true);
    setError(""); 

    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, "Users"), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(), 
      });

      console.log("User signed up successfully:", user);

    
      dispatch(setLoggedIn(true));

      
      navigation.navigate("TabLayout"); 
    } catch (error) {
      console.error("Error during signup: ", error);
      setError(error.message); 
    } finally {
      setLoading(false);
    }
  };
return (
    <View style={styles.container}>
      <Text style={styles.title}>RwandAir</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#C4C4C4"
        onChangeText={(text) => setEmail(text)} 
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#C4C4C4"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#00FF00" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: screenWidth,
    height: screenHeight,
  },
  title: {
    fontSize: 40,
    color: "#00FF00",
    marginBottom: 40,
    fontFamily: "Poppins-ExtraBold",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontFamily: "Poppins-Regular",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});

export default LoginPage;
