// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import {
    ColorSchemeScript,
    MantineProvider,
    createTheme,
    MantineColorsTuple,
} from "@mantine/core";
import "./globals.css";
import React from "react";
import path from 'node:path'
import Script from "next/script";
import ProgressBar from "@/components/ui/ProgressBar";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

export const metadata = {
    title: "Video Roll",
    description: "All-in-one video enhancements",
};

const myColor: MantineColorsTuple = [
    "#ebecff",
    "#d3d4ff",
    "#a3a5f8",
    "#7174f2",
    "#474aed",
    "#2d2feb",
    "#1d22eb",
    "#1016d1",
    "#0713bc",
    "#000ea6",
];

const theme = createTheme({
    colors: {
        myColor,
    },
    primaryColor: "myColor",
    breakpoints: {
        xs: "30em",
        sm: "48em",
        md: "64em",
        lg: "74em",
        xl: "90em",
    },
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
                <script
                    src="https://accounts.google.com/gsi/client"
                    defer
                    async
                ></script>
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <ProgressBar></ProgressBar>
                    <Notifications
                        position="top-center"
                        zIndex={1000}
                    ></Notifications>
                    {children}
                </MantineProvider>
                <div
                    id="g_id_onload"
                    data-client_id="53679872686-uvfd0t7q1tlje7o6dj381c77m26lrph7.apps.googleusercontent.com"
                    data-login_uri="https://cvsunicdltfduyijjnlo.supabase.co/auth/v1/callback"
                ></div>
            </body>
        </html>
    );
}
