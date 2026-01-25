import * as React from "react";
import Link from "next/link";
import { buttonVariants, type VariantProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

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
