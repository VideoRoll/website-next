"use client";

import {
    Menu,
    Group,
    Center,
    Burger,
    Container,
    ActionIcon,
    useMantineColorScheme,
    Button,
} from "@mantine/core";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import logo from "@/components/icons/logo.png";
import {
    IconMoon,
    IconChevronDown,
    IconBrightnessUp,
    IconUser,
} from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import classes from "./NavBar.module.css";
import { nprogress } from "@mantine/nprogress";
import React from "react";

const links = [
    {
        link: "#1",
        label: "Products",
        links: [
            { link: "/", label: "Video Roll" },
            { link: "/videoroll-player", label: "Video Roll Player" },
        ],
    },
    { link: "/pricing", label: "Pricing" },
    { link: "/blog", label: "Blog" },
    {
        link: "#2",
        label: "Support",
        links: [
            { link: "/faq", label: "FAQ" },
            { link: "/demo", label: "Book a demo" },
            { link: "/forums", label: "Forums" },
        ],
    },
];

type Props = {
    currentUser: {
        email: string;
        [key: string]: string;
    };
};

export default function NavBar(props: Props) {
    const { currentUser } = props;
    const supabase = createClient();

    const [opened, { toggle }] = useDisclosure(false);

    // -> colorScheme is 'auto' | 'light' | 'dark'
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    // Incorrect color scheme toggle implementation
    // If colorScheme is 'auto', then it is not possible to
    // change color scheme correctly in all cases:
    // 'auto' can mean both light and dark
    const toggleColorScheme = () => {
        setColorScheme(colorScheme === "dark" ? "light" : "dark");
    };

    const signout = () => {
        nprogress.start();
        supabase.auth.signOut().then((res) => {
            nprogress.complete();
            if (res.error) {
                console.error(res.error);
                return;
            }

            window.location.reload();
        });
    };

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link} component={Link} href={item.link}>
                {item.label}
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu
                    key={link.label}
                    trigger="hover"
                    transitionProps={{ exitDuration: 0 }}
                    withinPortal
                >
                    <Menu.Target>
                        <a
                            href={link.link}
                            className={classes.link}
                            onClick={(event) => event.preventDefault()}
                        >
                            <Center>
                                <span className={classes.linkLabel}>
                                    {link.label}
                                </span>
                                <IconChevronDown size="0.9rem" stroke={1.5} />
                            </Center>
                        </a>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link key={link.label} href={link.link} className={classes.link}>
                {link.label}
            </Link>
        );
    });

    return (
        <nav className={classes.header}>
            <Container size="lg">
                <div className={classes.inner}>
                    <Group gap={2}>
                        <Image
                            src={logo}
                            alt="video roll logo"
                            width={30}
                            height={30}
                        ></Image>
                        <span>Video Roll</span>
                    </Group>

                    <Group gap={5} visibleFrom="sm">
                        {items}
                    </Group>
                    <Group gap={5}>
                        {currentUser ? (
                            <Menu
                                trigger="hover"
                                openDelay={100}
                                closeDelay={400}
                            >
                                <Menu.Target>
                                    <Button
                                        justify="center"
                                        variant="default"
                                        component={Link}
                                        href="/signin"
                                        leftSection={
                                            <IconUser size={14}></IconUser>
                                        }
                                        size="compact-sm"
                                    >
                                        {currentUser.email ?? ""}
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item onClick={signout}>
                                        Sign out
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Button
                                justify="center"
                                variant="gradient"
                                component={Link}
                                href="/signin"
                                gradient={{
                                    from: "rgba(212, 112, 255, 1)",
                                    to: "violet",
                                    deg: 90,
                                }}
                                leftSection={<IconUser size={14}></IconUser>}
                                size="compact-sm"
                            >
                                Sign in
                            </Button>
                        )}

                        {colorScheme === "dark" ? (
                            <ActionIcon
                                variant="default"
                                size="md"
                                aria-label="theme"
                                onClick={toggleColorScheme}
                            >
                                <IconBrightnessUp
                                    style={{ width: "70%", height: "70%" }}
                                    stroke={1.5}
                                />
                            </ActionIcon>
                        ) : (
                            <ActionIcon
                                variant="default"
                                size="md"
                                aria-label="theme"
                                onClick={toggleColorScheme}
                            >
                                <IconMoon
                                    style={{ width: "70%", height: "70%" }}
                                    stroke={1.5}
                                />
                            </ActionIcon>
                        )}
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            size="sm"
                            hiddenFrom="sm"
                        />
                    </Group>
                </div>
            </Container>
        </nav>
    );
}
