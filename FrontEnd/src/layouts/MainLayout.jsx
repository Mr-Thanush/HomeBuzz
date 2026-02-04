import React from "react";
import Navbar from "../components/navbars/navbar";
import { Outlet } from "react-router-dom";
function MainLayout(){
    return(
        <>
        <Navbar/>
        <Outlet/>
        </>
    );
}

export default MainLayout;