import { useState } from "react";
import { SameAs } from "../types";
import { Follower } from "../types/follower";
import { userService } from "../lib/user";
import { User } from "../types/user";

export type Following = SameAs<Follower>;

export const useFollowingsFollowers = () => {
  const [following, setFollowings] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);

  const getFollowings = async (user: User) => {
    try {
      const res = await fetchFollowings(user);
      setFollowings(() => res || []);
    } catch (err) {
      setFollowings([]);
      console.error(err);
    }
  };

  const fetchFollowings = async (user: User) => {
    try {
      const res = await userService.getFollowings(user.id);
      return res as Following[];
    } catch (err) {
      console.error(err);
    }
  };

  const getFollowers = async (user: User) => {
    try {
      const res = await fetchFollowers(user);
      setFollowers(() => res || []);
    } catch (err) {
      setFollowers([]);
      console.error(err);
    }
  };

  const fetchFollowers = async (user: User) => {
    try {
      const res = await userService.getFollowers(user.id);
      return res as Follower[];
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
  };
};
