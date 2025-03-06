import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { VirtualizedList } from "react-native";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import {
  Message,
  sendMessage,
  subscribeToChatByID,
  unsubscribeFromChat,
} from "../lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/shared/context/auth-provider";
import { chatService, getUsersKey } from "@/shared/lib/chat";
import { CommentCard } from "@/components/comment-card";
import { AddComment } from "@/components/add-comment";
import { isArrayNotEmpty } from "@/shared/lib/utils";
import { ChatMessage } from "@/shared/types/chat";
import { Header } from "@/components/header";

type FormValues = {
  message: string;
};

export function ChatScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const usersKey = getUsersKey(`${params.id}`, `${user?.id}`);

  const { data, refetch } = useQuery({
    queryKey: ["chat", usersKey],
    queryFn: async () => await chatService.getChat(usersKey),
  });

  useEffect(() => {
    const channel = subscribeToChatByID({
      usersKey,
      onChangeCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["chat", usersKey] });
      },
    });

    return () => {
      unsubscribeFromChat(channel);
    };
  }, [usersKey, queryClient]);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      message: "",
    },
  });

  const submit = async (values: FormValues) => {
    const newMessage = new Message(
      `${params.id}`,
      `${user?.id}`,
      values.message
    );

    await sendMessage(newMessage);

    await refetch();
    setValue("message", "");
  };

  return (
    <SafeAreaView className="flex-1">
      <Header title="Comments" color="black" />
      {isArrayNotEmpty(data) && (
        <VirtualizedList
          className="flex-1 px-6"
          data={data}
          keyExtractor={(item) => item.id}
          getItemCount={() => data.length}
          getItem={(data, index) => data[index] || null}
          renderItem={({ item }: { item: ChatMessage }) => {
            return (
              <CommentCard
                comment={{
                  content: item.content,
                  created_at: item.created_at,
                  id: item.id,
                  user_id: item.user_id,
                  video_id: "",
                  video_user_id: "",
                }}
                username={`${user?.username}`}
              />
            );
          }}
        />
      )}
      <AddComment control={control} handleSubmit={handleSubmit(submit)} />
    </SafeAreaView>
  );
}
