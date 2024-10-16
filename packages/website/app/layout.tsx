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

export const metadata = {
    title: "My Mantine app",
    description: "I have followed setup instructions carefully",
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
            </head>
            <body>
                <MantineProvider theme={theme}>
                    {/* <NavigationProgress /> */}
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}
