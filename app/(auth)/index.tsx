import { useRouter } from "expo-router";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { ErrorMessage } from "../../shared/ui-blocks";
import { handleLoginError } from "@/lib/login/utils";
import { useAuthContext } from "@/shared/context/AuthProvider";

type FormValues = {
  email: string;
  password: string;
};

export default function AuthScreen() {
  const { signIn } = useAuthContext();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await signIn(data);
      router.push("/(tabs)");
    } catch (err) {
      handleLoginError(err);
    }
  };

  return (
    <View className="bg-white flex-1 justify-center items-center">
      <View className="flex flex-col gap-7 w-full p-4">
        <Text className="text-3xl font-black">Log In</Text>
        <View className="relative">
          <Controller
            name="email"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                textContentType="emailAddress"
                value={value}
                placeholder="Your email"
                keyboardType="email-address"
                autoComplete="email"
                className="w-full rounded-lg bg-white p-4 border border-gray-300"
              />
            )}
          />
          {errors.email && (
            <ErrorMessage className="absolute -bottom-6 left-1">
              {errors.email.message}
            </ErrorMessage>
          )}
        </View>

        <View className="relative">
          <Controller
            name="password"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Your password"
                secureTextEntry
                textContentType="password"
                className="w-full rounded-lg bg-white p-4 border border-gray-300"
              />
            )}
          />
          {errors.password && (
            <ErrorMessage className="absolute -bottom-6 left-1">
              {errors.password.message}
            </ErrorMessage>
          )}
        </View>
        <TouchableOpacity
          className="bg-black rounded-lg"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="p-4 text-center text-white text-2xl">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text className="text-center -mt-6 text-black text-lg underline">
            Don't have an account?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
