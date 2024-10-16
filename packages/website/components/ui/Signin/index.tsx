"use client";

import React from "react";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { Button, Divider, PasswordInput, TextInput } from "@mantine/core";
import classes from "./Sign.module.css";

type Props = {
    submitText: string;
    onSubmit: (data: string) => void;
    onGoogleSignin: (data: string) => void;
};
export default function Signin(props: Props) {
    const { submitText, onSubmit, onGoogleSignin } = props;

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

    return (
        <form
            className={classes.sign}
            onSubmit={form.onSubmit((value) => onSubmit(JSON.stringify(value)))}
        >
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
            <Button fullWidth type="submit" mt="sm">
                {submitText}
            </Button>
            <Divider my="xs" label="or" labelPosition="center" />
            <Button fullWidth variant="outline" leftSection={<IconBrandGoogleFilled></IconBrandGoogleFilled>} onClick={() => onGoogleSignin(window.location.origin)}>
                Sign in with Google
            </Button>
            <p>Don&apos;t have an account? Sign up</p>
        </form>
    );
}
