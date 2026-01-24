import * as React from "react";
import { Link } from "react-router-dom";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonVariant = NonNullable<ButtonProps["variant"]>;
type ButtonSize = NonNullable<ButtonProps["size"]>;

type LinkProps = React.ComponentPropsWithoutRef<typeof Link>;

export interface LinkButtonProps extends Omit<LinkProps, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

const LinkButton = React.forwardRef<
  React.ElementRef<typeof Link>,
  LinkButtonProps
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <Link
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}) as React.ForwardRefExoticComponent<
  LinkButtonProps & React.RefAttributes<React.ElementRef<typeof Link>>
>;

LinkButton.displayName = "LinkButton";

export { LinkButton };
