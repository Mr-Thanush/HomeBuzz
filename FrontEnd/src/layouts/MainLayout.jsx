import React from "react";
import Navbar from "../Components/navbars/navbar";
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