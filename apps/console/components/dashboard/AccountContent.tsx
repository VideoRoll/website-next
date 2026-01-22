'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";

export function AccountContent() {
  const t = useTranslations("dashboard.account");
  const { currentUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userEmail = currentUser?.email || currentUser?.user_metadata?.email || '';

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
        // Refresh the current page after successful account deletion
        window.location.reload();
      } else {
        const data = await response.json().catch(() => ({}));
        console.error("Delete failed:", data.error || t("deleteFailed"));
        setIsDeleting(false);
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const handleOpenModal = () => {
    setConfirmEmail("");
    setCopied(false);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-destructive">{t("title")}</h3>
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{t("warning")}</p>
        <Button variant="destructive" onClick={handleOpenModal}>
          {t("deleteButton")}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">{t("confirmTitle")}</DialogTitle>
            <DialogDescription>{t("confirmDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">{t("enterEmail")}</p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-mono flex-1 break-all">
                {userEmail}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyEmail}
              >
                {copied ? t("copied") : t("copy")}
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t("emailLabel")}
              </label>
              <Input
                placeholder={t("emailPlaceholder")}
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={!isEmailMatch}
              loading={isDeleting}
              loadingText={t("deleteError")}
              onClick={handleDeleteAccount}
            >
              {t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
