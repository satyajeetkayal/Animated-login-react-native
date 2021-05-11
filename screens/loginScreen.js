import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  LogBox,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput } from "react-native-paper";
import LottieView from "lottie-react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { Button, ProgressBar } from "material-bread";

const loginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    LogBox.ignoreLogs([`Setting a timer`]);
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
  }, []);

  const signIn = () => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.replace("Welcome");

        //setLoading(false);
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <StatusBar style="dark" />
      <LottieView
        source={require("../login-animation.json")}
        autoPlay
        loop
        style={{ height: 400, width: 200, left: 10 }}
      />
      <View style={{ justifyContent: "center", alignSelf: "center" }}>
        <TextInput
          autoFocus
          keyboardType={"email-address"}
          mode="outlined"
          label="Email"
          style={styles.textContainer}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          mode="outlined"
          label="Password"
          style={styles.textContainer}
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
        <Button
          text="Sign In"
          type="flat"
          style={{ height: 40, top: 10 }}
          onPress={signIn}
        />
        <ProgressBar
          visible={loading}
          indicatorStartPosition={0}
          trackStyle={{ marginTop: 20, width: 350 }}
          color={"#5f27cd"}
          height={8}
          animationDuration={7000}
          value={50}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default loginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  textContainer: {
    justifyContent: "center",
    width: 350,
    height: 50,
  },
});
