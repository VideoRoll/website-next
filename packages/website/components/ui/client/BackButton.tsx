'use client'

import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function BackButton(props) {
    const router = useRouter();
    return (
        <div onClick={() => router.push('/')} {...props}>
            <IconArrowLeft></IconArrowLeft>
        </div>
    );
}
