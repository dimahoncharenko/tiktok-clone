import { ReactNode, createContext, useEffect, useState } from "react";

import { Like } from "../types/like";
import { Following } from "../hooks/useFollowingsFollowers";
import { Follower } from "../types/follower";
import { Friend, calculateFriends } from "../lib/friends/utils";

type AppStateContext = {
  likes: Like[];
  following: Following[];
  followers: Follower[];
  friends: Friend[];
};

export const appStateContext = createContext({} as AppStateContext);

type AppStateProviderProps = {
  children: ReactNode;
  value: AppStateContext;
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
