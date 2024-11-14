import React from "react";
// import { motion } from "framer-motion";
import Navbar from "@/components/ui/NavBar";
import { Button, Container, Group, Rating, Text } from "@mantine/core";
import * as motion from "framer-motion/client";
import { getUserServerSideProps } from "@/utils/auth-helpers/props";
import classes from "./Page.module.css";
import { IconArrowRight, IconMedal, IconUsers } from "@tabler/icons-react";

export default async function Page() {
    const { currentUser, error } = await getUserServerSideProps();

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

    return (
        <div>
            <Navbar currentUser={currentUser} error={error}></Navbar>
            <Container size="lg">
                <section id="hero">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div variants={item}>
                            <h1 className={classes.bannerTitle}>
                                <Text
                                    className={classes.bannerTitle}
                                    fw={700}
                                    variant="gradient"
                                    gradient={{
                                        from: "rgba(212, 112, 255, 1)",
                                        to: "violet",
                                        deg: 90,
                                    }}
                                >
                                    All-in-one video enhancements
                                </Text>
                                in your browser
                            </h1>
                            <p className={classes.bannerDes}>
                                Easily enhance your video watching experience
                            </p>
                        </motion.div>
                        <Group gap={100} justify="center">
                            <motion.div variants={item}>
                                <div className={classes.rate}>
                                    <Text fw={600} size="lg" variant="default">
                                        17K+
                                    </Text>
                                    <IconUsers color="var(--mantine-color-indigo-4)"></IconUsers>
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
                                    <Rating
                                        value={4.5}
                                        fractions={2}
                                        readOnly
                                    />
                                </div>

                                <Text fw={200} size="sm" variant="default">
                                    Average rating 4.6 out of 5
                                </Text>
                            </motion.div>
                            <motion.div variants={item}>
                                <div className={classes.rate}>
                                    <Text fw={600} size="lg" variant="default">
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
                        <Group gap="lg" justify="center" p="40">
                            <Button
                                radius="xl"
                                variant="filled"
                                rightSection={<IconArrowRight size={14} />}
                            >
                                Get started now
                            </Button>
                        </Group>
                    </motion.div>
                </section>
            </Container>
        </div>
    );
}
