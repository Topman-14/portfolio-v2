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
      className={cn("aspect-square size-full", className)}
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
  src: string;
  alt: string;
}

export const Avatar:FC<AvatarProps> = ({ src, alt }) => {

  return (
    <AvatarBase>
    <AvatarImage
      src={src || ""}
      alt={alt || "User"}
    />
    <AvatarFallback className="text-primary font-medium bg-transparent">
        {getInitials(alt)}
    </AvatarFallback>
  </AvatarBase>
  )
}

// good, now i want to implement the create pages of the data items in my setu up, not the shad cns components, 