import { Image, Text, TouchableOpacity, View } from "react-native";

import { useAuthContext } from "@/shared/context/AuthProvider";
import { User } from "@/shared/types/user";

type Props = {
  user?: User;
  following: number;
  followers: number;
};

export const UserDetails = ({ followers, following, user }: Props) => {
  const { signOut, user: currentUser } = useAuthContext();

  const changeProfilePicture = async () => {};

  return (
    <View className="py-10 flex-1 items-center">
      <TouchableOpacity onPress={changeProfilePicture}>
        <Image
          source={{ uri: "https://placehold.co/40x40" }}
          className="size-20 rounded-full bg-black"
        />
      </TouchableOpacity>
      <Text className="text-2xl mr-4 font-bold my-3">
        @{user ? user.username : currentUser?.username}
      </Text>
      <View className="flex-row w-full justify-around">
        <View className="items-center">
          <Text className="font-semibold mb-1">Following</Text>
          <Text>{following}</Text>
        </View>
        <View className="items-center">
          <Text className="font-semibold mb-1">Followers</Text>
          <Text>{followers}</Text>
        </View>
        <View className="items-center">
          <Text className="font-semibold mb-1">Likes</Text>
          <Text>1000</Text>
        </View>
      </View>
      {!user && (
        <TouchableOpacity
          className="bg-black rounded-lg mt-auto"
          onPress={signOut}
        >
          <Text className="px-6 py-2 text-center text-white text-2xl">
            Logout
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
