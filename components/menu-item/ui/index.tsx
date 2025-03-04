import { cn } from "@/shared/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { isItString } from "../lib/utils";

type SharedMenuItemsParams = {
  icon?: ReactNode;
  heading: string;
  content: string;
  classes?: Partial<{
    root: string;
  }>;
  rightIcon?: false | ReactNode;
};

type PassiveMenuItem = {
  passive: true;
} & SharedMenuItemsParams;

type ActiveMenuItem = {
  passive: false;
  path?: string;
  func?: () => void;
} & SharedMenuItemsParams;

type MenuItemProps = PassiveMenuItem | ActiveMenuItem;

export const MenuItem = (props: MenuItemProps) => {
  const router = useRouter();
  const action = props.passive ? false : props.path || props.func;

  const handleAction = useCallback(() => {
    if (!action) return;

    if (isItString(action)) router.push(action as any);
    else action();
  }, [action]);

  return (
    <TouchableOpacity
      className={cn("flex-row items-center w-full gap-3", props.classes?.root)}
      onPress={!props.passive ? handleAction : undefined}
    >
      {props.icon || MenuItem.UsersIcon()}
      <View>
        <Text className="text-sm font-medium text-gray-900">
          {props.heading}
        </Text>
        <Text className="text-sm text-gray-500">{props.content}</Text>
      </View>
      {props.rightIcon !== false
        ? props.rightIcon || MenuItem.ChevronIcon()
        : null}
    </TouchableOpacity>
  );
};

MenuItem.UsersIcon = () => {
  return (
    <View className="bg-blue-400 rounded-full size-12 justify-center items-center">
      <Ionicons name="people" size={30} color="white" />
    </View>
  );
};

MenuItem.ChevronIcon = () => {
  return (
    <Ionicons
      name="chevron-forward"
      className="ml-auto"
      size={16}
      color="black"
    />
  );
};

MenuItem.ActivityIcon = () => {
  return (
    <View className="bg-red-400 rounded-full size-12 justify-center items-center">
      <Ionicons name="time" size={30} color="white" />
    </View>
  );
};
