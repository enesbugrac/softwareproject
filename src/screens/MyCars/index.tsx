import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "styled-components";
import { StatusBar } from "react-native";
import { BackButton } from "../../components/BackButton";
import * as SecureStore from "expo-secure-store";

import { CarDTO } from "../../dtos/CarDTO";
import { api } from "../../services/api";

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
import { FlatList } from "react-native-gesture-handler";
import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";
import instance, { db } from "../../utils/db";

interface CarProps {
  car: CarDTO;
  id: string;
  user_id: string;
  startDate: string;
  endDate: string;
}

export function MyCars() {
  const navigation = useNavigation();
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const theme = useTheme();

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchCars() {
      let result = await SecureStore.getItemAsync("user_id");
      if (result) {
        setUser(result);
        const userCarQuery = await useAxios({
          axiosInstance: instance,
          url: "/rents",
        });
        console.log("GELLLLL", userCarQuery);

        setCars(userCarQuery);
      }
      setLoading(false);
    }
    fetchCars();
  }, []);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <BackButton color={theme.colors.shape} onPress={handleBack} />
        <Title>
          Your appointments {"\n"}
          are here.
        </Title>

        <SubTitle>Comfort, safety and practicality.</SubTitle>
      </Header>

      {loading ? (
        <LoadAnimation />
      ) : (
        <Content>
          <Appointments>
            <AppointmentTitle>Rent history</AppointmentTitle>
            <AppointmentQuantity>{cars.length}</AppointmentQuantity>
          </Appointments>
          {!user ? (
            <Title>
              Your appointments {"\n"}
              are here.
            </Title>
          ) : (
            <FlatList
              data={cars.reverse()}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <CarWrapper>
                  <Car data={item.car} />
                  <CarFooter>
                    <CarFooterTitle>Period</CarFooterTitle>
                    <CarFooterPeriod>
                      <CarFooterDate>{item.startDate}</CarFooterDate>
                      <AntDesign
                        name="arrowright"
                        size={20}
                        color={theme.colors.title}
                        style={{ marginHorizontal: 10 }}
                      />
                      <CarFooterDate>{item.endDate}</CarFooterDate>
                    </CarFooterPeriod>
                  </CarFooter>
                </CarWrapper>
              )}
            />
          )}
        </Content>
      )}
    </Container>
  );
}
