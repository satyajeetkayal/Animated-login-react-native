import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  LogBox,
  Platform,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput } from "react-native-paper";
import LottieView from "lottie-react-native";
import {
  Button,
  ProgressBar,
  SheetBottom,
  List,
  ListItem,
} from "material-bread";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { Toast } from "native-base";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const onHide = () => setVisible(false);

  useEffect(() => {
    LogBox.ignoreLogs([`Setting a timer`]);
    LogBox.ignoreLogs(["Animated:`useNativeDriver`"]);
  }, []);

  const cameraPermission = async () => {
    if (Platform.OS == "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission Popup",
            message: "App needs camera permission",
            buttonNeutral: "Ask me later",
            buttonNegative: "Cancel",
            buttonPositive: "Ok",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return setVisible(true);
        } else if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return Toast.show({
            text: "Camera need access permission.",
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const launchCamera = () => {
    let options = {
      title: "Open Camera",
      mediaType: "photo",
      maxHeight: 1000,
      maxWidth: 1000,
      quality: 1,
      allowsEditing: true,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log("response", response);
      if (response.didCancel) {
        return (
          setVisible(false),
          Toast.show({
            text: "Camera Access denied.",
          })
        );
      } else if (response.errorCode == "camera_unavailable") {
        return (
          setVisible(false),
          Toast.show({
            text: "Camera feature unavailable.",
          })
        );
      } else if (response.errorCode == "permission") {
        return (
          setVisible(false),
          Toast.show({
            text: "User Permission denied.",
          })
        );
      } else if (response.errorCode == "others") {
        return (
          setVisible(false),
          Toast.show({
            text: `Camera Image Picker Error. ${response.errorMessage}`,
          })
        );
      } else {
        setImage(response.uri);
      }
    });
  };

  const selectImage = () => {
    let options = {
      title: "Select Images",
      mediaType: "photo",
      maxHeight: 1000,
      maxWidth: 1000,
      quality: 1,
      allowsEditing: true,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("response", response);
      if (response.didCancel) {
        return setVisible(false), Toast.show({ text: "Gallery access denied" });
      } else if (response.errorCode == "camera_unavailable") {
        return (
          setVisible(false),
          Toast.show({
            text: "Gallery feature unavailable.",
          })
        );
      } else if (response.errorCode == "permission") {
        return (
          setVisible(false),
          Toast.show({
            text: "User Permission denied.",
          })
        );
      } else if (response.errorCode == "others") {
        return (
          setVisible(false),
          Toast.show({
            text: `Image Selection Error. ${response.errorMessage}`,
          })
        );
      } else {
        setImage(response.uri);
      }
    });
  };

  const register = () => {
    setLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            image ||
            "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
        });
        navigation.replace("Login");
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <LottieView
        source={require("../login-animation.json")}
        autoPlay
        loop
        style={styles.animationStyle}
      />
      <View
        style={{ justifyContent: "center", alignItems: "center", bottom: 90 }}
      >
        <Image
          source={
            image
              ? { uri: image }
              : {
                  uri:
                    "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
                }
          }
          style={styles.imageStyle}
        />
        <TouchableOpacity
          style={styles.iconStyle}
          activeOpacity={0.5}
          onPress={cameraPermission}
        >
          <Icon name="camera-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View
        style={{ justifyContent: "center", alignSelf: "center", bottom: 70 }}
      >
        <TextInput
          label="Full Name"
          mode="outlined"
          style={styles.textContainer}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          label="Email"
          mode="outlined"
          style={styles.textContainer}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Password"
          mode="outlined"
          style={styles.textContainer}
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={register}
        />
        <Button
          type="flat"
          text="Create an Account"
          style={styles.buttonContainer}
          onPress={register}
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
        <SheetBottom
          style={{ bottom: 30 }}
          visible={visible}
          onBackdropPress={onHide}
          onSwipeDown={onHide}
        >
          <List>
            <ListItem
              text={"Select Images from Gallery"}
              onPress={selectImage}
              icon={<Icon name="images" size={20} color="black" />}
            />
            <ListItem
              text={"Open camera"}
              onPress={launchCamera}
              icon={<Icon name="camera" size={20} color="black" />}
            />
          </List>
        </SheetBottom>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
    top: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: 350,
    height: 40,
    borderRadius: 10,
    top: 0,
  },
  iconStyle: {
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: "white",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    right: 130,
    top: 75,
    borderWidth: 0.5,
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignSelf: "center",
    top: 0,
  },
  animationStyle: {
    height: 250,
    width: 200,
    left: 40,
    bottom: 30,
  },
});
