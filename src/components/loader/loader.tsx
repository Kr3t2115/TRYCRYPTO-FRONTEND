import Class from "./loader.module.css";
import Logo from "../../assets/logo.png";
import { useEffect } from "react";

export default function Loader({isOpen}: {isOpen: boolean}) {


    useEffect(() => {
        if(isOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
    },[isOpen])

    return(
        <>
        {isOpen && 
                <div className={Class.mainLoaderContainer}>
                <img src={Logo} className={Class.loaderLogo}></img>
            </div>
            }
        </>

    )

}


