import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton, Screen } from "@/components";
import { residents, residentLabel } from "@/data";
import { useStore } from "@/store";
import { colors } from "@/theme";

export default function NewPackageScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [manual, setManual] = useState(false);
  const [code, setCode] = useState("");
  const [scannedCode, setScannedCode] = useState<string>();
  const { packages } = useStore();
  const existingPackage = scannedCode
    ? packages.find((item) => item.trackingCode === scannedCode.trim().toUpperCase())
    : undefined;
  const existingResident = residents.find((item) => item.id === existingPackage?.residentId);

  function capture(value: string) {
    const clean = value.trim();
    if (!clean || scannedCode) return;
    setScannedCode(clean);
  }

  function proceed() {
    if (!scannedCode || existingPackage) return;
    router.push({ pathname: "/select-resident", params: { code: scannedCode } });
  }

  function submitManual() {
    if (!code.trim()) return;
    setManual(false);
    capture(code);
  }

  function scanAgain() {
    setCode("");
    setScannedCode(undefined);
  }

  if (!permission?.granted && !manual) {
    return (
      <Screen>
        <View style={styles.permission}>
          <View style={styles.bigIcon}><Ionicons name="camera-outline" size={38} color={colors.primary} /></View>
          <Text style={styles.permissionTitle}>Use a câmera para ler a etiqueta</Text>
          <Text style={styles.permissionBody}>Precisamos de acesso à câmera. A imagem não será salva nesta demonstração.</Text>
          <PrimaryButton title="Permitir acesso à câmera" onPress={requestPermission} />
          <Pressable onPress={() => setManual(true)}><Text style={styles.link}>Digitar o código manualmente</Text></Pressable>
        </View>
      </Screen>
    );
  }

  if (manual) {
    return (
      <Screen>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.manual}>
          <Text style={styles.label}>Código da encomenda</Text>
          <TextInput autoFocus value={code} onChangeText={setCode} autoCapitalize="characters" placeholder="Ex.: BR123456789XX" placeholderTextColor="#98A29B" style={styles.input} />
          <Text style={styles.help}>Use o código de rastreio impresso abaixo do código de barras.</Text>
          <PrimaryButton title="Verificar código" disabled={!code.trim()} onPress={submitManual} />
          {permission?.granted && <Pressable onPress={() => setManual(false)}><Text style={styles.link}>Voltar para a câmera</Text></Pressable>}
        </KeyboardAvoidingView>
      </Screen>
    );
  }

  return (
    <View style={styles.cameraPage}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        active={!scannedCode}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "code128", "code39", "ean13", "ean8", "itf14", "pdf417", "datamatrix"] }}
        onBarcodeScanned={scannedCode ? undefined : ({ data }) => capture(data)}
      />
      <View style={styles.overlay}>
        <View style={styles.scanHeader}><Text style={styles.scanTitle}>Aponte para o código da etiqueta</Text><Text style={styles.scanBody}>Mantenha o celular firme e aproxime lentamente.</Text></View>
        <View style={styles.frame}><View style={[styles.corner, styles.topLeft]} /><View style={[styles.corner, styles.topRight]} /><View style={[styles.corner, styles.bottomLeft]} /><View style={[styles.corner, styles.bottomRight]} /></View>
        {scannedCode && existingPackage ? (
          <View style={styles.resultCard}>
            <View style={styles.duplicateIcon}><Ionicons name="warning" size={21} color={colors.warning} /></View>
            <Text style={styles.duplicateTitle}>Código já registrado</Text>
            <Text numberOfLines={2} style={styles.resultCode}>{scannedCode}</Text>
            {existingResident && <Text style={styles.duplicateMeta}>{existingResident.name} · {residentLabel(existingResident)}{"\n"}{existingPackage.status === "pending" ? "Aguardando retirada" : "Encomenda já entregue"}</Text>}
            <PrimaryButton title="Abrir registro existente" onPress={() => router.push(`/package/${existingPackage.id}`)} />
            <Pressable onPress={scanAgain}><Text style={styles.scanAgain}>Ler outro código</Text></Pressable>
          </View>
        ) : scannedCode ? (
          <View style={styles.resultCard}>
            <View style={styles.resultCheck}><Ionicons name="checkmark" size={21} color="white" /></View>
            <Text style={styles.resultLabel}>Código identificado</Text>
            <Text numberOfLines={2} style={styles.resultCode}>{scannedCode}</Text>
            <PrimaryButton title="Continuar com este código" onPress={proceed} />
            <Pressable onPress={scanAgain}><Text style={styles.scanAgain}>Ler outro código</Text></Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setManual(true)} style={styles.manualButton}><Ionicons name="keypad-outline" size={20} color="white" /><Text style={styles.manualButtonText}>Digitar código</Text></Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  permission: { flex: 1, justifyContent: "center", padding: 28 },
  bigIcon: { alignSelf: "center", width: 76, height: 76, borderRadius: 25, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  permissionTitle: { color: colors.ink, fontSize: 23, textAlign: "center", fontWeight: "900" },
  permissionBody: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: "center", marginVertical: 12, marginBottom: 28 },
  link: { color: colors.primary, textAlign: "center", fontSize: 14, fontWeight: "800", padding: 18 },
  manual: { flex: 1, padding: 20, paddingTop: 38 },
  label: { color: colors.ink, fontSize: 14, fontWeight: "800", marginBottom: 8 },
  input: { height: 58, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 16, fontSize: 17, color: colors.ink, fontWeight: "700" },
  help: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 28 },
  cameraPage: { flex: 1, backgroundColor: "black" },
  overlay: { flex: 1, padding: 24, backgroundColor: "rgba(0,0,0,0.24)", justifyContent: "space-between", alignItems: "center" },
  scanHeader: { marginTop: 28, alignItems: "center" },
  scanTitle: { color: "white", fontSize: 20, fontWeight: "900", textAlign: "center" },
  scanBody: { color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 7 },
  frame: { width: "90%", height: 190, position: "relative" },
  corner: { position: "absolute", width: 45, height: 45, borderColor: "white" },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  manualButton: { marginBottom: 22, flexDirection: "row", gap: 9, alignItems: "center", backgroundColor: "rgba(0,0,0,0.62)", paddingHorizontal: 18, paddingVertical: 13, borderRadius: 100 },
  manualButtonText: { color: "white", fontWeight: "800" },
  resultCard: { width: "100%", borderRadius: 22, backgroundColor: colors.surface, padding: 18, alignItems: "center", marginBottom: 8 },
  resultCheck: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 9 },
  duplicateIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.warningSoft, alignItems: "center", justifyContent: "center", marginBottom: 9 },
  duplicateTitle: { color: colors.warning, fontSize: 15, fontWeight: "900" },
  duplicateMeta: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: -7, marginBottom: 15 },
  resultLabel: { color: colors.muted, fontSize: 11, fontWeight: "800" },
  resultCode: { color: colors.ink, fontSize: 16, fontWeight: "900", marginTop: 4, marginBottom: 15, textAlign: "center" },
  scanAgain: { color: colors.primary, fontSize: 14, fontWeight: "800", paddingTop: 15, paddingBottom: 2 },
});
