import { Dispatch, ReactNode, SetStateAction, createContext } from "react";

import { User } from "../types/user";
import { Like } from "../types/like";
import { useFollowingsFollowers } from "../hooks/useFollowingsFollowers";
import { AppActionsProvider, appActionsContext } from "./app-actions";
import { AppStateProvider, appStateContext } from "./app-state";
import { useLikes } from "../hooks/useLikes";
import { Follower, Following } from "../types/follower";

type DistributionContext = {
  likes: Like[];
  following: Following[];
  followers: Follower[];
  getLikesByUser: (user: User) => void;
  getLikesByVideoUser: (user: User) => Promise<void>;
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

  const { getLikesByUser, getLikesByVideoUser, likes, setLikes } = useLikes();

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
        getLikesByVideoUser,
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
            getLikesByUser,
            getLikesByVideoUser,
          }}
        >
          {children}
        </AppActionsProvider>
      </AppStateProvider>
    </distributionContext.Provider>
  );
};
