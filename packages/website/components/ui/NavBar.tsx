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
  IconLanguage
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
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const loader = useTopLoader();
  const supabase = createClient();

  const menuItems = useMemo(
    () => [
      t("features"),
      t("pricing"),
      t("documentation"),
    ],
    [t]
  );

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

    console.log('---currentUser', currentUser);
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
    <Navbar className="z-50 mx-auto max-w-screen-2xl px-[5vw]" maxWidth="full" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Image
            src={logo}
            alt="video roll logo"
            width={30}
            height={30}
            className="mr-2"
          ></Image>
          Video Roll
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
          <RegularLink className="font-bold" color="foreground" showAnchorIcon target="_blank" href="https://docs.videoroll.app">
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
                    <User avatarProps={{size: 'sm', src:currentUser.user_metadata?.avatar_url}} name={currentUser.user_metadata?.name} description={currentUser.email}></User>
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
            <Button as={Link} color="primary" href="/signin" variant="flat">
              Login
            </Button>
          )}
        </NavbarItem>
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" startContent={<IconLanguage />}>{selectedValue}</Button>
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
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
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
