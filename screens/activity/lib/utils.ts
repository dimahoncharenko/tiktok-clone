import { Comment } from "@/shared/types/comment";
import { Like } from "@/shared/types/like";

export type Activities = (Comment | Like)[];

export const sortActivities = (array: Activities) => {
  return array.sort(
    (a, b) =>
      new Date(b.created_at).getDate() - new Date(a.created_at).getDate()
  );
};
