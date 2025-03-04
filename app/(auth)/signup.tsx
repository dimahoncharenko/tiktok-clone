import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { Controller, useForm, FieldValues } from "react-hook-form";
import { useRouter } from "expo-router";

import {
  FormValues,
  handleSignUpError,
  validationSchema,
} from "@/lib/signup/utils";
import { useYupValidationResolver } from "@/shared/hooks/useYupValidationSchema";
import { useAuthContext } from "@/shared/context/auth-provider";
import { ErrorMessage } from "../../shared/ui-blocks";

export default function AuthScreen() {
  const { signUp } = useAuthContext();

  const resolver = useYupValidationResolver(validationSchema);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver,
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      const fields = data as FormValues;

      await signUp(fields);

      router.push("/(tabs)");
    } catch (err) {
      handleSignUpError(err);
    }
  };

  return (
    <View className="bg-white flex-1 justify-center items-center">
      <View className="flex flex-col gap-7 w-full p-4">
        <Text className="text-3xl font-black">Sign Up</Text>
        <View className="relative">
          <Controller
            name="username"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Your name"
                className="w-full rounded-lg bg-white p-4 border border-gray-300"
              />
            )}
          />
          {errors.username?.message && (
            <ErrorMessage className="absolute -bottom-6 left-1">
              {errors.username.message?.toString()}
            </ErrorMessage>
          )}
        </View>
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
                value={value}
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholder="Your email"
                autoComplete="email"
                className="w-full rounded-lg bg-white p-4 border border-gray-300"
              />
            )}
          />
          {errors.email?.message && (
            <ErrorMessage className="absolute -bottom-6 left-1">
              {errors.email.message?.toString()}
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
          {errors.password?.message && (
            <ErrorMessage className="absolute -bottom-6 left-1">
              {errors.password.message?.toString()}
            </ErrorMessage>
          )}
        </View>
        <TouchableOpacity
          className="bg-black rounded-lg"
          onPress={handleSubmit((props) => onSubmit(props))}
        >
          <Text className="p-4 text-center text-white text-2xl">Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(auth)")}>
          <Text className="text-center -mt-6 text-black text-lg underline">
            Already have an account?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
