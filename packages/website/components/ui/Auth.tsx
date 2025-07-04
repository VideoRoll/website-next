"use client";

import React, { useCallback, useRef, useState } from "react";
import Google from "@/components/icons/Google";
import Github from "@/components/icons/Github";

import { Link } from "@/i18n/navigation";
// import { Turnstile } from "@marsidev/react-turnstile";
import Turnstile, { useTurnstile } from "react-turnstile";
import debounce from "lodash-es/debounce";

import {
  Form,
  Input,
  Button,
  addToast,
  Divider,
  Skeleton,
} from "@heroui/react";
import {
  showGlobalLoading,
  hideGlobalLoading,
} from "@/components/ui/GlobalLoading";
import { useLocale, useTranslations } from "next-intl";
import { redirect } from "next/navigation";

type Props = {
  type: "signin" | "signup";
  onSubmit: (data: FormData, locale: string) => Promise<any>;
  redirectCallback?: (locale: string) => void;
  onGoogleSignin: (data: string) => void;
  onGithubSignin: (data: string) => void;
};

export const EyeSlashFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
        fill="currentColor"
      />
      <path
        d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
        fill="currentColor"
      />
      <path
        d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
        fill="currentColor"
      />
      <path
        d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
        fill="currentColor"
      />
      <path
        d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const EyeFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
        fill="currentColor"
      />
      <path
        d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function Auth(props: Props) {
  const { type, onSubmit, onGoogleSignin, onGithubSignin, redirectCallback } = props;
  const locale = useLocale();
  const t = useTranslations("auth");
  const [errors, setErrors] = React.useState({});
  const turnstile = useTurnstile();
  // const [visible, handlers] = useDisclosure(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  const errorTimes = useRef(0);

  const [email, setEmail] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);

  const handleError = useCallback(
    (error) => {
      console.log("Captcha error", error, errorTimes.current);
      if (errorTimes.current >= 3) {
        addToast({
          title: t("captchaError"),
          description: t("captchaErrorDesc"),
          color: "danger",
        });
        return;
      }
      errorTimes.current += 1;
      turnstile.reset();
    },
    [errorTimes, turnstile, t]
  );

  const handleOAuthSignin = (
    callback: (data: string) => Promise<any> | void
  ) => {
    showGlobalLoading();
    const result = callback(window.location.origin);

    if (result && typeof result.catch === "function") {
      result.catch((error: any) => {
        hideGlobalLoading();
        addToast({
          title: t("oauthError"),
          description: error,
          color: "danger",
        });
        console.log(error);
      });
    }
  };

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      const form = document.querySelector("form") as HTMLFormElement;
      const formData = new FormData(form);

      formData.append("captchaToken", captchaToken);

      showGlobalLoading();
      const result = await onSubmit(formData, locale);
      hideGlobalLoading();
      // Check if result contains an error
      if (result && result.error) {
        addToast({
          title: t("error"),
          description: result.error,
          color: "danger",
        });
        turnstile.reset();
        console.log(result.error);
        return;
      }
      
      redirectCallback?.(locale);
    },
    [turnstile, captchaToken, onSubmit, t]
  );

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-3"
      validationErrors={errors}
      onSubmit={handleSubmit}
    >
      <Input
        value={email}
        type="email"
        name="email"
        label={t("email")}
        id="email"
        variant="bordered"
        isInvalid={isInvalid}
        labelPlacement="outside"
        placeholder={t("enterEmail")}
        color={isInvalid ? "danger" : "default"}
        errorMessage={isInvalid && t("emailInvalid")}
        onValueChange={setEmail}
        className="w-full"
      />
      <Input
        type={isVisible ? "text" : "password"}
        id="password"
        name="password"
        label={t("password")}
        variant="bordered"
        defaultValue=""
        labelPlacement="outside"
        placeholder={t("enterPassword")}
        isInvalid={false}
        errorMessage={false}
        className="w-full"
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
      />
      {!loaded && (
        <Skeleton className="w-full rounded-lg">
          <div className="h-[65px] rounded-lg bg-default-300"></div>
        </Skeleton>
      )}
      <Turnstile
        size="flexible"
        onVerify={(token) => {
          setCaptchaToken(token);
        }}
        className="w-full"
        sitekey="0x4AAAAAAAxryjpkBF1lWMCb"
        onError={handleError}
        language={locale}
        onLoad={() => {
          setLoaded(true);
        }}
      ></Turnstile>

      <Button
        isDisabled={captchaToken === ""}
        fullWidth
        type="submit"
        color="primary"
      >
        {type === "signin" ? t("signin") : t("signup")}
      </Button>
      <Divider className="my-4" />
      <Button
        fullWidth
        startContent={<Google></Google>}
        onPress={() => handleOAuthSignin(onGoogleSignin)}
      >
        {type === "signin" ? t("signinWithGoogle") : t("signupWithGoogle")}
      </Button>
      <Button
        fullWidth
        startContent={<Github></Github>}
        onPress={() => handleOAuthSignin(onGithubSignin)}
      >
        {type === "signin" ? t("signinWithGithub") : t("signupWithGithub")}
      </Button>
      {type === "signin" ? (
        <p>
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-blue-600">
            {t("signupLink")}
          </Link>
        </p>
      ) : (
        <p>
          {t("hasAccount")}{" "}
          <Link href="/signin" className="text-blue-600">
            {t("signinLink")}
          </Link>
        </p>
      )}
      <p className="text-xs text-gray-200 mt-2 text-center">
        {t("agreementText")}
        <a
          href={`https://docs.videoroll.app/${
            locale === "zh" ? "cn" : "en"
          }/docs/terms`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline mx-1 text-blue-600"
        >
          {t("termsOfService")}
        </a>
        {t("and")}
        <a
          href={`https://docs.videoroll.app/${
            locale === "zh" ? "cn" : "en"
          }/docs/privacy`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline mx-1 text-blue-600"
        >
          {t("privacyPolicy")}
        </a>
        {locale === "zh" ? "。" : "."}
      </p>
    </Form>
  );
}
