import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton, Screen } from "@/components";
import { residents, residentLabel } from "@/data";
import { useStore } from "@/store";
import { colors } from "@/theme";

export default function ConfirmPackageScreen() {
  const { code, residentId } = useLocalSearchParams<{ code: string; residentId: string }>();
  const [volumes, setVolumes] = useState(1);
  const { packages, addPackage } = useStore();
  const resident = residents.find((item) => item.id === residentId);
  const existingPackage = packages.find((item) => item.trackingCode === code.trim().toUpperCase());
  const duplicate = Boolean(existingPackage);

  if (!resident) return null;

  function save() {
    const item = addPackage({ trackingCode: code, residentId, volumes });
    router.replace({ pathname: "/success", params: { id: item.id } });
  }

  return (
    <Screen>
      <View style={styles.page}>
        {duplicate && <View style={styles.warning}><Ionicons name="warning-outline" size={20} color={colors.warning} /><Text style={styles.warningText}>Este código já aparece no histórico. Confirme se é outro volume antes de continuar.</Text></View>}
        <Text style={styles.section}>DESTINATÁRIO</Text>
        <View style={styles.card}><View style={styles.icon}><Ionicons name="person-outline" size={23} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.name}>{resident.name}</Text><Text style={styles.sub}>{residentLabel(resident)}</Text></View></View>
        <Text style={styles.section}>ENCOMENDA</Text>
        <View style={styles.details}>
          <View style={styles.row}><Text style={styles.detailLabel}>Código</Text><Text style={styles.detailValue}>{code.toUpperCase()}</Text></View>
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.detailLabel}>Volumes</Text><View style={styles.counter}><Pressable onPress={() => setVolumes(Math.max(1, volumes - 1))} style={styles.counterButton}><Text style={styles.counterSymbol}>−</Text></Pressable><Text style={styles.counterValue}>{volumes}</Text><Pressable onPress={() => setVolumes(Math.min(20, volumes + 1))} style={styles.counterButton}><Text style={styles.counterSymbol}>+</Text></Pressable></View></View>
        </View>
        <View style={{ flex: 1 }} />
        <PrimaryButton
          title={duplicate ? "Abrir registro existente" : "Registrar e gerar PIN"}
          onPress={duplicate ? () => router.replace(`/package/${existingPackage!.id}`) : save}
        />
        <Text style={styles.footnote}>O código será enviado ao morador e permanecerá oculto para a portaria.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20 },
  warning: { flexDirection: "row", gap: 10, borderRadius: 15, padding: 13, backgroundColor: colors.warningSoft, marginBottom: 20 },
  warningText: { flex: 1, color: colors.warning, fontSize: 12, lineHeight: 18, fontWeight: "600" },
  section: { color: colors.muted, fontSize: 11, fontWeight: "900", letterSpacing: 1.1, marginBottom: 9, marginTop: 8 },
  card: { flexDirection: "row", alignItems: "center", gap: 13, padding: 16, backgroundColor: colors.surface, borderRadius: 19, borderWidth: 1, borderColor: colors.border, marginBottom: 19 },
  icon: { width: 45, height: 45, borderRadius: 14, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  name: { color: colors.ink, fontSize: 17, fontWeight: "900" },
  sub: { color: colors.muted, fontSize: 13, marginTop: 3 },
  details: { padding: 17, backgroundColor: colors.surface, borderRadius: 19, borderWidth: 1, borderColor: colors.border },
  row: { minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  detailLabel: { color: colors.muted, fontSize: 14 },
  detailValue: { color: colors.ink, fontSize: 14, fontWeight: "800", maxWidth: "65%" },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 5 },
  counter: { flexDirection: "row", alignItems: "center", gap: 15 },
  counterButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  counterSymbol: { color: colors.primary, fontSize: 22, fontWeight: "800", lineHeight: 24 },
  counterValue: { color: colors.ink, fontSize: 17, fontWeight: "900" },
  footnote: { color: colors.muted, fontSize: 11, textAlign: "center", marginTop: 11 },
});
