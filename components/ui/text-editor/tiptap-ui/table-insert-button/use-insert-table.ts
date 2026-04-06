"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import { useEditorState } from "@tiptap/react"

import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { isNodeInSchema, isNodeTypeSelected } from "@/lib/tiptap-utils"

import { TableIcon } from "@/components/ui/text-editor/tiptap-icons/table-icon"

export const DEFAULT_TABLE_INSERT_OPTIONS = {
  rows: 3,
  cols: 3,
  withHeaderRow: true,
} as const

export function canInsertTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema("table", editor)) return false
  if (isNodeTypeSelected(editor, ["image"])) return false
  return editor.can().insertTable(DEFAULT_TABLE_INSERT_OPTIONS)
}

export function insertTableAtSelection(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canInsertTable(editor)) return false
  return editor
    .chain()
    .focus()
    .insertTable(DEFAULT_TABLE_INSERT_OPTIONS)
    .run()
}

export function shouldShowInsertTableButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props
  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema("table", editor)) return false
  if (hideWhenUnavailable) {
    return canInsertTable(editor)
  }
  return true
}

export interface UseInsertTableConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onInserted?: () => void
}

export function useInsertTable(config?: UseInsertTableConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)

  const tableState = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      isVisible: shouldShowInsertTableButton({
        editor: ed,
        hideWhenUnavailable,
      }),
      canInsert: canInsertTable(ed),
    }),
  })

  const handleInsert = React.useCallback(() => {
    if (!editor) return false
    const success = insertTableAtSelection(editor)
    if (success) onInserted?.()
    return success
  }, [editor, onInserted])

  return {
    isVisible: tableState?.isVisible ?? false,
    canInsert: tableState?.canInsert ?? false,
    handleInsert,
    label: "Insert table",
    Icon: TableIcon,
  }
}
