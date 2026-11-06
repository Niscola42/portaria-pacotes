import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StoreProvider } from "@/store";
import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: "800" },
        contentStyle: { backgroundColor: colors.background },
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="new-package" options={{ title: "Nova encomenda" }} />
        <Stack.Screen name="select-resident" options={{ title: "Selecionar destinatário" }} />
        <Stack.Screen name="confirm-package" options={{ title: "Confirmar registro" }} />
        <Stack.Screen name="success" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="pending" options={{ title: "Encomendas pendentes" }} />
        <Stack.Screen name="package/[id]" options={{ title: "Detalhes da encomenda" }} />
        <Stack.Screen name="history" options={{ title: "Histórico" }} />
      </Stack>
    </StoreProvider>
  );
}
