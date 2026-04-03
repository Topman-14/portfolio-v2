"use client"

import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { ComponentProps, FC } from "react"
import { cn, getInitials } from "@/lib/utils"

function AvatarBase({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

interface AvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  className,
  fallbackClassName,
}) => {
  return (
    <AvatarBase className={className}>
      {src ? (
        <AvatarImage src={src} alt={alt || "User"} />
      ) : null}
      <AvatarFallback
        className={cn(
          "text-primary font-medium bg-transparent",
          fallbackClassName
        )}
      >
        {getInitials(alt)}
      </AvatarFallback>
    </AvatarBase>
  );
};