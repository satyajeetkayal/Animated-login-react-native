import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import { Button } from "material-bread";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { auth } from "../firebase";
import { ActivityIndicator } from "react-native-paper";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    LogBox.ignoreLogs([`Setting a timer`]);
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
  }, []);

  useEffect(() => {
    setVisible(true);
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Welcome");
      } else {
        setVisible(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LottieView
        style={{ height: 350, width: 150 }}
        source={require("../homescreen-animation.json")}
        autoPlay
        loop
      />
      <Button
        text="Login"
        type="flat"
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("Login")}
      />
      <Button
        text="Register"
        type="flat"
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("Register")}
      />
      <ActivityIndicator
        animating={visible}
        style={{
          justifyContent: "center",
          alignSelf: "center",
          position: "absolute",
          top: 40,
        }}
        size={"small"}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  buttonContainer: {
    marginTop: 10,
    width: 350,
    height: 40,
    borderRadius: 10,
  },
});
