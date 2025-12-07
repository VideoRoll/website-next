"use client";

// import Link from "next/link";
import Image from "next/image";
import logo from "@/components/icons/logo.png";
import { useTheme } from "next-themes";
import {
  IconMoon,
  IconChevronDown,
  IconBrightnessUp,
  IconUser,
  IconLanguage,
} from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  addToast,
  User,
  Avatar,
  DropdownSection,
} from "@heroui/react";
import { Link } from "@/i18n/navigation";
import { Link as RegularLink } from "@heroui/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useTopLoader } from "nextjs-toploader";

type Props = {
  currentUser: any;
  error?: string;
};

// const menuItems = ["Features", "Pricing", "Docs"];

export default function NavBar(props: Props) {
  const t = useTranslations("nav");
  const { currentUser } = props;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // 手动切换菜单的函数（用于调试）
  const toggleMenu = (e?: React.MouseEvent | React.TouchEvent) => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 处理触摸事件（移动端优化）
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu(e);
  };

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const loader = useTopLoader();
  const supabase = createClient();

  const locale = useLocale();

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([locale]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  const select = useCallback(
    (keys) => {
      setSelectedKeys(keys);
      const data = Array.from(keys).join(", ").replace(/_/g, "");
      // 显示
      setTimeout(() => {
        router.replace({ pathname, params }, { locale: data });
      });
    },
    [pathname, params, router]
  );

  const signout = () => {
    loader.start();
    supabase.auth
      .signOut()
      .then((res) => {
        loader.done();
        if (res.error) {
          console.error(res.error);
          return;
        }

        if (window.location.pathname.includes("/dashboard")) {
          window.location.href = "https://videoroll.app";
          return;
        }

        window.location.reload();
      })
      .catch(() => {})
      .finally(() => {});
  };

  useEffect(() => {
    // if (error) {
    //   addToast({
    //     title: "Error",
    //     description: error,
    //     color: "danger",
    //   });
    // }

    if (currentUser) {
      window.postMessage(
        {
          type: "videoroll_auth_signin",
          data: { success: true, user: currentUser },
        },
        "*"
      );
    } else {
      window.postMessage(
        {
          type: "videoroll_auth_signout",
          data: { success: true, user: null },
        },
        "*"
      );
    }
  }, [currentUser]);

  return (
    <Navbar
      className="z-[99] top-0 mx-auto max-w-screen-2xl px-[5vw] touch-manipulation py-[6px]"
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      shouldHideOnScroll={false}
      position="sticky"
      classNames={{
        menu: "bg-background/95 backdrop-blur-md mt-4 touch-manipulation",
        menuItem: "py-2 touch-manipulation",
        toggle: "touch-manipulation select-none cursor-pointer",
      }}
    >
      <NavbarContent>
        <div
          className="sm:hidden cursor-pointer touch-manipulation select-none p-2 -m-2 active:scale-95 transition-transform"
          onClick={toggleMenu}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="pointer-events-none"
          />
        </div>
        <NavbarBrand>
          <Image
            src={logo}
            alt="video roll logo"
            width={30}
            height={30}
            className="mr-2"
          ></Image>
          <span className="text-xl font-bold text-stone-300">Video Roll</span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className="font-bold" color="foreground" href="/">
            {t("features")}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="font-bold" aria-current="page" href="/pricing">
            {t("pricing")}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <RegularLink
            className="font-bold"
            color="foreground"
            showAnchorIcon
            target="_blank"
            href="https://docs.videoroll.app"
          >
            {t("documentation")}
          </RegularLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem>
          {currentUser ? (
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  src={currentUser.user_metadata?.avatar_url}
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                onAction={() => {}}
              >
                <DropdownSection aria-label="Profile & Actions">
                  <DropdownItem key="profile">
                    <User
                      avatarProps={{
                        size: "sm",
                        src: currentUser.user_metadata?.avatar_url,
                      }}
                      name={currentUser.user_metadata?.name}
                      description={currentUser.email}
                    ></User>
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection showDivider aria-label="Profile & Actions">
                  <DropdownItem key="dashboard" as={Link} href="/dashboard">
                    Dashboard
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection aria-label="Profile & Actions">
                  <DropdownItem key="logout" onClick={signout}>
                    Log out
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button as={Link} color="primary" href="/signin" variant="solid">
              {t("login")}
            </Button>
          )}
        </NavbarItem>
        <NavbarItem>
          <Dropdown placement="bottom" trigger="press">
            <DropdownTrigger>
              <Button variant="bordered" startContent={<IconLanguage />} endContent={<IconChevronDown size={18} />}>
                {selectedValue === "en" ? "English" : "简体中文"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedKeys}
              selectionMode="single"
              variant="flat"
              onSelectionChange={select}
            >
              <DropdownItem key="en">English</DropdownItem>
              <DropdownItem key="zh">简体中文</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        {/* <NavbarItem>
          {theme === "dark" ? (
            <Button
              isIconOnly
              aria-label="light"
              onClick={() => setTheme("light")}
            >
              <IconBrightnessUp
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </Button>
          ) : (
            <Button
              isIconOnly
              aria-label="dark"
              onClick={() => setTheme("dark")}
            >
              <IconMoon style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </Button>
          )}
        </NavbarItem> */}
      </NavbarContent>
      <NavbarMenu>
        {/* 主要功能菜单 */}
        <NavbarMenuItem key="features">
          <Link
            className="w-full"
            color="foreground"
            href="/"
            size="lg"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("features")}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="pricing">
          <Link
            className="w-full"
            color="foreground"
            href="/pricing"
            size="lg"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("pricing")}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="documentation">
          <Link
            className="w-full"
            color="primary"
            href="https://docs.videoroll.app"
            target="_blank"
            size="lg"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("documentation")}
          </Link>
        </NavbarMenuItem>

        {/* 分隔线 */}
        <NavbarMenuItem key="divider">
          <div className="h-px bg-divider my-2"></div>
        </NavbarMenuItem>

        {/* 用户登录/登出 */}
        {currentUser ? (
          <>
            <NavbarMenuItem key="user-info">
              <div className="flex items-center gap-3 py-2">
                <Avatar size="sm" src={currentUser.user_metadata?.avatar_url} />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">
                    {currentUser.user_metadata?.name}
                  </p>
                  <p className="text-xs text-default-500">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </NavbarMenuItem>
            <NavbarMenuItem key="dashboard">
              <Link
                className="w-full"
                color="foreground"
                href="/dashboard"
                size="lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem key="logout">
              <Button
                className="w-full justify-start"
                color="danger"
                variant="light"
                size="lg"
                onClick={() => {
                  setIsMenuOpen(false);
                  signout();
                }}
              >
                Log out
              </Button>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem key="login">
            <Button
              as={Link}
              className="w-full"
              color="primary"
              href="/signin"
              variant="solid"
              size="lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("login")}
            </Button>
          </NavbarMenuItem>
        )}

        {/* 分隔线 */}
        <NavbarMenuItem key="divider2">
          <div className="h-px bg-divider my-2"></div>
        </NavbarMenuItem>

        {/* 语言切换 */}
        <NavbarMenuItem key="language">
          <div className="w-full">
            <p className="text-sm text-default-500 mb-2">
              {t("language") || "Language"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                className={`justify-start ${
                  locale === "en" ? "bg-primary text-primary-foreground" : ""
                }`}
                variant={locale === "en" ? "solid" : "flat"}
                size="sm"
                onClick={() => {
                  select(new Set(["en"]));
                  setIsMenuOpen(false);
                }}
              >
                English
              </Button>
              <Button
                className={`justify-start ${
                  locale === "zh" ? "bg-primary text-primary-foreground" : ""
                }`}
                variant={locale === "zh" ? "solid" : "flat"}
                size="sm"
                onClick={() => {
                  select(new Set(["zh"]));
                  setIsMenuOpen(false);
                }}
              >
                简体中文
              </Button>
            </div>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>

    // <nav className={classes.header}>
    //   <Container size="lg">
    //     <div className={classes.inner}>
    //       <Group gap={2}>
    //         <Image
    //           src={logo}
    //           alt="video roll logo"
    //           width={30}
    //           height={30}
    //         ></Image>
    //       </Group>

    //       <Group gap={5} visibleFrom="sm">
    //         {items}
    //       </Group>
    //       <Group gap={5}>
    //         {currentUser ? (
    //           <Menu trigger="hover" openDelay={100} closeDelay={400}>
    //             <Menu.Target>
    //               <Button
    //                 justify="center"
    //                 variant="default"
    //                 component={Link}
    //                 href="/signin"
    //                 leftSection={<IconUser size={14}></IconUser>}
    //                 size="compact-md"
    //               >
    //                 {currentUser.email ?? ""}
    //               </Button>
    //             </Menu.Target>
    //             <Menu.Dropdown>
    //               <Menu.Item onClick={signout}>Sign out</Menu.Item>
    //             </Menu.Dropdown>
    //           </Menu>
    //         ) : (
    //           <Button
    //             justify="center"
    //             variant="gradient"
    //             component={Link}
    //             href="/signin"
    //             gradient={{
    //               from: "rgba(212, 112, 255, 1)",
    //               to: "violet",
    //               deg: 90,
    //             }}
    //             leftSection={<IconUser size={14}></IconUser>}
    //             size="compact-sm"
    //           >
    //             Sign in
    //           </Button>
    //         )}

    //         {colorScheme === "dark" ? (
    //           <ActionIcon
    //             variant="default"
    //             size="md"
    //             aria-label="theme"
    //             onClick={toggleColorScheme}
    //           >
    //             <IconBrightnessUp
    //               style={{ width: "70%", height: "70%" }}
    //               stroke={1.5}
    //             />
    //           </ActionIcon>
    //         ) : (
    //           <ActionIcon
    //             variant="default"
    //             size="md"
    //             aria-label="theme"
    //             onClick={toggleColorScheme}
    //           >
    //             <IconMoon
    //               style={{ width: "70%", height: "70%" }}
    //               stroke={1.5}
    //             />
    //           </ActionIcon>
    //         )}
    //         <Burger
    //           opened={opened}
    //           onClick={toggle}
    //           size="sm"
    //           hiddenFrom="sm"
    //         />
    //       </Group>
    //     </div>
    //   </Container>
    // </nav>
  );
}
