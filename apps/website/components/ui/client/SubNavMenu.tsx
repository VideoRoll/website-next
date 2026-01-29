"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link as RegularLink } from "@heroui/react";

const DEFAULT_TOP = 56;

export type SubNavMenuLink = {
  label: string;
  href: string;
  target?: string;
};

export type SubNavMenuSection = {
  title: string;
  links: SubNavMenuLink[];
};

export type SubNavMenuConfig = {
  triggerLabel: string;
  sections: SubNavMenuSection[];
};

export type SubNavMenuProps = {
  config: SubNavMenuConfig;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  headerRef?: React.RefObject<HTMLElement | null>;
  /** 菜单背景样式，默认透明 + 模糊（参考 Hero UI） */
  panelClassName?: string;
};

function usePanelTop(isOpen: boolean, headerRef?: React.RefObject<HTMLElement | null>) {
  const [top, setTop] = useState(DEFAULT_TOP);

  useEffect(() => {
    if (!isOpen) return;

    const updateTop = () => {
      const value = headerRef?.current?.getBoundingClientRect().bottom ?? DEFAULT_TOP;
      setTop(value);
    };

    updateTop();
    window.addEventListener("scroll", updateTop, { passive: true });
    window.addEventListener("resize", updateTop);
    return () => {
      window.removeEventListener("scroll", updateTop);
      window.removeEventListener("resize", updateTop);
    };
  }, [isOpen, headerRef]);

  return top;
}

function SubNavMenuPanelContent({
  config,
}: Pick<SubNavMenuProps, "config">) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {config.sections.map((section, idx) => (
        <SectionBlock key={idx} section={section} />
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: SubNavMenuSection }) {
  return (
    <div className="mb-4 last:mb-0">
      <h3 className="text-sm font-semibold text-default-500 uppercase tracking-wider mb-3">
        {section.title}
      </h3>
      <nav
        className="flex flex-wrap gap-x-6 gap-y-1"
        aria-label={section.title}
      >
        {section.links.map((link, linkIdx) => (
          <RegularLink
            key={linkIdx}
            className="font-medium text-foreground hover:opacity-80 transition-opacity"
            href={link.href}
            target={link.target}
          >
            {link.label}
          </RegularLink>
        ))}
      </nav>
    </div>
  );
}

export function SubNavMenu({
  config,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  headerRef,
  panelClassName,
}: SubNavMenuProps) {
  const panelTop = usePanelTop(isOpen, headerRef);
  const baseBlur = "backdrop-blur-md";
  const defaultPanel =
    "bg-background/95 bg-transparent border-t border-divider";
  const panelClass =
    panelClassName != null
      ? `${panelClassName} ${baseBlur}`.trim()
      : `${defaultPanel} ${baseBlur}`;

  const panelElement = isOpen ? (
    <div
      style={{ top: panelTop }}
      className={`fixed left-0 right-0 w-full h-[140px] z-[100] isolate ${panelClass}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="dialog"
      aria-label={config.triggerLabel}
    >
      <SubNavMenuPanelContent config={config} />
    </div>
  ) : null;

  return (
    <>
      <span
        className="font-bold cursor-pointer text-foreground hover:opacity-80 transition-opacity"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onMouseEnter();
          }
        }}
      >
        {config.triggerLabel}
      </span>
      {typeof document !== "undefined" && panelElement
        ? createPortal(panelElement, document.body)
        : panelElement}
    </>
  );
}
