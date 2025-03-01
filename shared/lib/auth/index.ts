import { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { InitService } from "../utils";

type SignInCommonStrategy = {
  email: string;
  password: string;
};

type SignUpCommonStrategy = SignInCommonStrategy;

class AuthService extends InitService {
  subscribeToAuthChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    const { data } = this.client.auth.onAuthStateChange(callback);
    return { unsubscribe: data.subscription.unsubscribe };
  }

  async signInWithEmailAndPassword({ email, password }: SignInCommonStrategy) {
    const response = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) throw response.error;

    return response;
  }

  async signUpWithEmailAndPassword({ email, password }: SignUpCommonStrategy) {
    const response = await this.client.auth.signUp({
      email: `${email}`,
      password: `${password}`,
    });

    if (response.error) throw response.error;

    return response;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();

    if (error) throw error;
  }
}

export const authService = new AuthService();
