import { useLocalSearchParams } from "expo-router";

import { UserScreen } from "@/screens/user";

export default function () {
  const params: { id: string } = useLocalSearchParams();
  return <UserScreen user_id={params.id} />;
}
