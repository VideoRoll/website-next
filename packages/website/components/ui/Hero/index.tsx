"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Container, Group, Rating, Text, Title } from "@mantine/core";
import * as motion from "framer-motion/client";
import classes from "./Hero.module.css";
import {
    IconArrowRight,
    IconMedal,
    IconUserFilled,
    IconStarFilled,
} from "@tabler/icons-react";
import Youtube from "@/components/icons/Youtube";
import Bilibili from "@/components/icons/Bilibili";
import X from "@/components/icons/X";
import Vimeo from "@/components/icons/Vimeo";
import Twitch from "@/components/icons/Twitch";
import Facebook from "@/components/icons/Facebook";
import Instagram from "@/components/icons/Instagram";
import Tiktok from "@/components/icons/Tiktok";
import Chrome from "@/components/icons/Chrome";
import Edge from "@/components/icons/Edge";
import Firefox from "@/components/icons/Firefox";

const colors = [
    "#f43f5e", // 红色
    "#22d3ee", // 绿色
    "#3357FF", // 蓝色
    "#34d399", // 粉色
    "#fbbf24", // 金色
    "#a3e635", // 青色
];

export default function Hero() {
    // 定义framer-motion的variants
    const container = {
        hidden: { opacity: 0, y: -150 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                // 每个子元素的延迟时间会逐个递增0.5秒，也就是每个的启动时间都会比前一个有0.5s的延迟
                staggerChildren: 0.3,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 },
    };

    useLayoutEffect(() => {
        const elts = {
            text1: document.querySelector("#animate-text1"),
            text2: document.querySelector("#animate-text2"),
        };

        const texts = [
            "Rotater",
            "Volume Booster",
            "Looper",
            "Recorder",
            "Zoomer",
            "Speed Controller",
            "Filter",
            "Pitch Shifter",
            "Bookmark",
        ];

        const morphTime = 1;
        const cooldownTime = 0.25;

        let textIndex = texts.length - 1;
        let time = new Date();
        let morph = 0;
        let cooldown = cooldownTime;
        let index = 0;

        elts.text1.textContent = texts[textIndex % texts.length];
        elts.text2.textContent = texts[(textIndex + 1) % texts.length];
        elts.text2.style.color = colors[index];
        function doMorph() {
            morph -= cooldown;
            cooldown = 0;

            let fraction = morph / morphTime;

            if (fraction > 1) {
                cooldown = cooldownTime;
                fraction = 1;
            }

            setMorph(fraction);
        }

        function setMorph(fraction) {
            elts.text2.style.filter = `blur(${Math.min(
                6 / fraction - 6,
                100
            )}px)`;
            elts.text2.style.opacity = `${Math.pow(fraction, 0.6) * 100}%`;
            fraction = 1 - fraction;
            elts.text1.style.filter = `blur(${Math.min(
                6 / fraction - 6,
                100
            )}px)`;
            elts.text1.style.opacity = `${Math.pow(fraction, 0.6) * 100}%`;

            elts.text1.textContent = texts[textIndex % texts.length];
            elts.text2.textContent = texts[(textIndex + 1) % texts.length];
        }

        function doCooldown() {
            morph = 0;

            elts.text2.style.filter = "";
            elts.text2.style.opacity = "100%";

            elts.text1.style.filter = "";
            elts.text1.style.opacity = "0%";
        }

        function animate() {
            requestAnimationFrame(animate);
            const newTime = new Date();
            const shouldIncrementIndex = cooldown > 0;
            const dt = (newTime - time) / 2000;
            time = newTime;

            cooldown -= dt;

            if (cooldown <= 0) {
                if (shouldIncrementIndex) {
                    index = (index + 1) % colors.length;
                    elts.text2.style.color = colors[index];

                    // elts.text2.style.color = colors[index];
                    textIndex++;
                }

                doMorph();
            } else {
                elts.text1.style.color = colors[index];
                doCooldown();
            }
        }

        animate();
    }, []);

    return (
        <section style={{ height: "70%" }}>
            <Container size="lg">
                <Group gap={50}>
                    <Container size="lg" className={classes.iconWrapper} visibleFrom="sm">
                        <div className={classes.heroBackground1}></div>
                        <div className={classes.heroBackground2}></div>
                        <motion.div
                            className={classes.icons}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                position: "relative",
                                height: "400px",
                            }}
                        >
                            <motion.div
                                animate={{ y: 10 }}
                                transition={{
                                    ease: "easeInOut",
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Youtube
                                    style={{ position: "absolute" }}
                                    className={classes.iconYoutube}
                                ></Youtube>
                            </motion.div>
                            <motion.div
                                animate={{ y: 10 }}
                                transition={{
                                    delay: 1,
                                    ease: "easeInOut",
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Instagram
                                    style={{ position: "absolute" }}
                                    className={classes.iconInstagram}
                                ></Instagram>
                            </motion.div>
                            <motion.div
                                animate={{ y: 15 }}
                                transition={{
                                    ease: "easeInOut",
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Bilibili
                                    style={{ position: "absolute" }}
                                    className={classes.iconBilibili}
                                ></Bilibili>
                            </motion.div>
                            <motion.div
                                animate={{ y: 15 }}
                                transition={{
                                    ease: "easeInOut",
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Twitch
                                    style={{ position: "absolute" }}
                                    className={classes.iconTwitch}
                                ></Twitch>
                            </motion.div>
                            <motion.div
                                animate={{ y: 20 }}
                                transition={{
                                    ease: "easeInOut",
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <X
                                    style={{ position: "absolute" }}
                                    className={classes.iconX}
                                ></X>
                            </motion.div>
                            <motion.div
                                animate={{ y: 10 }}
                                transition={{
                                    ease: "easeInOut",
                                    delay: 0.2,
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Facebook
                                    style={{ position: "absolute" }}
                                    className={classes.iconFacebook}
                                ></Facebook>
                            </motion.div>
                            <motion.div
                                animate={{ y: 20 }}
                                transition={{
                                    ease: "easeInOut",
                                    delay: 1,
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Vimeo
                                    style={{ position: "absolute" }}
                                    className={classes.iconVimeo}
                                ></Vimeo>
                            </motion.div>
                            <motion.div
                                animate={{ y: 10 }}
                                transition={{
                                    ease: "easeInOut",
                                    delay: 1,
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Tiktok
                                    style={{ position: "absolute" }}
                                    className={classes.iconTicktok}
                                ></Tiktok>
                            </motion.div>
                        </motion.div>
                    </Container>
                    <section className={classes.hero}>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div variants={item}>
                                <Title
                                    order={1}
                                    className={classes.bannerTitle}
                                >
                                    <Text
                                        className={classes.bannerTitle}
                                        fw={700}
                                        // variant="gradient"
                                        // gradient={{
                                        //     from: "rgba(212, 112, 255, 1)",
                                        //     to: "violet",
                                        //     deg: 90,
                                        // }}
                                    >
                                        All-in-one video enhancements
                                    </Text>
                                </Title>
                                <motion.div
                                    variants={item}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {/* <Text
                                            fw={700}
                                            style={{
                                                display: "inline-block",
                                                justifyContent: "center",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            Your Video
                                        </Text> */}
                                    <Title
                                        order={2}
                                        fz={70}
                                        // ref={scope}
                                        // variants={item}
                                        // className={classes.animateContainer}
                                        style={{
                                            display: "inline-block",
                                            width: "100%",
                                        }}
                                    >
                                        <div
                                            className={classes.animateContainer}
                                        >
                                            <span
                                                id="animate-text1"
                                                className={classes.text1}
                                            ></span>
                                            <span
                                                id="animate-text2"
                                                className={classes.text2}
                                            ></span>
                                        </div>

                                        <svg
                                            id="filters"
                                            style={{ display: "none" }}
                                        >
                                            <defs>
                                                <filter id="threshold">
                                                    <feColorMatrix
                                                        in="SourceGraphic"
                                                        type="matrix"
                                                        values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
                                                    />
                                                </filter>
                                            </defs>
                                        </svg>
                                    </Title>
                                </motion.div>
                                <Text className={classes.bannerDes}>
                                    Easily enhance your video watching
                                    experience
                                </Text>
                            </motion.div>
                            <Group gap={100} justify="center" mt={30}>
                                <motion.div variants={item}>
                                    <div className={classes.rate}>
                                        <Text
                                            fw={600}
                                            size="lg"
                                            variant="default"
                                        >
                                            17K+
                                        </Text>
                                        <IconUserFilled color="var(--mantine-color-indigo-4)"></IconUserFilled>
                                    </div>

                                    <Text fw={200} size="sm" variant="default">
                                        Over 17,000 users globally
                                    </Text>
                                </motion.div>
                                <motion.div variants={item}>
                                    <div className={classes.rate}>
                                        <Text
                                            style={{ marginRight: "5px" }}
                                            fw={600}
                                            size="lg"
                                            variant="default"
                                        >
                                            4.6
                                        </Text>
                                        <IconStarFilled></IconStarFilled>
                                        {/* <Rating
                                        value={1}
                                        fractions={2}
                                        readOnly
                                    /> */}
                                    </div>

                                    <Text fw={200} size="sm" variant="default">
                                        Average rating 4.6 out of 5
                                    </Text>
                                </motion.div>
                                <motion.div variants={item}>
                                    <div className={classes.rate}>
                                        <Text
                                            fw={600}
                                            size="lg"
                                            variant="default"
                                        >
                                            Featured
                                        </Text>
                                        <IconMedal color="var(--mantine-color-blue-filled)"></IconMedal>
                                    </div>
                                    <Text fw={200} size="sm" variant="default">
                                        Marked as featured extension
                                    </Text>
                                </motion.div>
                            </Group>
                        </motion.div>
                        <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                <Group gap="lg" justify="center" pt="60">
                                    <Button
                                        radius="xl"
                                        variant="gradient"
                                        gradient={{
                                            from: "violet",
                                            to: "grape",
                                            deg: 96,
                                        }}
                                        leftSection={<Chrome />}
                                        rightSection={
                                            <IconArrowRight size={14} />
                                        }
                                    >
                                        Add to Chrome
                                    </Button>
                                    <Button
                                        radius="xl"
                                        variant="gradient"
                                        gradient={{
                                            from: "violet",
                                            to: "grape",
                                            deg: 96,
                                        }}
                                        leftSection={<Edge />}
                                        rightSection={
                                            <IconArrowRight size={14} />
                                        }
                                    >
                                        Add to Edge
                                    </Button>
                                    <Button
                                        radius="xl"
                                        variant="gradient"
                                        gradient={{
                                            from: "violet",
                                            to: "grape",
                                            deg: 96,
                                        }}
                                        leftSection={<Firefox />}
                                        rightSection={
                                            <IconArrowRight size={14} />
                                        }
                                    >
                                        Add to Firefox
                                    </Button>
                                </Group>
                            </motion.div>
                    </section>
                </Group>
            </Container>
        </section>
    );
}
