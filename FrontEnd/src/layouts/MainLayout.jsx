import React from "react";
import Navbar from "../client/navbars/navbar";
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