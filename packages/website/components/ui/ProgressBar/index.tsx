"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // useRouter for Client Components
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import "@mantine/nprogress/styles.css";
import React from "react";

export default function ProgressBar() {
    const pathname = usePathname();

    // 模拟延迟加载，确保页面加载完成再停止
    const handleRouteChange = () => {
        nprogress.complete();
    };

    useEffect(() => {
        nprogress.start();

        handleRouteChange(); // 调用以确保完成

        return () => {
            nprogress.complete();
        };
    }, [pathname]);

    return <NavigationProgress />; // 这个组件不渲染任何内容，只负责路由监听
}
