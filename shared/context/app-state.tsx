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

type AppStateContext = {
  likes: Like[];
  getLikesByUser: (user: User) => void;
  resetAppState: () => void;
  setLikes: Dispatch<SetStateAction<Like[]>>;
};

export const appStateContext = createContext<AppStateContext>(
  {} as AppStateContext
);

type Props = {
  children: ReactNode;
};

export const AppState = ({ children }: Props) => {
  const [likes, setLikes] = useState<Like[]>([]);

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
  };

  return (
    <appStateContext.Provider
      value={{ likes, getLikesByUser, resetAppState, setLikes }}
    >
      {children}
    </appStateContext.Provider>
  );
};
