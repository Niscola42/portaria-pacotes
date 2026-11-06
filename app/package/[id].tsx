import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Badge, PrimaryButton, Screen } from "@/components";
import { residents, residentLabel } from "@/data";
import { useStore } from "@/store";
import { colors } from "@/theme";

export default function PackageDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { packages, collectPackage, resendPickupCode } = useStore();
  const [pin, setPin] = useState("");
  const item = packages.find((entry) => entry.id === id);
  const resident = residents.find((entry) => entry.id === item?.residentId);
  if (!item || !resident) return null;

  function collect() {
    const result = collectPackage(item!.id, pin);
    if (result === "invalid-pin") return Alert.alert("PIN incorreto", "Confira o código informado pelo morador e tente novamente.");
    router.replace("/pending");
  }

  function resend() {
    if (!resendPickupCode(item!.id)) return;
    Alert.alert("Código reenviado", "Uma nova notificação foi solicitada para o WhatsApp cadastrado do morador. O PIN permanece oculto na portaria.");
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}><View><Text style={styles.name}>{resident.name}</Text><Text style={styles.unit}>{residentLabel(resident)}</Text></View><Badge tone={item.status === "pending" ? "amber" : "green"}>{item.status === "pending" ? "Pendente" : "Entregue"}</Badge></View>
        <View style={styles.card}>
          <Detail icon="barcode-outline" label="Código" value={item.trackingCode} />
          <Detail icon="layers-outline" label="Volumes" value={String(item.volumes)} />
          <Detail icon="person-outline" label="Recebido por" value={item.receivedBy} />
          <Detail icon="time-outline" label="Recebido em" value={new Date(item.receivedAt).toLocaleString("pt-BR")} last />
        </View>
        {item.status === "pending" && <>
          <Text style={styles.section}>CONFIRMAR RETIRADA</Text>
          <Text style={styles.help}>Digite o PIN de quatro dígitos apresentado pelo morador.</Text>
          <TextInput value={pin} onChangeText={setPin} keyboardType="number-pad" secureTextEntry maxLength={4} placeholder="••••" placeholderTextColor="#AAB1AC" style={styles.pin} />
          <PrimaryButton title="Confirmar entrega" disabled={pin.length !== 4} onPress={collect} />
          <Pressable onPress={resend} style={styles.resend}>
            <Ionicons name="send-outline" size={18} color={colors.primary} />
            <Text style={styles.resendText}>Reenviar código ao morador</Text>
          </Pressable>
          <Text style={styles.notificationMeta}>Notificações solicitadas: {item.notificationCount ?? 1}</Text>
        </>}
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Detail({ icon, label, value, last = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; last?: boolean }) {
  return <View style={[styles.detail, last && { borderBottomWidth: 0 }]}><Ionicons name={icon} size={19} color={colors.primary} /><View style={{ flex: 1 }}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  name: { color: colors.ink, fontSize: 21, fontWeight: "900" },
  unit: { color: colors.muted, fontSize: 13, marginTop: 4 },
  card: { borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 17 },
  detail: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.muted, fontSize: 11 },
  value: { color: colors.ink, fontSize: 14, fontWeight: "800", marginTop: 2 },
  section: { color: colors.muted, fontSize: 11, letterSpacing: 1.1, fontWeight: "900", marginTop: 30 },
  help: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 7 },
  pin: { height: 68, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, color: colors.ink, fontSize: 28, fontWeight: "900", letterSpacing: 12, textAlign: "center", marginVertical: 17 },
  resend: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, marginTop: 8 },
  resendText: { color: colors.primary, fontSize: 14, fontWeight: "800" },
  notificationMeta: { color: colors.muted, fontSize: 11, textAlign: "center" },
});
