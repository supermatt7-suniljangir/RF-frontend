"use client";
import React from "react";

import {useMediaQuery} from "@/hooks/use-media-query";

import MobileNav from "@/components/layout/MobilesNav";
import DesktopNav from "@/components/layout/DesktopNav";


const Navbar = () => {
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    // Prevent rendering glitches during logout
    if (!isDesktop) {
        return <MobileNav/>;
    }
    return <DesktopNav/>;
};

export default Navbar;
