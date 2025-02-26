import { Header } from "@/components/header";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function () {
  const params = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Header title="Username" color="black" />
      <Text>Hello {params.id}</Text>
    </SafeAreaView>
  );
}
