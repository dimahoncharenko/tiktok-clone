import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function AuthScreen() {
  return (
    <View className="bg-black flex-1 justify-center items-center ">
      <Text className="text-white">Login</Text>
      <Link href="/(tabs)" className="bg-white rounded-lg">
        Home
      </Link>
    </View>
  );
}
