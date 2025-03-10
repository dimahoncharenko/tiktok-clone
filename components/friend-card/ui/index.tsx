import { useRouter } from "expo-router";
import { Image, View } from "react-native";

import { MenuItem } from "@/components/menu-item";
import { User } from "@/shared/types/user";

type Props = {
  user: User;
  avatar: string;
};

export const FriendCard = ({ user, avatar }: Props) => {
  const router = useRouter();

  return (
    <MenuItem
      passive={false}
      heading={user.username}
      content="Say hi"
      func={() =>
        router.push({
          pathname: "/(chat)/[id]",
          params: { id: user.id },
        })
      }
      icon={
        <View>
          <Image
            source={{ uri: avatar || "https://placehold.co/40x40" }}
            className="size-12 bg-black rounded-full"
          />
        </View>
      }
    />
  );
};
