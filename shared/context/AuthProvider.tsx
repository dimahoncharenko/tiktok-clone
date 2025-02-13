import { ReactNode, createContext, useContext, useState } from "react";
import { supabase } from "../config/supabase.config";
import {
  AuthResponse,
  AuthTokenResponsePassword,
  User,
} from "@supabase/supabase-js";
import { useRouter } from "expo-router";

type AuthProviderContext = {
  user: User | null;
  signIn: (params: SignInParams) => Promise<AuthTokenResponsePassword>;
  signUp: (params: SignUpParams) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
};

export const AuthProviderContext = createContext({} as AuthProviderContext);

type AuthProviderProps = {
  children: ReactNode;
};

type SignInParams = {
  email: string;
  password: string;
};

type SignUpParams = {
  email: string;
  password: string;
  username: string;
};

type GetUserParams = {
  id: string;
  username: string;
  email: string;
};

export const useAuthContext = () => useContext(AuthProviderContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const signIn = async ({ email, password }: SignInParams) => {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) throw response.error;

    const user = await getUser(response.data.user.id);
    setUser(user);

    return response;
  };

  const getUser = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const addUser = async ({ email, id, username }: GetUserParams) => {
    try {
      const { error } = await supabase.from("User").insert({
        email,
        id,
        username,
      });

      if (error) throw error;

      const user = await getUser(id);
      setUser(user);
    } catch (err) {
      console.error(err);
    }
  };

  const signUp = async ({ email, password, username }: SignUpParams) => {
    const response = await supabase.auth.signUp({
      email: `${email}`,
      password: `${password}`,
    });

    if (response.error) throw response.error;

    await addUser({ email, id: `${response.data.user?.id}`, username });

    return response;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setUser(null);
    router.push("/(auth)");
  };

  return (
    <AuthProviderContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
};
