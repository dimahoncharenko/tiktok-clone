import { useAuthContext } from "@/shared/context/AuthProvider";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { user } = useAuthContext();

  return (
    <View className="bg-white flex-1 justify-center items-center ">
      <Text className="text-black">Home</Text>
      <Text className="text-black">User: {JSON.stringify(user)}</Text>
    </View>
  );
}
