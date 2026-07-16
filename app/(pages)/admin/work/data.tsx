"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Work, Category } from "@prisma/client"

type WorkWithCategory = Work & { category: Category | null }

export const workColumns: ColumnDef<WorkWithCategory>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("title")}
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category
      return (
        <div>
          {category ? (
            <Badge>{category.name}</Badge>
          ) : (
            <span className="text-muted-foreground">No category</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      const featured = row.getValue("featured") as boolean
      return (
        <Badge variant={featured ? "malachite" : "amber"}>
          {featured ? "True" : "False"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "tools",
    header: "Tools",
    cell: ({ row }) => {
      const tools = row.getValue("tools") as string[]
      return (
        <div className="flex gap-1 flex-wrap">
          {tools.slice(0, 3).map((tool) => (
            <Badge key={tool} className="text-xs">
              {tool}
            </Badge>
          ))}
          {tools.length > 3 && (
            <Badge className="text-xs">
              +{tools.length - 3}
            </Badge>
          )}
        </div>
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