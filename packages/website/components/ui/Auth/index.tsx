"use client";

import React, { useRef, useState } from "react";
import Google from "@/components/icons/Google";
import Github from "@/components/icons/Github";
import { useForm } from "@mantine/form";
import {
    Button,
    Divider,
    LoadingOverlay,
    PasswordInput,
    Space,
    TextInput,
} from "@mantine/core";
import Link from "next/link";
import classes from "./Auth.module.css";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Turnstile } from "@marsidev/react-turnstile";

type Props = {
    type: "signin" | "signup";
    submitText: string;
    onSubmit: (data: FormData) => Promise<any>;
    onGoogleSignin: (data: string) => void;
    onGithubSignin: (data: string) => void;
};

export default function Auth(props: Props) {
    const { submitText, type, onSubmit, onGoogleSignin, onGithubSignin } =
        props;
    const [visible, handlers] = useDisclosure(false);
    const [captchaToken, setCaptchaToken] = useState();
    const turnstileRef = useRef();
    // useForm hook to create a form with controlled state and validation
    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: { email: "", password: "" },

        // functions will be used to validate values at corresponding key
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email",
            password: (value) =>
                value.length < 6 ? "Includes at least 6 characters" : null,
        },
    });

    const handleOAuthSignin = (callback: (data: string) => Promise<any>) => {
        handlers.open();
        callback(window.location.origin).catch((error: any) => {
            handlers.close()
            notifications.show({
                position: "top-center",
                withCloseButton: true,
                autoClose: 3000,
                title: "",
                message: 'Login credentials or grant type not recognized',
                color: "red"
            });
            console.log(error);
        });
    }

    const handleSubmit = (value: any) => {
        value.captchaToken = captchaToken;

        const formData = new FormData();
        Object.keys(value).forEach((key) => {
            formData.append(key, value[key]);
        });

        handlers.open();
        onSubmit(formData).catch((error) => {
            notifications.show({
                position: "top-center",
                withCloseButton: true,
                autoClose: 3000,
                title: "",
                message: 'Login credentials or grant type not recognized',
                color: "red"
            });
            turnstileRef.current?.reset();
            console.log(error);
        }).finally(() => handlers.close());
    };

    return (
        <form
            className={classes.sign}
            onSubmit={form.onSubmit((value) => handleSubmit(value))}
        >
            <LoadingOverlay
                visible={visible}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <TextInput
                withAsterisk
                mt="sm"
                label="Email"
                placeholder="your@email.com"
                key={form.key("email")}
                {...form.getInputProps("email")}
            />
            <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Password"
                key={form.key("password")}
                {...form.getInputProps("password")}
            />
            <Turnstile
                ref={turnstileRef}
                options={{
                    size: "flexible",
                    retryInterval: 2000,
                }}
                className={classes.turnstile}
                siteKey="0x4AAAAAAAxryjpkBF1lWMCb"
                onSuccess={(token) => {
                    setCaptchaToken(token);
                }}
                onError={() => {
                    turnstileRef.current?.reset();
                }}
            ></Turnstile>

            <Button fullWidth type="submit" mt="sm">
                {submitText}
            </Button>
            <Divider my="xs" label="or" labelPosition="center" />
            <Button
                fullWidth
                variant="outline"
                leftSection={<Google></Google>}
                onClick={() => handleOAuthSignin(onGoogleSignin)}
            >
                Sign in with Google
            </Button>
            <Space h="sm" />
            <Button
                fullWidth
                variant="outline"
                leftSection={<Github></Github>}
                onClick={() => handleOAuthSignin(onGithubSignin)}
            >
                Sign in with Github
            </Button>
            {type === "signin" ? (
                <p>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup">Sign up</Link>
                </p>
            ) : (
                <p>
                    Already have an account? <Link href="/signin">Sign in</Link>
                </p>
            )}
        </form>
    );
}
