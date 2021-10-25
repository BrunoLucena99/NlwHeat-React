import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { api, setToken } from "../services/api";

const LOCAL_STORAGE_TOKEN_KEY = '@dowhile:token';

type AuthProvider = {
  children: ReactNode;
}

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
}

type AuthResponse = {
  token: string;
  user: User;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProvider) => {
  const [user, setUser] = useState<User | null>(null);
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=c00161c27d8f0afb4871`;

  const signIn = useCallback(async (code: string) => {
    const response = await api.post<AuthResponse>('authenticate', {code, browser: true});
    const { token, user: userAux } = response.data;
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    setToken(token);
    setUser(userAux);
  }, []);

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  const getProfile = useCallback(async () => {
    const { data } = await api.get<User>('profile');
    setUser(data);
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');
      window.history.pushState({}, '', urlWithoutCode);
      signIn(githubCode);
    }
  } ,[signIn]);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (token) {
      setToken(token);
      getProfile();
    }
  }, [getProfile]);

  return (
    <AuthContext.Provider
      value={{
        signInUrl,
        user,
        signOut
      }}>
      {children}
    </AuthContext.Provider>
  )
}