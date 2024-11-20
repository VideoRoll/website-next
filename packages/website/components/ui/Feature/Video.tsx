"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Container, Group, Rating, Text } from "@mantine/core";
import * as motion from "framer-motion/client";
import {
    IconArrowRight,
    IconMedal,
    IconUserFilled,
    IconStarFilled,
} from "@tabler/icons-react";

export default function Video() {
    return (
        <section>
            <Container size="lg" mt="lg">
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <iframe
                        width="1120"
                        height="630"
                        src="https://www.youtube.com/embed/4qqykOKJeeU?si=pj6qKyZsCGBtmhB9"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                    ></iframe>
                </motion.div>
            </Container>
        </section>
    );
}
