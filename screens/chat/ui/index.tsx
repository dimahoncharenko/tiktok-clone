import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, VirtualizedList } from "react-native";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import {
  Message,
  sendMessage,
  subscribeToChatByID,
  unsubscribeFromChat,
} from "../lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentCard } from "@/components/comment-card";
import { AddComment } from "@/components/add-comment";
import { isArrayNotEmpty } from "@/shared/lib/utils";
import { ChatMessage } from "@/shared/types/chat";
import { chatService } from "@/shared/lib/chat";
import { Header } from "@/components/header";

type FormValues = {
  message: string;
};

type Props = {
  usersKey: string;
};

export function ChatScreen({ usersKey }: Props) {
  const queryClient = useQueryClient();

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
    const [chat_user_id, user_id] = usersKey.split(":");

    const newMessage = new Message(chat_user_id, user_id, values.message);

    await sendMessage(newMessage);

    await refetch();
    setValue("message", "");
    Keyboard.dismiss();
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
                username={`${item?.User.username}`}
              />
            );
          }}
        />
      )}
      <AddComment control={control} handleSubmit={handleSubmit(submit)} />
    </SafeAreaView>
  );
}
