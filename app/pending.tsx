import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Badge, EmptyState } from "@/components";
import { residents, residentLabel } from "@/data";
import { useStore } from "@/store";
import { colors } from "@/theme";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default function PendingScreen() {
  const pending = useStore().packages.filter((item) => item.status === "pending");
  return (
    <View style={styles.page}>
      <FlatList
        data={pending}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={pending.length ? <Text style={styles.count}>{pending.length} {pending.length === 1 ? "encomenda aguardando" : "encomendas aguardando"}</Text> : null}
        ListEmptyComponent={<EmptyState title="Tudo entregue" body="Nenhuma encomenda está aguardando retirada." />}
        renderItem={({ item }) => {
          const resident = residents.find((entry) => entry.id === item.residentId)!;
          return (
            <Pressable onPress={() => router.push(`/package/${item.id}`)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.6 }]}>
              <View style={styles.cube}><Ionicons name="cube" size={22} color={colors.primary} /></View>
              <View style={{ flex: 1 }}><Text style={styles.name}>{resident.name}</Text><Text style={styles.unit}>{residentLabel(resident)}</Text><Text style={styles.code}>{item.trackingCode}</Text></View>
              <View style={styles.right}><Badge tone="amber">Pendente</Badge><Text style={styles.date}>{formatDate(item.receivedAt)}</Text></View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  list: { padding: 20, paddingBottom: 40 },
  count: { color: colors.muted, fontSize: 13, fontWeight: "700", marginBottom: 12 },
  card: { flexDirection: "row", gap: 12, backgroundColor: colors.surface, borderRadius: 19, padding: 15, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  cube: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  name: { color: colors.ink, fontSize: 15, fontWeight: "900" },
  unit: { color: colors.muted, fontSize: 12, marginTop: 3 },
  code: { color: colors.muted, fontSize: 10, marginTop: 8 },
  right: { alignItems: "flex-end", justifyContent: "space-between" },
  date: { color: colors.muted, fontSize: 10 },
});
