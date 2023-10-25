import { Dispatch, SetStateAction, createContext } from "react";

export type AuthType = {
  auth: boolean;
  setAuth: Dispatch<SetStateAction<boolean>>;
  currentBalance: string;
  setCurrentBalance: Dispatch<SetStateAction<string>>;
  userInfo: object;
  setUserInfo: Dispatch<SetStateAction<Object>>;
};

export const AuthContext = createContext<AuthType>({
  auth: false,
  setAuth: () => {},
  currentBalance: "",
  setCurrentBalance: () => {},
  userInfo: {},
  setUserInfo: () => {},
});
