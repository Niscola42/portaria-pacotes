import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, shadow } from "./theme";

export function Screen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.screen} edges={["bottom"]}>{children}</SafeAreaView>;
}

export function PrimaryButton({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, (pressed || disabled) && styles.buttonPressed]}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>✓</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

export function Badge({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "amber" }) {
  return (
    <View style={[styles.badge, tone === "amber" && styles.badgeAmber]}>
      <Text style={[styles.badgeText, tone === "amber" && styles.badgeTextAmber]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  primaryButton: { minHeight: 54, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  buttonPressed: { opacity: 0.55 },
  primaryButtonText: { color: "white", fontSize: 16, fontWeight: "800" },
  empty: { margin: 20, marginTop: 50, borderRadius: 22, backgroundColor: colors.surface, alignItems: "center", padding: 34, ...shadow },
  emptyIcon: { width: 48, height: 48, borderRadius: 24, overflow: "hidden", textAlign: "center", lineHeight: 48, backgroundColor: colors.accent, color: colors.primary, fontSize: 24, fontWeight: "800" },
  emptyTitle: { marginTop: 16, color: colors.ink, fontSize: 19, fontWeight: "800" },
  emptyBody: { marginTop: 7, textAlign: "center", color: colors.muted, fontSize: 14, lineHeight: 21 },
  badge: { borderRadius: 100, backgroundColor: colors.accent, paddingHorizontal: 10, paddingVertical: 5 },
  badgeAmber: { backgroundColor: colors.warningSoft },
  badgeText: { color: colors.primaryDark, fontSize: 12, fontWeight: "800" },
  badgeTextAmber: { color: colors.warning },
});
