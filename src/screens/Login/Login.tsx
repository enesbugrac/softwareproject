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

export function Login() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  function handleBack() {
    navigation.goBack();
  }
  async function handleLogin() {
    if (name === "" && password === "") {
      Alert.alert("Fill all the blanks");
    } else {
      const userQuery = useAxios({
        axiosInstance: instance,
        url: "/users",
      });
      console.log("GİR", userQuery);
      if (userData.password === password) {
        console.log("GİRDİ");
        await SecureStore.setItemAsync("user_id", userData.id);
        await SecureStore.setItemAsync("user_name", userData.name);
        navigation.navigate("Home");
      } else {
        Alert.alert("No matching values!");
      }
    }
  }
  async function handleRegisterNavigate() {
    navigation.navigate("Register");
  }

  useEffect(() => {
    async function fetchCars() {}
    fetchCars();
  }, []);

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
            placeholder="Password"
            textContentType="password"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <Button
            title="Login"
            color={theme.colors.success}
            onPress={handleLogin}
            loading={loading}
            style={{ marginBottom: 15 }}
            enabled={!loading}
          />
          <Button
            title="Sign Up page"
            color={theme.colors.success}
            onPress={handleRegisterNavigate}
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
