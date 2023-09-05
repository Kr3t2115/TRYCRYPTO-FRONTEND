import { useContext, useEffect } from "react";
import { AuthContext } from "./context/authContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({children}: any) {

    const { auth }: any = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(()=> {
        if(!auth) {
            navigate("/");
        }
    }, [auth])

    return(
        {...children}
    )
}