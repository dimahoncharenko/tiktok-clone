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
import { userService } from "../lib/user";

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
  const [following, setFollowings] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);

  const getLikesByUser = async (user: User) => {
    try {
      const response = await likeService.getLikesByUser(user.id);
      setLikes(() => response);
    } catch (err) {
      setLikes([]);
      console.error(err);
    }
  };

  const getFollowings = async (user: User) => {
    try {
      const res = await userService.getFollowings(user.id);
      setFollowings(() => res);
    } catch (err) {
      setFollowings([]);
      console.error(err);
    }
  };

  const getFollowers = async (user: User) => {
    try {
      const res = await userService.getFollowers(user.id);
      setFollowers(() => res);
    } catch (err) {
      setFollowers([]);
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
