'use client'

import { Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";

let show: (title?: string) => void;
let hide: () => void;

export function showGlobalLoading(title?: string) {
  if (show) show(title);
}
export function hideGlobalLoading() {
  if (hide) hide();
}

export default function GlobalLoadingPortal() {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState<string | undefined>();

  useEffect(() => {
    show = (t?: string) => {
      setTitle(t);
      setVisible(true);
    };
    hide = () => {
      setVisible(false);
      setTitle(undefined);
    };
  }, []);

  if (!visible) return null;
  return (
    <div
        className="backdrop-blur-md bg-background/30"
      style={{
        position: "fixed",
        zIndex: 9999,
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "all",
      }}
    >
      <Spinner color="primary" label="loading..." labelColor="primary" />
      {title && (
        <div style={{ marginTop: 16, fontSize: 18, color: "#333" }}>{title}</div>
      )}
    </div>
  );
}