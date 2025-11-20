"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Category } from "@prisma/client"
import { FieldConfig } from "@/components/generic-form"

type CategoryWithCount = Category & {
  _count: {
    articles: number
  }
}

export const categoryColumns: ColumnDef<CategoryWithCount>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("name")}
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null
      return (
        <div className="max-w-[300px] truncate">
          {description || <span className="text-muted-foreground">No description</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "_count",
    header: "Articles",
    cell: ({ row }) => {
      const count = row.getValue("_count") as { articles: number }
      return (
        <Badge variant="white">
          {count.articles} {count.articles === 1 ? 'article' : 'articles'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return (
        <div className="text-sm text-muted-foreground">
          {format(date, "MMM dd, yyyy")}
        </div>
      )
    },
  },
]

export const categoryFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Category Name',
    type: 'text',
    placeholder: 'Web Development',
    required: true,
    colSpan: 2,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Describe what this category covers...',
    colSpan: 3,
    minHeight: 100,
  },
];

