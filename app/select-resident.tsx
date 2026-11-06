import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { residents, residentLabel } from "@/data";
import { colors } from "@/theme";

export default function SelectResidentScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const clean = query.trim().toLocaleLowerCase("pt-BR");
    if (!clean) return residents;
    return residents.filter((resident) => `${resident.name} ${resident.block} ${resident.apartment}`.toLocaleLowerCase("pt-BR").includes(clean));
  }, [query]);

  return (
    <View style={styles.page}>
      <View style={styles.codeCard}><Ionicons name="barcode-outline" size={23} color={colors.primary} /><View><Text style={styles.codeLabel}>Código identificado</Text><Text style={styles.code}>{code}</Text></View></View>
      <View style={styles.search}><Ionicons name="search" size={20} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Nome, bloco ou apartamento" placeholderTextColor="#8B968F" style={styles.searchInput} /></View>
      <Text style={styles.hint}>Selecione o destinatário indicado na etiqueta</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: "/confirm-package", params: { code, residentId: item.id } })} style={({ pressed }) => [styles.resident, pressed && { opacity: 0.55 }]}>
            <View style={styles.initial}><Text style={styles.initialText}>{item.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</Text></View>
            <View style={{ flex: 1 }}><Text style={styles.name}>{item.name}</Text><Text style={styles.unit}>{residentLabel(item)}</Text></View>
            <Ionicons name="chevron-forward" size={21} color={colors.muted} />
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum morador encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, paddingTop: 8 },
  codeCard: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 20, padding: 14, borderRadius: 16, backgroundColor: colors.accent },
  codeLabel: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  code: { color: colors.primaryDark, fontSize: 14, fontWeight: "900", marginTop: 2 },
  search: { flexDirection: "row", alignItems: "center", gap: 9, margin: 20, marginBottom: 10, height: 52, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 15 },
  hint: { color: colors.muted, fontSize: 12, fontWeight: "600", marginHorizontal: 21, marginBottom: 8 },
  list: { padding: 20, paddingTop: 5, paddingBottom: 40 },
  resident: { flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: colors.surface, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 9 },
  initial: { width: 45, height: 45, borderRadius: 14, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  initialText: { color: colors.primaryDark, fontWeight: "900" },
  name: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  unit: { color: colors.muted, fontSize: 13, marginTop: 4 },
  empty: { color: colors.muted, textAlign: "center", marginTop: 30 },
});
