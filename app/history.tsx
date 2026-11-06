import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Badge, EmptyState } from "@/components";
import { residents, residentLabel } from "@/data";
import { useStore } from "@/store";
import { colors } from "@/theme";

export default function HistoryScreen() {
  const { packages } = useStore();
  return (
    <View style={styles.page}>
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState title="Sem movimentações" body="As encomendas registradas aparecerão aqui." />}
        renderItem={({ item }) => {
          const resident = residents.find((entry) => entry.id === item.residentId)!;
          return <View style={styles.row}><View style={styles.lineIcon}><Ionicons name={item.status === "collected" ? "checkmark" : "arrow-down"} size={17} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.name}>{resident.name}</Text><Text style={styles.meta}>{residentLabel(resident)} · {item.volumes} vol.</Text><Text style={styles.date}>{new Date(item.receivedAt).toLocaleString("pt-BR")}</Text></View><Badge tone={item.status === "pending" ? "amber" : "green"}>{item.status === "pending" ? "Pendente" : "Entregue"}</Badge></View>;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  list: { padding: 20, paddingBottom: 40 },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border },
  lineIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  name: { color: colors.ink, fontSize: 14, fontWeight: "900" },
  meta: { color: colors.muted, fontSize: 12, marginTop: 3 },
  date: { color: colors.muted, fontSize: 10, marginTop: 6 },
});
