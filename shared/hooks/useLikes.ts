import { useState } from "react";

import { Like } from "../types/like";
import { User } from "../types/user";
import { likeService } from "../lib/likes";

export const useLikes = () => {
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

  const getLikesByVideoUser = async (user: User) => {
    try {
      const response = await likeService.getLikesByVideoUser(user.id);
      setLikes(() => response);
    } catch (err) {
      setLikes([]);
      console.error(err);
    }
  };

  return { likes, setLikes, getLikesByUser, getLikesByVideoUser };
};
