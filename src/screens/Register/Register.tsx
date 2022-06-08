import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "styled-components";
import { Alert, StatusBar } from "react-native";
import { BackButton } from "../../components/BackButton";

import { CarDTO } from "../../dtos/CarDTO";
import { api } from "../../services/api";
import * as SecureStore from "expo-secure-store";

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentTitle,
  AppointmentQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from "./styles";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";
import instance, { db } from "../../utils/db";
import { Button } from "../../components/Button";

interface LoginProps {
  name: string;
  password: string;
}

export function Register() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  function handleBack() {
    navigation.goBack();
  }
  function makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  async function handleRegister() {
    let userid = makeid();
    if (name === "" && password === "") {
      Alert.alert("Fill al the blanks!");
    } else {
      if (confirmpassword === password) {
        const userQuery = await useAxios({
          axiosInstance: instance,
          url: "/rents",
        });
        await SecureStore.setItemAsync("user_id", userid);
        await SecureStore.setItemAsync("user_name", name);
        navigation.navigate("Home");
      } else {
        Alert.alert("Passwords didnt match!");
      }
    }
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {loading ? (
        <LoadAnimation />
      ) : (
        <Content style={{ display: "flex", justifyContent: "center" }}>
          <TextInput
            placeholder="Name"
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <TextInput
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TextInput
            placeholder="Password"
            textContentType="password"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <TextInput
            placeholder="Confirm Password"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmpassword}
          />
          <Button
            title="Register"
            color={theme.colors.success}
            onPress={handleRegister}
            loading={loading}
            style={{ marginBottom: 15 }}
            enabled={!loading}
          />
          <Button
            title="Login page"
            color={theme.colors.success}
            onPress={() => navigation.navigate("Login")}
            loading={loading}
            style={{ marginBottom: 15 }}
            enabled={!loading}
          />
          <Button
            title="Home"
            color={theme.colors.success}
            onPress={() => navigation.navigate("Home")}
            loading={loading}
            enabled={!loading}
          />
        </Content>
      )}
    </Container>
  );
}
