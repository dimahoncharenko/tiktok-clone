import {
  Text,
  TextInput,
  TouchableOpacity,
  VirtualizedList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebounceValue } from "usehooks-ts";
import { useEffect, useState } from "react";
import { View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Header } from "@/components/header";
import { userService } from "@/shared/lib/user";
import { User } from "@/shared/types/user";

export default function () {
  const [text, setText] = useState("");
  const [debouncedSearch] = useDebounceValue(text, 300);
  const [users, setUsers] = useState<User[]>([]);

  const search = async (value: string) => {
    if (value.length < 2) return;

    try {
      const res = await userService.getUsersByName(value);
      setUsers(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    search(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <SafeAreaView>
      <Header title="Search" color="black" enableSearch={false} />
      <View className="p-4">
        <TextInput
          onChangeText={setText}
          value={text}
          keyboardType="default"
          placeholder="Search"
          className="w-full rounded-lg bg-white p-4 border border-gray-300"
        />
        <View className="gap-1 py-3">
          <VirtualizedList
            keyExtractor={(item: User) => item.id.toString()}
            data={users}
            getItemCount={() => users.length}
            getItem={(users, index) => users[index]}
            className="h-full"
            renderItem={({ item }) => (
              <View className="bg-white border border-gray-300 rounded-md flex-row items-center pr-4 justify-between">
                <Text className="p-3 text-lg font-medium">{item.username}</Text>
                <TouchableOpacity>
                  <AntDesign name="adduser" size={24} color="black" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
