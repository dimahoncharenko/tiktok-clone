import { useState } from "react";

import { Follower, Following } from "../types/follower";
import { userService } from "../lib/user";
import { User } from "../types/user";

export const useFollowingsFollowers = () => {
  const [following, setFollowings] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);

  const getFollowings = async (user_id: string) => {
    try {
      const res = await fetchFollowings(user_id);
      if (!res) throw new Error("There is no response fetching followings!");

      setFollowings(res);
    } catch (err) {
      setFollowings([]);
      console.error(err);
    }
  };

  const fetchFollowings = async (user_id: string) => {
    try {
      const res = await userService.getFollowings(user_id);
      return res as Following[];
    } catch (err) {
      console.error(err);
    }
  };

  const getFollowers = async (user_id: string) => {
    try {
      const res = await fetchFollowers(user_id);
      if (!res) throw new Error("There is no response fetching followers!");

      setFollowers(res);
    } catch (err) {
      setFollowers([]);
      console.error(err);
    }
  };

  const fetchFollowers = async (user_id: string) => {
    try {
      const res = await userService.getFollowers(user_id);
      return res as Follower[];
    } catch (err) {
      console.error(err);
    }
  };

  const followUser = async (user: User, followed_id: string) => {
    try {
      await userService.followUser(followed_id, `${user?.id}`);
      getFollowings(user.id);
      getFollowers(user.id);
    } catch (err) {
      console.error(err);
    }
  };

  const unfollowUser = async (user: User, unfollow_id: string) => {
    try {
      await userService.unfollowUser(unfollow_id, user.id);
      getFollowings(user.id);
      getFollowers(user.id);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    following,
    followers,
    getFollowings,
    getFollowers,
    setFollowers,
    setFollowings,
    followUser,
    unfollowUser,
  };
};
