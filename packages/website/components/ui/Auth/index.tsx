"use client";

import React, { useState } from "react";
import {
    IconBrandGithubFilled,
    IconBrandGoogleFilled,
} from "@tabler/icons-react";
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
    onSubmit: (data: string) => Promise<any>;
    onGoogleSignin: (data: string) => void;
    onGithubSignin: (data: string) => void;
};

export default function Auth(props: Props) {
    const { submitText, type, onSubmit, onGoogleSignin, onGithubSignin } =
        props;
    const [visible, handlers] = useDisclosure(false);
    const [captchaToken, setCaptchaToken] = useState();

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

    const handleSubmit = (value: any) => {
        if (type === "signup") {
            value.captchaToken = captchaToken;
        }

        const formData = new FormData();
        Object.keys(value).forEach((key) => {
            formData.append(key, value[key]);
        });

        onSubmit(formData).catch((error) => {
            console.log(error);
        });
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
            {type === "signup" ? (
                <Turnstile
                    className={classes.turnstile}
                    siteKey="0x4AAAAAAAxryjpkBF1lWMCb"
                    onSuccess={(token) => {
                        setCaptchaToken(token);
                    }}
                ></Turnstile>
            ) : null}

            <Button fullWidth type="submit" mt="sm">
                {submitText}
            </Button>
            <Divider my="xs" label="or" labelPosition="center" />
            <Button
                fullWidth
                variant="outline"
                leftSection={<IconBrandGoogleFilled></IconBrandGoogleFilled>}
                onClick={() => onGoogleSignin(window.location.origin)}
            >
                Sign in with Google
            </Button>
            <Space h="sm" />
            <Button
                fullWidth
                variant="outline"
                leftSection={<IconBrandGithubFilled></IconBrandGithubFilled>}
                onClick={() => onGithubSignin(window.location.origin)}
            >
                Sign in with Github
            </Button>
            {type === "signin" ? (
                <p>Don&apos;t have an account? <Link href="/signup">Sign up</Link></p>
            ) : (
                <p>Already have an account? <Link href="/signin">Sign in</Link></p>
            )}
        </form>
    );
}
