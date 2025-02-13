import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function AuthScreen() {
  return (
    <View className="bg-white flex-1 justify-center items-center ">
      <Text className="text-black">Login</Text>
      <Link
        href="/(tabs)"
        className="bg-black py-2 px-4 mt-4 text-white text-2xl rounded-lg"
      >
        Home
      </Link>
    </View>
  );
}
