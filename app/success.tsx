import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components";
import { residents, residentLabel } from "@/data";
import { useStore } from "@/store";
import { colors } from "@/theme";

export default function SuccessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useStore().packages.find((entry) => entry.id === id);
  const resident = residents.find((entry) => entry.id === item?.residentId);
  if (!item || !resident) return null;

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content}>
        <View style={styles.check}><Ionicons name="checkmark" size={44} color="white" /></View>
        <Text style={styles.title}>Encomenda registrada</Text>
        <Text style={styles.body}>{resident.name} · {residentLabel(resident)}</Text>
        <View style={styles.noticeCard}>
          <Ionicons name="logo-whatsapp" size={29} color={colors.primary} />
          <Text style={styles.noticeTitle}>Código enviado ao morador</Text>
          <Text style={styles.noticeBody}>Por segurança, o PIN não é exibido na portaria. O morador deverá informá-lo no momento da retirada.</Text>
        </View>
        <View style={{ width: "100%", gap: 10 }}>
          <PrimaryButton title="Concluir" onPress={() => router.replace("/")} />
          <Pressable onPress={() => router.replace("/new-package")} style={styles.secondary}><Text style={styles.secondaryText}>Registrar outra encomenda</Text></Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 28 },
  check: { width: 84, height: 84, borderRadius: 28, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 23 },
  title: { color: colors.ink, fontSize: 26, fontWeight: "900", textAlign: "center" },
  body: { color: colors.muted, fontSize: 14, marginTop: 8, textAlign: "center" },
  noticeCard: { width: "100%", borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", padding: 24, marginVertical: 30 },
  noticeTitle: { color: colors.ink, fontSize: 16, fontWeight: "900", marginTop: 11 },
  noticeBody: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7 },
  secondary: { minHeight: 52, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: colors.primary, fontWeight: "800" },
});
