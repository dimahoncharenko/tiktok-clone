import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { VirtualizedList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CommentCard } from "@/components/comment-card";
import { Header } from "@/components/header";
import { useAuthContext } from "@/shared/context/auth-provider";
import { commentsService } from "@/shared/lib/comments";
import { Comment } from "@/shared/types/comment";
import { likeService } from "@/shared/lib/likes";
import { LikeCard } from "@/components/like-card";

export default function () {
  const { user } = useAuthContext();

  const { data: comments } = useQuery({
    queryKey: ["comments", user?.id],
    queryFn: async () => await commentsService.getAllCommentsByUserId(user!.id),
  });

  const { data: likes } = useQuery({
    queryKey: ["likes", user?.id],
    queryFn: async () => await likeService.getLikesByVideo(user!.id),
  });

  const activities = useMemo(() => {
    const array = [...(comments || []), ...(likes || [])];
    return array.sort(
      (a, b) =>
        new Date(b.created_at).getDate() - new Date(a.created_at).getDate()
    );
  }, [comments, likes]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Activity" color="black" />
      {comments && (
        <VirtualizedList
          data={activities}
          keyExtractor={(item: Comment) => item.id.toString()}
          getItemCount={() => activities.length}
          getItem={(activities, index) => activities[index]}
          className="h-full px-5"
          renderItem={({ item }) => (
            <>
              {item.content ? (
                <CommentCard comment={item} username={user!.username} />
              ) : (
                <LikeCard like={item} username={user!.username} />
              )}
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
}
