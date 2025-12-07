// app/layout.tsx

// globals.css includes @tailwind directives
// adjust the path if necessary
import React from "react";
import Banner from "@/components/icons/Banner";
import BackButton from "@/components/ui/client/BackButton";

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row justify-between items-center h-screen">
      <BackButton
        style={{
          position: "absolute",
          top: "50px",
          left: "50px",
          cursor: "pointer",
        }}
      ></BackButton>
      <div className="flex-1 bg-background2">{children}</div>
      <div className="w-1/2 hidden md:flex bg-[#fff] h-full justify-center items-center">
        <Banner></Banner>
      </div>
    </div>
  );
}