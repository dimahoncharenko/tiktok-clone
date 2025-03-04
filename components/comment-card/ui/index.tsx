import { formatDate } from "@/shared/lib/date/utils";
import { Comment } from "@/shared/types/comment";
import { UserMessage } from "@/shared/ui-blocks/user-message";

type Props = {
  username: string;
  comment: Comment;
};

export const CommentCard = ({ username, comment }: Props) => {
  return (
    <UserMessage
      imageSource={{ uri: "https://placehold.co/40x40" }}
      heading={username}
      content={comment.content}
      timestamp={formatDate(comment.created_at)}
    />
  );
};
