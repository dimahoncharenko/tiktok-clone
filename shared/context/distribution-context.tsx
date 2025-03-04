import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

import { User } from "../types/user";
import { likeService } from "../lib/likes";
import { Like } from "../types/like";
import { Follower } from "../types/follower";
import { SameAs } from "../types";
import { useFollowingsFollowers } from "../hooks/useFollowingsFollowers";
import { AppActionsProvider, appActionsContext } from "./app-actions";
import { AppStateProvider, appStateContext } from "./app-state";

type Following = SameAs<Follower>;

type DistributionContext = {
  likes: Like[];
  following: Following[];
  followers: Follower[];
  getLikesByUser: (user: User) => void;
  resetAppState: () => void;
  setLikes: Dispatch<SetStateAction<Like[]>>;
  getFollowings: (user: string) => Promise<void>;
  getFollowers: (user: string) => Promise<void>;
  setFollowers: Dispatch<SetStateAction<Follower[]>>;
  setFollowings: Dispatch<SetStateAction<Following[]>>;
};

const distributionContext = createContext<DistributionContext>(
  {} as DistributionContext
);

export const DISTRIBUTION_CONTEXT = {
  distributionContext,
  appActionsContext,
  appStateContext,
};

type Props = {
  children: ReactNode;
};

export const DistributionContext = ({ children }: Props) => {
  const [likes, setLikes] = useState<Like[]>([]);
  const {
    setFollowers,
    setFollowings,
    followers,
    following,
    getFollowers,
    followUser,
    unfollowUser,
    getFollowings,
  } = useFollowingsFollowers();

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
    <distributionContext.Provider
      value={{
        likes,
        getLikesByUser,
        resetAppState,
        setLikes,
        following,
        followers,
        getFollowings,
        getFollowers,
        setFollowers,
        setFollowings,
      }}
    >
      <AppStateProvider value={{ followers, following, likes }}>
        <AppActionsProvider
          value={{
            getFollowers,
            getFollowings,
            setFollowers,
            setFollowings,
            setLikes,
            followUser,
            unfollowUser,
          }}
        >
          {children}
        </AppActionsProvider>
      </AppStateProvider>
    </distributionContext.Provider>
  );
};
