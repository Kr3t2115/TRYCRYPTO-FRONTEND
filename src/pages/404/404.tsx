import { useState, useEffect } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Class from "./404.module.css";
import Navbar from "../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";

export default function Page404(props: any) {

    const navigation = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigation("/");
        }, 3000)
    })


  return (
    <div>

        <Navbar></Navbar>
        <div className={Class.main404}>
            Page not found
        </div>
        <Footer></Footer>

    </div>
  );
}
