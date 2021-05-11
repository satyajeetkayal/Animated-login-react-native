import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { Appbar, Avatar } from "material-bread";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const signOutUser = () => {
    auth.signOut().then(() => navigation.replace("Home"));
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#dfe4ea", elevation: 50 }}>
      <StatusBar style="light" backgroundColor="transparent" hidden />
      <Appbar
        titleStyles={{
          fontSize: 25,
        }}
        barType="prominent"
        title={`Welcome, ${auth?.currentUser?.displayName}`}
        navigation="menu"
        actionItems={[
          {
            name: "logout",
            onPress: () => {
              signOutUser();
            },
          },
        ]}
        backgroundImage={
          <Image
            style={{ aspectRatio: 1, resizeMode: "contain" }}
            source={{
              uri:
                "https://image.freepik.com/free-vector/gradient-liquid-abstract-background_52683-60469.jpg",
            }}
          />
        }
      />
      <View style={{ justifyContent: "center", alignSelf: "center", top: 30 }}>
        <Avatar
          style={{ justifyContent: "center", alignSelf: "center" }}
          type={"image"}
          image={<Image source={{ uri: auth?.currentUser?.photoURL }} />}
          size={100}
          ripple
        />
        <Text
          style={{
            justifyContent: "center",
            alignSelf: "center",
            fontSize: 30,
            color: "black",
          }}
        >
          {auth?.currentUser?.displayName}
        </Text>

        <Text
          style={{
            fontSize: 20,
            top: 0,
            justifyContent: "center",
            alignSelf: "center",
            color: "black",
          }}
        >
          {auth?.currentUser?.email}
        </Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
