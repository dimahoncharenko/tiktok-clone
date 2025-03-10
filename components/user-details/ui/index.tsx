import { Image, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { useAuthContext } from "@/shared/context/auth-provider";
import { User } from "@/shared/types/user";
import { saveUserAvatar } from "../lib/utils";
import { userService } from "@/shared/lib/user";
import { KEYS } from "@/shared/constants/env-keys";

type Props = {
  user?: User;
  following: number;
  followers: number;
  likesCount: number;
};

export const UserDetails = ({
  followers,
  following,
  user,
  likesCount,
}: Props) => {
  const { signOut, user: currentUser } = useAuthContext();

  const changeProfilePicture = async () => {
    if (user && currentUser?.id !== user?.id) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    if (result.assets) {
      const res = await saveUserAvatar({
        uri: result.assets[0].uri,
        user_id: `${currentUser?.id}`,
      });

      await userService.updateUser({
        id: `${currentUser?.id}`,
        avatar_uri: KEYS.AVATAR_STORAGE_URL + res.fullPath,
      });
    }
  };

  return (
    <View className="py-10 px-4 flex-1 items-center">
      <TouchableOpacity onPress={changeProfilePicture}>
        <Image
          source={{
            uri: user ? user.avatar_uri : currentUser?.avatar_uri,
          }}
          className="size-20 rounded-full bg-black"
        />
      </TouchableOpacity>
      <Text className="text-2xl mr-4 font-bold my-3 mt-4">
        @{user ? user.username : currentUser?.username}
      </Text>
      <View className="flex-row w-full justify-around mr-6">
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
          <Text>{likesCount}</Text>
        </View>
      </View>
      {!user && (
        <TouchableOpacity
          className="bg-black rounded-lg w-full mt-10"
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
