import React from "react";
// import { motion } from "framer-motion";
import Navbar from "@/components/ui/NavBar";
import { Button, Container, Group, Rating, Text } from "@mantine/core";
import * as motion from "framer-motion/client";
import { getUserServerSideProps } from "@/utils/auth-helpers/props";
import classes from "./Page.module.css";
import { IconArrowRight, IconMedal, IconUsers } from "@tabler/icons-react";

export default async function Page() {
    const { currentUser } = await getUserServerSideProps();
    return (
        <div>
            <Navbar currentUser={currentUser}></Navbar>
            <Container size="lg">
                <section id="hero">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
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
                        </div>
                        <Group gap={100} justify="center">
                            <div>
                                <div className={classes.rate}>
                                    <Text fw={600} size="lg" variant="default">
                                        17K+
                                    </Text>
                                    <IconUsers color="var(--mantine-color-indigo-4)"></IconUsers>
                                </div>

                                <Text fw={200} size="sm" variant="default">
                                    Over 17,000 users globally
                                </Text>
                            </div>
                            <div>
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
                            </div>
                            <div>
                                <div className={classes.rate}>
                                    <Text fw={600} size="lg" variant="default">
                                        Featured
                                    </Text>
                                    <IconMedal color="var(--mantine-color-blue-filled)"></IconMedal>
                                </div>
                                <Text fw={200} size="sm" variant="default">
                                    Marked as featured extension
                                </Text>
                            </div>
                        </Group>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
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
