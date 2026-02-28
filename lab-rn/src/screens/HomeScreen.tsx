import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../App";

type Nav = NativeStackNavigationProp<RootStackParamList, "Home">;

type GlobalAuthStore = { accessToken?: string; refreshToken?: string };

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  const logout = (): void => {
    const store = global as unknown as GlobalAuthStore;
    store.accessToken = undefined;
    store.refreshToken = undefined;
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
      <Text style={styles.sub}>Laboratorio — Pruebas y Órdenes</Text>

      <Pressable onPress={() => navigation.navigate("Pruebas")} style={styles.btn}>
        <Text style={styles.btnText}>Pruebas</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Ordenes")} style={styles.btn}>
        <Text style={styles.btnText}>Órdenes</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Catalogo")} style={styles.btn}>
        <Text style={styles.btnText}>Catálogo (Mongo)</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Eventos")} style={styles.btn}>
        <Text style={styles.btnText}>Eventos (Mongo)</Text>
      </Pressable>

      <Pressable onPress={logout} style={[styles.btn, styles.btnDanger]}>
        <Text style={[styles.btnText, styles.btnDangerText]}>Salir</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 24, fontWeight: "800", marginBottom: 6, marginTop: 10 },
  sub: { color: "#8b949e", marginBottom: 14 },
  btn: {
    backgroundColor: "#21262d",
    borderColor: "#58a6ff",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  btnDanger: { borderColor: "#ff7b72" },
  btnDangerText: { color: "#ff7b72" },
});
