"use client";

import React, { useMemo } from "react";
import {
    Container,
    Group,
    Title,
    Text,
    Card,
    Badge,
    Button,
    List,
    ThemeIcon,
    rem,
    SimpleGrid,
} from "@mantine/core";
import { IconCheck, IconCircleCheck, IconX } from "@tabler/icons-react";
import classes from "./Pricing.module.css";

export default function PricingPage() {
    const plans = useMemo(() => {
        return [
            {
                id: "free",
                title: "Free",
                target: "Great starter",
                des: "For starting out and trying Video Roll, no account required.",
                price: "0",
                payType: "month",
                buttonText: "Free to use",
                buttonColor: "var(--mantine-color-gray-7)",
                disabled: true,
                features: [
                    "Flip(horizontal/vertical)",
                    "Rotate(0/90/180/270deg)",
                    "Zoom(0 - 3 limited)",
                    "Stretch",
                    "Filter",
                    "Reposition",
                    "Pich",
                    "Volume",
                    "Speed Control",
                    "ScreenShots",
                    "Loop",
                    "Picture In Picture(Browser controlled limited)",
                ],
                unsupport: [
                    'VR',
                    'A-B Loop'
                ],
                isHighlighted: true,
            },
            {
                id: "pro",
                disabled: false,
                title: "Pro",
                target: "Unlimited features",
                des: "Everything in Free plan, plus more comprehensive features.",
                price: "2.9",
                payType: "month",
                buttonText: "Get Started",
                buttonColor: "var(--mantine-color-indigo-5)",
                features: [
                    "Flip(horizontal/vertical)",
                    "Rotate(0/90/180/270deg)",
                    "Zoom(0 - 3 limited)",
                    "Stretch",
                    "Filter",
                    "Reposition",
                    "Pich",
                    "Volume",
                    "Speed Control",
                    "ScreenShots",
                    "Loop",
                    "Picture In Picture(Browser controlled limited)",
                    "VR",
                    "A-B Loop"
                ],
                unsupport: [],
                style: {
                    outline: "4px solid var(--mantine-color-indigo-5)",
                },
                isHighlighted: true,
            },
            {
                id: "pro+",
                disabled: false,
                title: "Pro+",
                badge: "Best Value",
                target: "Pay once, use forever",
                des: "Everything in Pro plan, free upgrade to get the latest features(AI Tokens are not included).",
                price: "19.9",
                payType: "lifetime",
                buttonText: "Get Started",
                buttonColor: "var(--mantine-color-orange-7)",
                style: {
                    outline: "4px solid var(--mantine-color-orange-7)",
                },
                features: [
                    "Flip(horizontal/vertical)",
                    "Rotate(0/90/180/270deg)",
                    "Zoom(0 - 3 limited)",
                    "Stretch",
                    "Filter",
                    "Reposition",
                    "Pich",
                    "Volume",
                    "Speed Control",
                    "ScreenShots",
                    "Loop",
                    "Picture In Picture(Browser controlled limited)",
                    "VR",
                    "A-B Loop"
                ],
                unsupport: [],
                isHighlighted: true,
            },
        ];
    }, []);

    const getPlan = () => {};
    return (
        <Container size="lg">
            <Group gap={100} justify="center">
                <Title order={2} p="20" className={classes.pageTitle}>
                    Simple & transparent pricing
                </Title>
            </Group>
            <SimpleGrid
                type="container"
                cols={{ base: 1, "800px": 3 }}
                spacing={{ base: 10, "300px": "xl" }}
            >
                {plans.map((item) => (
                    <Card
                        key={item.id}
                        className={classes.freePlan}
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={item.style ?? {}}
                    >
                        <Group justify="space-between" mb="xs">
                            <Title order={3} className={classes.planTitle}>
                                {item.title}
                            </Title>
                            {item.badge ? (
                                <Badge color="pink">{item.badge}</Badge>
                            ) : null}
                        </Group>

                        <Text fw={400}>{item.target}</Text>
                        <Text fw={300} mt="5" mb="14">
                            {item.des}
                        </Text>
                        <List
                            spacing="xs"
                            size="md"
                            center
                            icon={
                                <IconCheck
                                    style={{
                                        color: "var(--mantine-color-green-7)",
                                        width: rem(16),
                                        height: rem(16),
                                    }}
                                />
                            }
                        >
                            {item.features.map((feature, index) => (
                                <List.Item key={index}>
                                    {feature}
                                </List.Item>
                            ))}
                        </List>
                        <List
                            spacing="xs"
                            size="md"
                            center
                            mt={item.unsupport.length ? 10 : 0}
                            icon={
                                <IconX
                                    style={{
                                        color: "var(--mantine-color-red-8)",
                                        width: rem(16),
                                        height: rem(16),
                                    }}
                                />
                            }
                        >
                            {item.unsupport.map((feature, index) => (
                                <List.Item key={index}>{feature}</List.Item>
                            ))}
                        </List>
                        <Group align="center" mt="md">
                            <span className={classes.price}>${item.price}</span>
                            <span> / {item.payType}</span>
                        </Group>
                        <Button
                            disabled={item.disabled}
                            color={item.buttonColor}
                            fullWidth
                            mt="md"
                            radius="md"
                            onClick={getPlan}
                        >
                            {item.buttonText}
                        </Button>
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
}
