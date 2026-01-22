"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { useTranslations } from "next-intl";

type Props = {
  userEmail: string;
};

export default function AccountContent({ userEmail }: Props) {
  const t = useTranslations("dashboard");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isEmailMatch = confirmEmail === userEmail;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(userEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/delete-user", {
        method: "POST",
      });
      if (response.ok) {
        addToast({
          title: t("account.deleteSuccess"),
          color: "success",
        });
        // 跳转到首页
        window.location.href = "/";
      } else {
        const data = await response.json().catch(() => ({}));
        const errorMessage = data.error || t("account.deleteFailed");
        addToast({
          title: t("account.deleteError"),
          description: errorMessage,
          color: "danger",
        });
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      addToast({
        title: t("account.deleteError"),
        description: err instanceof Error ? err.message : t("account.deleteFailed"),
        color: "danger",
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  const handleOpenModal = () => {
    setConfirmEmail("");
    setCopied(false);
    onOpen();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-red-500">{t("account.title")}</h3>
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{t("account.warning")}</p>
        <Button color="danger" variant="solid" onPress={handleOpenModal}>
          {t("account.deleteButton")}
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader className="text-red-500">
            {t("account.confirmTitle")}
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 mb-4">{t("account.confirmDescription")}</p>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">{t("account.enterEmail")}</p>
              <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                <span className="text-sm font-mono flex-1 break-all">
                  {userEmail}
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  color={copied ? "success" : "default"}
                  onPress={handleCopyEmail}
                >
                  {copied ? t("account.copied") : t("account.copy")}
                </Button>
              </div>
              <Input
                label={t("account.emailLabel")}
                placeholder={t("account.emailPlaceholder")}
                value={confirmEmail}
                onValueChange={setConfirmEmail}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} isDisabled={isDeleting}>
              {t("account.cancel")}
            </Button>
            <Button
              color="danger"
              isDisabled={!isEmailMatch || isDeleting}
              isLoading={isDeleting}
              onPress={handleDeleteAccount}
            >
              {t("account.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
