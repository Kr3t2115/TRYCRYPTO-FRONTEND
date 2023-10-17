import { type } from "os";
import { createContext } from "react";

export type AuthType = {
  auth: boolean;
  setAuth: (value:boolean) => void;
  currentBalance: string;
  setCurrentBalance: (value: object) => void;
  userInfo: object;
  setUserInfo: (value: object) => void;
}



export const AuthContext = createContext<AuthType>({
  auth: false,
  setAuth: (value: boolean) => {},
  currentBalance: "",
  setCurrentBalance: (value: Object) => {},
  userInfo: {},
  setUserInfo: (value: Object) => {},
});
