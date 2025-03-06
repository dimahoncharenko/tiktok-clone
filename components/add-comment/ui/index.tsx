import { Ionicons } from "@expo/vector-icons";
import { Controller, ControllerProps } from "react-hook-form";
import { TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  control: ControllerProps<{ message: string }>["control"];
  handleSubmit: () => void;
};

export const AddComment = ({ control, handleSubmit }: Props) => {
  return (
    <View className="p-4">
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="flex-row items-center justify-between gap-3">
            <TextInput
              className="border border-gray-300 rounded-xl h-12 w-[87%]"
              placeholder="Put a comment here"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            <TouchableOpacity
              className="p-2 rounded-full bg-red-500"
              onPress={() => handleSubmit()}
            >
              <Ionicons name="arrow-forward" color="white" size={24} />
            </TouchableOpacity>
          </View>
        )}
        name="message"
      />
    </View>
  );
};
