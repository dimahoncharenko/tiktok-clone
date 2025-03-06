import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, VirtualizedList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useAuthContext } from "@/shared/context/auth-provider";
import { CommentCard } from "@/components/comment-card";
import { commentsService } from "@/shared/lib/comments";
import { AddComment } from "@/components/add-comment";
import { isArrayNotEmpty } from "@/shared/lib/utils";
import { Comment } from "@/shared/types/comment";
import { Header } from "@/components/header";

type FormValues = {
  message: string;
};

type Props = {
  video_id: string;
};

export function CommentsScreen({ video_id }: Props) {
  const { data: comments, refetch } = useQuery({
    queryKey: ["comments", video_id],
    queryFn: async () =>
      await commentsService.getAllCommentsByVideoId(video_id),
  });

  const { user } = useAuthContext();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      message: "",
    },
  });

  const addComment = async (message: string) => {
    if (!message.trim())
      throw new Error("Please add some content to the comment");

    if (!user) throw new Error("User is not logged in!");

    await commentsService.postComment(user.id, video_id, message);
    await refetch();
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
      {isArrayNotEmpty(comments) && (
        <VirtualizedList
          className="flex-1 px-6"
          data={comments}
          keyExtractor={(item) => item.id}
          getItemCount={() => comments.length}
          getItem={(data, index) => data[index] || null}
          renderItem={({ item }: { item: Comment }) => {
            return (
              <CommentCard comment={item} username={`${user?.username}`} />
            );
          }}
        />
      )}
      <AddComment control={control} handleSubmit={handleSubmit(submit)} />
    </SafeAreaView>
  );
}
