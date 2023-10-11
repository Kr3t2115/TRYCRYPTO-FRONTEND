import { createContext } from "react";
import { Error as ErrorInterface } from "../interfaces/Error";
import { Loading } from "../interfaces/Loading";

export const PageContext = createContext({
    setError: (value: ErrorInterface) => {},
    error: {},
    setLoading: (value: Loading) => {},
    loading: {},
});
