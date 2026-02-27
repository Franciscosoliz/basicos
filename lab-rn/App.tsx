import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PruebasScreen from "./src/screens/PruebasScreen";
import OrdenesScreen from "./src/screens/OrdenesScreen";
import EventosScreen from "./src/screens/EventosScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Pruebas: undefined;
  Ordenes: undefined;
  Eventos: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menú" }} />
        <Stack.Screen name="Pruebas" component={PruebasScreen} options={{ title: "Pruebas" }} />
        <Stack.Screen name="Ordenes" component={OrdenesScreen} options={{ title: "Órdenes" }} />
        <Stack.Screen name="Eventos" component={EventosScreen} options={{ title: "Eventos" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
