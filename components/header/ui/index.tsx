import { cn } from "@/shared/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  enableTurnBack?: boolean;
  enableSearch?: boolean;
  classNames?: Partial<{
    root: string;
    title: string;
  }>;
  color?: string;
};

export const Header = ({
  title,
  classNames,
  enableTurnBack = true,
  enableSearch = true,
  color = "white",
}: Props) => {
  const router = useRouter();

  const handleReturnBack = () => {
    router.back();
  };

  const handleEnterSearchScreen = () => {
    router.push("/search");
  };

  return (
    <View
      className={cn(
        "flex-row items-center justify-between py-4 px-3",
        classNames?.root
      )}
    >
      <View className="size-8">
        {enableTurnBack && (
          <TouchableOpacity onPress={handleReturnBack}>
            <Ionicons name="chevron-back-outline" size={30} color={color} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text
          className={cn("text-white text-3xl font-semibold", classNames?.title)}
          style={{
            color,
          }}
        >
          {title}
        </Text>
      </View>
      <View className="size-8">
        {enableSearch && (
          <TouchableOpacity onPress={handleEnterSearchScreen}>
            <Ionicons name="search" size={30} color={color} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
