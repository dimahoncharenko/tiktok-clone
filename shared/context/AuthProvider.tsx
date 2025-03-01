import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthResponse, AuthTokenResponsePassword } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

import { authService } from "../lib/auth";
import { userService } from "../lib/user";
import { appStateContext } from "./app-state";

type User = {
  created_at: string;
  email: string;
  id: string;
  username: string;
};

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
  const { getLikesByUser, resetAppState } = useContext(appStateContext);

  useEffect(() => {
    const { unsubscribe } = authService.subscribeToAuthChange(
      async (_, session) => {
        if (!session) return router.push("/(auth)");

        const user = await getUser(session.user.id);
        setUser(user);

        await getLikesByUser(user);
        router.push("/(tabs)");
      }
    );

    return () => {
      return unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: SignInParams) => {
    const response = await authService.signInWithEmailAndPassword({
      email,
      password,
    });

    const user = await getUser(response.data.user.id);
    setUser(user);

    await getLikesByUser(user);

    return response;
  };

  const getUser = async (id: string) => {
    try {
      const data = await userService.getUser(id);

      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const addUser = async ({ email, id, username }: GetUserParams) => {
    try {
      await userService.addUser({ email, id, username });

      const user = await getUser(id);

      setUser(user);
    } catch (err) {
      console.error(err);
    }
  };

  const signUp = async ({ email, password, username }: SignUpParams) => {
    const response = await authService.signUpWithEmailAndPassword({
      email,
      password,
    });

    await addUser({ email, id: `${response.data.user?.id}`, username });
    return response;
  };

  const signOut = async () => {
    await authService.signOut();

    resetAppState();
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
