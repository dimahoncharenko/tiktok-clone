import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon?: ReactNode;
  heading: string;
  content: string;
  rightIcon?: false | ReactNode;
};

export const ActivityFeedItem = ({
  icon,
  content,
  heading,
  rightIcon,
}: Props) => {
  const router = useRouter();

  const handleEnterFollowersScreen = () => {
    router.push("/(inbox)/followers");
  };

  return (
    <TouchableOpacity
      className="flex-row items-center w-full gap-3"
      onPress={handleEnterFollowersScreen}
    >
      {icon || ActivityFeedItem.UsersIcon()}
      <View>
        <Text className="text-sm font-medium text-gray-900">{heading}</Text>
        <Text className="text-sm text-gray-500">{content}</Text>
      </View>
      {rightIcon !== false ? rightIcon || ActivityFeedItem.ChevronIcon() : null}
    </TouchableOpacity>
  );
};

ActivityFeedItem.UsersIcon = () => {
  return (
    <View className="bg-blue-400 rounded-full size-10 justify-center items-center">
      <Ionicons name="people" size={26} color="white" />
    </View>
  );
};

ActivityFeedItem.ChevronIcon = () => {
  return (
    <Ionicons
      name="chevron-forward"
      className="ml-auto"
      size={16}
      color="black"
    />
  );
};
