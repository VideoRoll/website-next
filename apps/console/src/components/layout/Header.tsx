import * as React from "react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (<></>
    // <header className="flex h-16 items-center border-b border-border/40 bg-card/40 backdrop-blur-sm px-6 rounded-t-2xl">
    //   <h1 className="text-xl font-semibold">{title}</h1>
    // </header>
  );
}
