// app/layout.tsx

// globals.css includes @tailwind directives
// adjust the path if necessary
import React from "react";
import classes from "./Signin.module.css";
import Banner from "../../components/icons/Banner";
import { Container } from "@mantine/core";
import BackButton from "@/components/ui/NavBar/BackButton";

export default function SigninLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={classes.signin}>
            <BackButton style={{ position: "absolute", top: "50px", left: "50px", cursor: "pointer"}}></BackButton>
            <div className={classes.siginBox}>{children}</div>
            <Container visibleFrom="md" className={classes.signinBanner}>
                <Banner></Banner>
            </Container>
        </div>
    );
}
