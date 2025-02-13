import { useAuthContext } from "@/shared/context/AuthProvider";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { signOut } = useAuthContext();

  return (
    <View className="bg-white flex-1 justify-center items-center ">
      <Text className="text-black">Profile</Text>
      <TouchableOpacity className="bg-black rounded-lg" onPress={signOut}>
        <Text className="p-4 text-center text-white text-2xl">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
