import { ReactNode, createContext, useEffect, useState } from "react";

import { Like } from "../types/like";
import { FollowingWithAvatar } from "../hooks/useFollowingsFollowers";
import { Friend, calculateFriends } from "../lib/friends/utils";

type AppStateContext = {
  likes: Like[];
  following: FollowingWithAvatar[];
  followers: FollowingWithAvatar[];
  friends: Friend[];
};

export const appStateContext = createContext({} as AppStateContext);

type AppStateProviderProps = {
  children: ReactNode;
  value: Omit<AppStateContext, "friends">;
};

export const AppStateProvider = ({
  children,
  value,
}: AppStateProviderProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    setFriends(() => calculateFriends(value.following, value.followers));
  }, [value.following, value.followers]);

  return (
    <appStateContext.Provider value={{ ...value, friends }}>
      {children}
    </appStateContext.Provider>
  );
};
