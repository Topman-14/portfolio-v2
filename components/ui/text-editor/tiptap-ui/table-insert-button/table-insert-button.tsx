"use client"

import * as React from "react"

import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

import type { UseInsertTableConfig } from "./use-insert-table"
import { useInsertTable } from "./use-insert-table"

import type { ButtonProps } from "@/components/ui/text-editor/tiptap-ui-primitive/button"
import { Button } from "@/components/ui/text-editor/tiptap-ui-primitive/button"

export interface TableInsertButtonProps
  extends Omit<ButtonProps, "type">,
    UseInsertTableConfig {
  text?: string
}

export const TableInsertButton = React.forwardRef<
  HTMLButtonElement,
  TableInsertButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onInserted,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const { isVisible, canInsert, handleInsert, label, Icon } = useInsertTable({
      editor,
      hideWhenUnavailable,
      onInserted,
    })

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleInsert()
      },
      [handleInsert, onClick]
    )

    if (!isVisible) {
      return null
    }

    return (
      <Button
        type="button"
        data-style="ghost"
        data-active-state="off"
        role="button"
        tabIndex={-1}
        disabled={!canInsert}
        data-disabled={!canInsert}
        aria-label={label}
        tooltip="Table"
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    )
  }
)

TableInsertButton.displayName = "TableInsertButton"
