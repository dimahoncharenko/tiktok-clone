import { ReactNode, createContext, useContext } from "react";

import { Like } from "../types/like";
import { Following } from "../hooks/useFollowingsFollowers";
import { Follower } from "../types/follower";

type AppStateContext = {
  likes: Like[];
  following: Following[];
  followers: Follower[];
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
  return (
    <appStateContext.Provider value={value}>
      {children}
    </appStateContext.Provider>
  );
};
