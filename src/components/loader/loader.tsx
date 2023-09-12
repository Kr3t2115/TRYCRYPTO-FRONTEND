import Class from "./loader.module.css";
import Logo from "../../assets/logo.png";

export default function Loader({isOpen}: {isOpen: boolean}) {
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


