import { useLocalSearchParams } from "expo-router";

import { CommentsScreen } from "@/screens/comments";

export default function () {
  const params: { id: string } = useLocalSearchParams();

  return <CommentsScreen video_id={params.id} />;
}
