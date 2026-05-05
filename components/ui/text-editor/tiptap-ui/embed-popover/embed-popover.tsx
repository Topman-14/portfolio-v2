"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"

import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { useViewport } from "@/hooks/use-viewport"
import { isNodeInSchema } from "@/lib/tiptap-utils"
import { normalizeEmbedSrc } from "@/lib/embed-url"

import { CornerDownLeftIcon } from "@/components/ui/text-editor/tiptap-icons/corner-down-left-icon"
import { EmbedIcon } from "@/components/ui/text-editor/tiptap-icons/embed-icon"
import { TrashIcon } from "@/components/ui/text-editor/tiptap-icons/trash-icon"
import type { ButtonProps } from "@/components/ui/text-editor/tiptap-ui-primitive/button"
import { Button, ButtonGroup } from "@/components/ui/text-editor/tiptap-ui-primitive/button"
import {
  Card,
  CardBody,
  CardItemGroup,
} from "@/components/ui/text-editor/tiptap-ui-primitive/card"
import { Input, InputGroup } from "@/components/ui/text-editor/tiptap-ui-primitive/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/text-editor/tiptap-ui-primitive/popover"
import { Separator } from "@/components/ui/text-editor/tiptap-ui-primitive/separator"

const SAMPLE_EMBED_SRC = "https://www.youtube.com/embed/dQw4w9WgXcQ"

export function canInsertEmbed(editor: Editor | null) {
  if (!editor?.isEditable) return false
  return editor
    .can()
    .insertContent({ type: "embed", attrs: { src: SAMPLE_EMBED_SRC } })
}

function shouldShowEmbedButton(editor: Editor | null, hideWhenUnavailable: boolean) {
  if (!isNodeInSchema("embed", editor) || !editor) return false
  if (hideWhenUnavailable && !editor.isActive("code")) return canInsertEmbed(editor)
  return true
}

export const EmbedButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, children, ...props }, ref) => (
  <Button
    type="button"
    className={className}
    data-style="ghost"
    role="button"
    tabIndex={-1}
    aria-label="Embed"
    tooltip="Embed"
    ref={ref}
    {...props}
  >
    {children ?? <EmbedIcon className="tiptap-button-icon" />}
  </Button>
))
EmbedButton.displayName = "EmbedButton"

export const EmbedContent: React.FC<{ editor?: Editor | null }> = ({
  editor: providedEditor,
}) => {
  const { editor } = useTiptapEditor(providedEditor)
  const [rawUrl, setRawUrl] = useState("")

  useEffect(() => {
    if (!editor) return
    const sync = () => {
      if (editor.isActive("embed")) {
        const { src } = editor.getAttributes("embed")
        setRawUrl(typeof src === "string" ? src : "")
      } else {
        setRawUrl("")
      }
    }
    sync()
    editor.on("selectionUpdate", sync)
    return () => {
      editor.off("selectionUpdate", sync)
    }
  }, [editor])

  const { isMobile } = useViewport()

  const insert = useCallback(() => {
    if (!editor) return
    const src = normalizeEmbedSrc(rawUrl)
    if (!src) return
    if (editor.isActive("embed")) {
      editor.chain().focus().updateAttributes("embed", { src }).run()
    } else {
      editor.chain().focus().setEmbed({ src: rawUrl }).run()
    }
  }, [editor, rawUrl])

  const remove = useCallback(() => {
    if (!editor?.isActive("embed")) return
    editor.chain().focus().deleteSelection().run()
    setRawUrl("")
  }, [editor])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
      insert()
    }
  }

  return (
    <Card
      style={{
        ...(isMobile ? { boxShadow: "none", border: 0 } : {}),
      }}
    >
      <CardBody
        style={{
          ...(isMobile ? { padding: 0 } : {}),
        }}
      >
        <CardItemGroup orientation="horizontal">
          <InputGroup>
            <Input
              type="url"
              placeholder="YouTube, Vimeo, or Loom URL…"
              value={rawUrl}
              onChange={(e) => setRawUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </InputGroup>

          <ButtonGroup orientation="horizontal">
            <Button
              type="button"
              onClick={insert}
              title="Insert embed"
              disabled={!normalizeEmbedSrc(rawUrl)}
              data-style="ghost"
            >
              <CornerDownLeftIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>

          <Separator />

          <ButtonGroup orientation="horizontal">
            <Button
              type="button"
              onClick={remove}
              title="Remove embed"
              disabled={!editor?.isActive("embed")}
              data-style="ghost"
            >
              <TrashIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  )
}

export interface EmbedPopoverProps
  extends Omit<ButtonProps, "type"> {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const EmbedPopover = React.forwardRef<
  HTMLButtonElement,
  EmbedPopoverProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onOpenChange,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      if (!editor) return
      const tick = () =>
        setIsVisible(
          shouldShowEmbedButton(editor, hideWhenUnavailable)
        )
      tick()
      editor.on("selectionUpdate", tick)
      return () => {
        editor.off("selectionUpdate", tick)
      }
    }, [editor, hideWhenUnavailable])

    const canInsert = canInsertEmbed(editor)

    const handleOpenChange = useCallback(
      (next: boolean) => {
        setIsOpen(next)
        onOpenChange?.(next)
      },
      [onOpenChange]
    )

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        setIsOpen(!isOpen)
      },
      [onClick, isOpen]
    )

    if (!isVisible) return null

    const isActive = editor?.isActive("embed") ?? false

    return (
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <EmbedButton
            disabled={!canInsert}
            data-active-state={isActive ? "on" : "off"}
            data-disabled={!canInsert}
            aria-label="Embed"
            aria-pressed={isActive}
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
          >
            {children ?? <EmbedIcon className="tiptap-button-icon" />}
          </EmbedButton>
        </PopoverTrigger>

        <PopoverContent>
          <EmbedContent editor={editor} />
        </PopoverContent>
      </Popover>
    )
  }
)

EmbedPopover.displayName = "EmbedPopover"
