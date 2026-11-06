import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doorman, residents } from "@/data";
import { useStore } from "@/store";
import { colors, shadow } from "@/theme";

function ActionCard({ icon, title, body, onPress, primary = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.action, primary && styles.actionPrimary, pressed && { opacity: 0.7 }]}>
      <View style={[styles.actionIcon, primary && styles.actionIconPrimary]}>
        <Ionicons name={icon} size={25} color={primary ? "white" : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionTitle, primary && { color: "white" }]}>{title}</Text>
        <Text style={[styles.actionBody, primary && { color: "#D4E9DF" }]}>{body}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={primary ? "white" : colors.muted} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const { packages } = useStore();
  const pending = packages.filter((item) => item.status === "pending");
  const old = pending.filter((item) => Date.now() - new Date(item.receivedAt).getTime() > 86_400_000);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>CONDOMÍNIO JARDIM</Text>
            <Text style={styles.greeting}>Olá, {doorman.split(" ")[0]}</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>MA</Text></View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryNumber}>{pending.length}</Text>
          <Text style={styles.summaryLabel}>encomendas aguardando retirada</Text>
          <View style={styles.summaryLine} />
          <Text style={styles.summaryMeta}>{old.length ? `${old.length} aguardando há mais de 24h` : "Nenhuma encomenda atrasada"}</Text>
        </View>

        <Text style={styles.sectionTitle}>O que você precisa fazer?</Text>
        <ActionCard primary icon="scan-outline" title="Registrar encomenda" body="Leia a etiqueta e escolha o morador" onPress={() => router.push("/new-package")} />
        <ActionCard icon="cube-outline" title="Entregar encomenda" body={`${pending.length} ${pending.length === 1 ? "pacote pendente" : "pacotes pendentes"}`} onPress={() => router.push("/pending")} />
        <ActionCard icon="time-outline" title="Consultar histórico" body={`${packages.length} movimentações registradas`} onPress={() => router.push("/history")} />

        <View style={styles.footerInfo}>
          <Ionicons name="people-outline" size={18} color={colors.muted} />
          <Text style={styles.footerText}>{residents.length} moradores no ambiente de demonstração</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6, marginBottom: 24 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.3 },
  greeting: { color: colors.ink, fontSize: 29, fontWeight: "900", marginTop: 3 },
  avatar: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.primaryDark, fontWeight: "900" },
  summary: { backgroundColor: colors.surface, borderRadius: 24, padding: 22, marginBottom: 30, ...shadow },
  summaryNumber: { color: colors.primary, fontSize: 48, fontWeight: "900", lineHeight: 52 },
  summaryLabel: { color: colors.ink, fontSize: 17, fontWeight: "700" },
  summaryLine: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  summaryMeta: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: "800", marginBottom: 12 },
  action: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 88, padding: 16, borderRadius: 20, backgroundColor: colors.surface, marginBottom: 12, ...shadow },
  actionPrimary: { backgroundColor: colors.primary },
  actionIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  actionIconPrimary: { backgroundColor: "rgba(255,255,255,0.18)" },
  actionTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  actionBody: { color: colors.muted, fontSize: 13, marginTop: 4 },
  footerInfo: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 14 },
  footerText: { color: colors.muted, fontSize: 12 },
});
