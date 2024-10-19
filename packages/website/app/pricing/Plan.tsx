"use client";

import React, { useEffect, useMemo } from "react";
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
    Divider,
} from "@mantine/core";
import { IconCheck, IconCircleCheck, IconX } from "@tabler/icons-react";
import { redirect } from "next/navigation";
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
                unsupport: ["VR", "A-B Loop"],
                isHighlighted: true,
            },
            {
                id: "pro",
                disabled: false,
                title: "Pro",
                target: "Unlimited features",
                des: "Everything in Free plan, plus more comprehensive features.",
                price: "2.9",
                price_id: "prod_685a565c9b454ff8",
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
                    "A-B Loop",
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
                des: "Everything in Pro plan, free upgrade to get the latest features.",
                price: "19.9",
                price_id: "prod_f98090efd3c048e8",
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
                    "A-B Loop",
                ],
                unsupport: [],
                isHighlighted: true,
            },
        ];
    }, []);

    function paySuccessCallBack(user_info, status) {
        if (status === "succeed") {
            // user_info 可以参考接入文档中的get_user_info 接口返回的内容，实际对你有用的是付费信息
            console.log("支付成功,用户信息", user_info);
        } else {
            console.log("支付失败");
        }
    }

    useEffect(() => {
        window.KODEPAY_APPLICATION_ID = "8b34e240-c369-11ee-899a-a2470496a586"; // application_id
        window.KODEPAY_CLIENT_ID = "429e48ee-768a-11ef-9cf3-928f62f479bc"; //client_id
        window.KODEPAY_ENV = "development"; //env，development 和  production

        const dom = document.querySelector("kodepay-script");
        if (!dom) {
            const script = document.createElement("script");
            script.src =
                "https://kodepay-global.zingfront.com/resource/kodepay/2.1.3/kodepay-website.js";
            script.async = true;
            script.setAttribute("id", "kodepay-script");
            document.head.appendChild(script);
        }

        window.KodePay?.on_pay_completed.addListener(paySuccessCallBack);
    }, []);

    const getPlan = (plan) => {
        if (plan.id === "pro") {
            // const origial_data = { user_id: 3242422, order_id: 123123 }; // 支付时可以额外透传的一些信息，我们会在支付回调中将这些信息传递给你的服务器，建议通过这些信息(例如自己的订单号)你可以唯一标识你系统的用户
            const price_id = plan.price_id; // price_id
            const currency = "cny"; // 目前支持usd, cny
            const origial_data = {
                payment_channel: 'stripe', // "stripe","paypal"
                payment_method: 'alipay', //"stripe" =>"card","alipay","wechat", k"paypal"=>"paypal"
                currency: 'cny',    //"usd","cny'","inr"
                // origin_data: Optional[Dict],  //开发者侧自定义的参数，自己决定是否透传
                redirect_url: 'https://videoroll.app' //支付成功后的跳转链接，自己决定是否透传
            }; 
            //下面这两个方法，由开发者二选一。
            //这个是直接打开支付页面，没有支付方式选择的过程。
            // window.KodePay.open_payment_page(price_id, origial_data);
            window.KodePay.open_payment_page_new(price_id, origial_data).then(res => {
                console.log(res);// print succeed or failed

                if (res.code === 'success') {
                    window.location.href = res.data;
                }
            });
            // //这一个会先打开对应币种的支付方式选择页面。
            // window.KodePay.open_payment_choose_page(price_id, currency);

            // 前端支付成功的回调，通过这个函数，你可以在前端获取到支付的回调信息,但是更好的方式是前端收到这个回调信息后再次刷新页面获取用户最新的信息来确保用户已经支付，因为前端不可信
        }
    };
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
                            onClick={() => getPlan(item)}
                        >
                            {item.buttonText}
                        </Button>
                        <Divider my="md" />
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
                                <List.Item key={index}>{feature}</List.Item>
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
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
}
