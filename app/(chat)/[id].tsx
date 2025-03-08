import { ChatScreen } from "@/screens/chat";
import { useAuthContext } from "@/shared/context/auth-provider";
import { getUsersKey } from "@/shared/lib/chat";
import { useLocalSearchParams } from "expo-router";

export default function () {
  const params: { id: string } = useLocalSearchParams();
  const { user } = useAuthContext();

  const usersKey = getUsersKey(`${params.id}`, `${user?.id}`);

  return <ChatScreen usersKey={usersKey} />;
}
