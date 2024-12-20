
import React from "react";
// import { motion } from "framer-motion";
import Navbar from "@/components/ui/NavBar";
import { getUserServerSideProps } from "@/utils/auth-helpers/props";
import Hero from '@/components/ui/Hero';
import FeatureVideo from '@/components/ui/Feature/Video';

export default async function Page() {
    const { currentUser, error } = await getUserServerSideProps();

    return (
        <div style={{ height: '100%'}}>
            <Navbar currentUser={currentUser} error={error}></Navbar>
            <Hero></Hero>
            <FeatureVideo></FeatureVideo>
        </div>
    );
}
