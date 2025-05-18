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
  Link,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  addToast,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

type Props = {
  currentUser: {
    email: string;
    [key: string]: string;
  };
  error?: string;
};

const menuItems = ["Features", "Pricing", "Docs"];

export default function NavBar(props: Props) {
  const { currentUser, error } = props;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const locale = useLocale();

  const { theme, setTheme } = useTheme();

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([locale]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  const select = useCallback(
    (keys) => {
      setSelectedKeys(keys);
      const data = Array.from(keys).join(", ").replace(/_/g, "");
      setTimeout(() => {
        router.replace({ pathname, params }, { locale: data });
      });
    },
    [pathname, params, router]
  );

  const signout = () => {
    // nprogress.start();
    supabase.auth.signOut().then((res) => {
      //   nprogress.complete();
      if (res.error) {
        console.error(res.error);
        return;
      }

      window.location.reload();
    });
  };

  useEffect(() => {
    if (error) {
      addToast({
        title: "Error",
        description: error,
        color: "danger",
      });
    }

    if (currentUser) {
      window.postMessage(
        {
          type: "videoroll-auth-signin",
          data: { success: true, user: currentUser },
        },
        "*"
      );
    } else {
      window.postMessage(
        {
          type: "videoroll-auth-signout",
          data: { success: true, user: null },
        },
        "*"
      );
    }
  }, [currentUser]);

  return (
    <Navbar className="w-full" maxWidth="xl" onMenuOpenChange={setIsMenuOpen}>
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
          ></Image>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link aria-current="page" href="/pricing">
            Pricing
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Docs
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button as={Link} color="primary" href="/signin" variant="flat">
            Login
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">{selectedValue}</Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedKeys}
              selectionMode="single"
              variant="flat"
              onSelectionChange={select}
            >
              <DropdownItem key="en">english</DropdownItem>
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
