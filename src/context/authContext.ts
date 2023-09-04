import { createContext } from "react";

export const AuthContext = createContext({
  auth: false,
  setAuth: (value: boolean) => {},
  currentBalance: {},
  setCurrentBalance: (value: Object) => {},
  userInfo: {},
  setUserInfo: (value: Object) => {},
});
