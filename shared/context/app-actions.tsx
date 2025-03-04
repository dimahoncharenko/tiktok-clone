import { Dispatch, ReactNode, SetStateAction, createContext } from "react";

import { User } from "../types/user";
import { likeService } from "../lib/likes";
import { Like } from "../types/like";
import { Follower } from "../types/follower";

type AppActionsContext = {
  getLikesByUser: (user: User) => Promise<void>;
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
    setFollowers: Dispatch<SetStateAction<Follower[]>>;
    setFollowings: Dispatch<SetStateAction<Follower[]>>;
    getFollowers: (user: string) => Promise<void>;
    getFollowings: (user: string) => Promise<void>;
    followUser: (user: User, follow_id: string) => Promise<void>;
    unfollowUser: (user: User, follow_id: string) => Promise<void>;
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
  },
}: AppActionsProviderProps) => {
  const getLikesByUser = async (user: User) => {
    try {
      const response = await likeService.getLikesByUser(user.id);
      setLikes(() => response);
    } catch (err) {
      setLikes([]);
      console.error(err);
    }
  };

  const resetAppState = () => {
    setLikes([]);
    setFollowings([]);
    setFollowers([]);
  };

  return (
    <appActionsContext.Provider
      value={{
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
