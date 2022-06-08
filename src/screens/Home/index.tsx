import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, BackHandler } from "react-native";
import { RectButton, PanGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from "react-native-reanimated";
const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

import { api } from "../../services/api";
import { CarDTO } from "../../dtos/CarDTO";
import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";

import Logo from "../../assets/logo.svg";

import { Container, Header, HeaderContent, TotalCars, CarList } from "./styles";
import firestore from "../../utils/firebase";
import instance, { db } from "../../utils/db";
import { Button } from "../../components/Button";

export function Home() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [user, setUser] = useState("");
  const [username, setUserName] = useState("");

  const theme = useTheme();

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: positionX.value },
        { translateY: positionY.value },
      ],
    };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: any) {
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value;
    },

    onActive(event, ctx: any) {
      positionX.value = ctx.positionX + event.translationX;
      positionY.value = ctx.positionY + event.translationY;
    },

    onEnd() {
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    },
  });

  function handleCarDetails(car: CarDTO) {
    navigation.navigate("CarDetails", { car });
  }
  function handleLoginNavigate() {
    navigation.navigate("Login");
  }
  function handleRegisterNavigate() {
    navigation.navigate("Register");
  }

  function handleMyCars() {
    navigation.navigate("MyCars");
  }

  useEffect(() => {
    async function fetchCard() {
      let result = await SecureStore.getItemAsync("user_id");
      let userName = await SecureStore.getItemAsync("user_name");
      console.log("USER", userName);
      if (result) {
        setUser(result);
        setUserName(userName);
      }
      const carQuery = await useAxios({
        axiosInstance: instance,
        url: "/cars",
      });
      setCars(carsData);
      setLoading(false);
    }
    fetchCard();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
  }, []);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Header>
        <HeaderContent>
          {!user ? (
            <>
              <Button
                title="Login"
                color={theme.colors.success}
                onPress={() => handleLoginNavigate()}
                loading={loading}
                style={{ width: 100, height: 30 }}
                enabled={!loading}
              />
              <Button
                title="Register"
                color={theme.colors.success}
                onPress={() => handleRegisterNavigate()}
                loading={loading}
                style={{ width: 100, height: 30 }}
                enabled={!loading}
              />
            </>
          ) : (
            <>
              <TotalCars>{username}</TotalCars>
              <Button
                title="Logout"
                color={theme.colors.success}
                onPress={async () => {
                  await SecureStore.deleteItemAsync("user_id");
                  await SecureStore.deleteItemAsync("user_name");
                  navigation.navigate("Login");
                }}
                loading={loading}
                style={{ width: 100, height: 30 }}
                enabled={!loading}
              />
            </>
          )}
          {!loading && <TotalCars>Total {cars.length} cars</TotalCars>}
        </HeaderContent>
      </Header>

      {loading ? (
        <LoadAnimation />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            console.log("ITEM", item);
            return <Car data={item} onPress={() => handleCarDetails(item)} />;
          }}
        />
      )}

      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            myCarsButtonStyle,
            {
              position: "absolute",
              bottom: 13,
              right: 22,
            },
          ]}
        >
          <ButtonAnimated
            onPress={handleMyCars}
            style={[styles.button, { backgroundColor: theme.colors.main }]}
          >
            <Ionicons
              name="ios-car-sport"
              size={32}
              color={theme.colors.shape}
            />
          </ButtonAnimated>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
