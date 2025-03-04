import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  VirtualizedList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/header";
import { useAuthContext } from "@/shared/context/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { commentsService } from "@/shared/lib/comments";
import { Comment } from "@/shared/types/comment";
import { CommentCard } from "@/components/comment-card";

type FormValues = {
  message: string;
};

export default function () {
  const params: { id: string } = useLocalSearchParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuthContext();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    (async () => {
      try {
        await getComments();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const getComments = async () => {
    const res = await commentsService.getAllCommentsByVideoId(params.id);
    setComments([...res] || []);
  };

  const addComment = async (message: string) => {
    if (!message.trim())
      throw new Error("Please add some content to the comment");
    if (!user) throw new Error("User is not logged in!");

    await commentsService.postComment(user.id, params.id, message);
    await getComments();
  };

  const submit = async (values: FormValues) => {
    try {
      await addComment(values.message);
      setValue("message", "");
      Keyboard.dismiss();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Header title="Comments" color="black" />
      <VirtualizedList
        className="flex-1 px-6"
        data={comments}
        keyExtractor={(item) => item.id}
        getItemCount={() => comments.length}
        getItem={(data, index) => data[index] || null}
        renderItem={({ item }: { item: Comment }) => {
          return <CommentCard comment={item} username={`${user?.username}`} />;
        }}
      />
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
                onPress={handleSubmit(submit)}
              >
                <Ionicons name="arrow-forward" color="white" size={24} />
              </TouchableOpacity>
            </View>
          )}
          name="message"
        />
      </View>
    </SafeAreaView>
  );
}
