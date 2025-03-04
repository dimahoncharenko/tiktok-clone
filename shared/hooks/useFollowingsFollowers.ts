import { useState } from "react";

import { SameAs } from "../types";
import { Follower } from "../types/follower";
import { userService } from "../lib/user";
import { User } from "../types/user";

export type Following = SameAs<Follower>;

export const useFollowingsFollowers = () => {
  const [following, setFollowings] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);

  const getFollowings = async (user_id: string) => {
    try {
      const res = await fetchFollowings(user_id);
      setFollowings(() => res || []);
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
      setFollowers(() => res || []);
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
