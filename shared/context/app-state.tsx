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

type Following = SameAs<Follower>;

type AppStateContext = {
  likes: Like[];
  getLikesByUser: (user: User) => void;
  resetAppState: () => void;
  setLikes: Dispatch<SetStateAction<Like[]>>;
  following: Following[];
  followers: Follower[];
  getFollowings: (user: User) => Promise<void>;
  getFollowers: (user: User) => Promise<void>;
};

export const appStateContext = createContext<AppStateContext>(
  {} as AppStateContext
);

type Props = {
  children: ReactNode;
};

export const AppState = ({ children }: Props) => {
  const [likes, setLikes] = useState<Like[]>([]);
  const {
    setFollowers,
    setFollowings,
    followers,
    following,
    getFollowers,
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
    <appStateContext.Provider
      value={{
        likes,
        getLikesByUser,
        resetAppState,
        setLikes,
        following,
        followers,
        getFollowings,
        getFollowers,
      }}
    >
      {children}
    </appStateContext.Provider>
  );
};
