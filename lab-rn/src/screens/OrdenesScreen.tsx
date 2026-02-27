import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listLabTestsApi } from "../api/lab-tests.api";
import { listLabOrdersApi, createLabOrderApi, updateLabOrderApi } from "../api/lab-orders.api";
import type { LabTest } from "../types/labTest";
import type { LabOrder, LabOrderStatus } from "../types/labOrder";
import { toArray } from "../types/drf";

const STATUS_OPTIONS: LabOrderStatus[] = ["CREATED", "PROCESSING", "COMPLETED", "CANCELLED"];

export default function OrdenesScreen() {
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [tests, setTests] = useState<LabTest[]>([]);

  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [patient_name, setPatientName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const testById = useMemo(() => {
    const map = new Map<number, LabTest>();
    tests.forEach((t) => map.set(t.id, t));
    return map;
  }, [tests]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const [ordersData, testsData] = await Promise.all([
        listLabOrdersApi(),
        listLabTestsApi(),
      ]);
      setOrders(toArray(ordersData));
      const testsList = toArray(testsData);
      setTests(testsList);
      if (selectedTestId === null && testsList.length) setSelectedTestId(testsList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar datos.");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createOrder = async (): Promise<void> => {
    try {
      setErrorMessage("");
      if (selectedTestId === null) return setErrorMessage("Seleccione una prueba");
      if (!patient_name.trim()) return setErrorMessage("Nombre del paciente requerido");

      const created = await createLabOrderApi({
        test: selectedTestId,
        patient_name: patient_name.trim(),
        source: "MOBILE",
      });
      setOrders((prev) => [created, ...prev]);
      setPatientName("");
    } catch {
      setErrorMessage("No se pudo crear orden.");
    }
  };

  const updateStatus = async (order: LabOrder, newStatus: LabOrderStatus): Promise<void> => {
    try {
      setErrorMessage("");
      await updateLabOrderApi(order.id, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
    } catch {
      setErrorMessage("No se pudo actualizar estado.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Órdenes</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Prueba</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedTestId ?? ""}
          onValueChange={(v) => setSelectedTestId(Number(v))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {tests.map((t) => (
            <Picker.Item key={t.id} label={t.test_name} value={t.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Paciente</Text>
      <TextInput
        placeholder="Nombre del paciente"
        placeholderTextColor="#8b949e"
        value={patient_name}
        onChangeText={setPatientName}
        style={styles.input}
      />

      <Pressable onPress={createOrder} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear orden</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const t = testById.get(item.test);
          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText}>#{item.id} · {t ? t.test_name : item.test}</Text>
                <Text style={styles.rowSub}>{item.patient_name}</Text>
                <Text style={styles.rowSub}>{item.status}{item.result_summary ? ` · ${item.result_summary}` : ""}</Text>
              </View>
              <View>
                {STATUS_OPTIONS.map((s) => (
                  item.status !== s && (
                    <Pressable key={s} onPress={() => updateStatus(item, s)} style={styles.statusBtn}>
                      <Text style={styles.statusBtnText}>{s}</Text>
                    </Pressable>
                  )
                ))}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },
  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  statusBtn: { paddingVertical: 4, paddingHorizontal: 8, marginBottom: 4, backgroundColor: "#21262d", borderRadius: 6 },
  statusBtnText: { color: "#58a6ff", fontSize: 12 },
});
