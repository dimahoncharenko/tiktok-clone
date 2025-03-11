import { Dispatch, ReactNode, SetStateAction, createContext } from "react";

import { User } from "../types/user";
import { Like } from "../types/like";
import { Follower } from "../types/follower";
import {
  FollowerWithAvatar,
  FollowingWithAvatar,
} from "../hooks/useFollowingsFollowers";

type AppActionsContext = {
  getLikesByUser: (user: User) => Promise<void>;
  getLikesByVideoUser: (user: User) => Promise<void>;
  resetAppState: () => void;
  getFollowers: (user: string) => Promise<void>;
  getFollowings: (user: string) => Promise<void>;
  setLikes: Dispatch<SetStateAction<Like[]>>;
  followUser: (user: User, follow_id: string) => Promise<void>;
  unfollowUser: (user: User, follow_id: string) => Promise<void>;
};

export const appActionsContext = createContext({} as AppActionsContext);

type AppActionsProviderProps = {
  children: ReactNode;
  value: {
    setLikes: Dispatch<SetStateAction<Like[]>>;
    getLikesByUser: (user: User) => Promise<void>;
    setFollowers: Dispatch<SetStateAction<FollowerWithAvatar[]>>;
    setFollowings: Dispatch<SetStateAction<FollowingWithAvatar[]>>;
    getFollowers: (user: string) => Promise<void>;
    getFollowings: (user: string) => Promise<void>;
    followUser: (user: User, follow_id: string) => Promise<void>;
    unfollowUser: (user: User, follow_id: string) => Promise<void>;
    getLikesByVideoUser: (user: User) => Promise<void>;
  };
};

export const AppActionsProvider = ({
  children,
  value: {
    getFollowers,
    setFollowers,
    getFollowings,
    setFollowings,
    setLikes,
    followUser,
    unfollowUser,
    getLikesByUser,
    getLikesByVideoUser,
  },
}: AppActionsProviderProps) => {
  const resetAppState = () => {
    setLikes([]);
    setFollowings([]);
    setFollowers([]);
  };

  return (
    <appActionsContext.Provider
      value={{
        getLikesByVideoUser,
        getLikesByUser,
        resetAppState,
        getFollowers,
        getFollowings,
        setLikes,
        followUser,
        unfollowUser,
      }}
    >
      {children}
    </appActionsContext.Provider>
  );
};
