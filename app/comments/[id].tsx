import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, VirtualizedList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/header";
import { useAuthContext } from "@/shared/context/auth-provider";
import { commentsService } from "@/shared/lib/comments";
import { Comment } from "@/shared/types/comment";
import { CommentCard } from "@/components/comment-card";
import { AddComment } from "@/components/add-comment";

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

    console.log("Is about to add comment");

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
      <AddComment control={control} handleSubmit={handleSubmit(submit)} />
    </SafeAreaView>
  );
}
