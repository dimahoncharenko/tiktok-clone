import { Text, View, ImageSourcePropType, Image } from "react-native";

type Props = {
  classes?: Partial<{
    root: string;
    image: string;
  }>;
  heading: string;
  content: string;
  timestamp?: string;
  imageSource?: ImageSourcePropType;
};
export const UserMessage = ({
  classes,
  content,
  heading,
  timestamp,
  imageSource,
}: Props) => {
  return (
    <View className="flex-row items-center gap-2 py-2">
      {imageSource && (
        <View>
          <Image
            source={imageSource}
            className="size-12 bg-black rounded-full"
          />
        </View>
      )}
      <View>
        <Text className="text-sm font-medium text-gray-900">{heading}</Text>
        <Text className="text-sm text-gray-500">{content}</Text>
        {timestamp && (
          <Text className="text-sm text-gray-500">{timestamp}</Text>
        )}
      </View>
    </View>
  );
};
