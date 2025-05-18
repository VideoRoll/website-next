"use server";

import React from "react";
import Navbar from "@/components/ui/NavBar";
import { getUserServerSideProps } from "@/utils/auth-helpers/props";
import Plan from './Plan';
// import { notifications } from "@mantine/notifications";

export default async function PricingPage() {
    const { currentUser, error } = await getUserServerSideProps();
    
    return (
        <div>
            <Navbar currentUser={currentUser} error={error}></Navbar>
            <Plan currentUser={currentUser}></Plan>
        </div>
    );
}
