"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Work } from "@prisma/client"
import { FieldConfig } from "@/components/ui/generic-form"

export const workColumns: ColumnDef<Work>[] = [
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
      const category = row.getValue("category") as string | null
      return (
        <div>
          {category ? (
            <Badge>{category}</Badge>
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

export const workFields: FieldConfig[] = [
  {
    name: 'image',
    label: 'Project Image',
    type: 'file',
    accept: 'image/*',
    maxSize: 5,
    colSpan: 3,
  },
  {
    name: 'title',
    label: 'Project Title',
    type: 'text',
    placeholder: 'E-commerce Platform',
    required: true,
    colSpan: 1,
  },
  {
    name: 'category',
    label: 'Category',
    type: 'text',
    placeholder: 'Web Development',
    colSpan: 1,
  },
  {
    name: 'featured',
    label: 'Featured Project',
    type: 'boolean',
    colSpan: 1,
  },
  {
    name: 'tools',
    label: 'Tools & Technologies',
    type: 'text',
    placeholder: 'React, TypeScript, Node.js',
    colSpan: 2,
  },
  {
    name: 'githubLink',
    label: 'GitHub Link',
    type: 'url',
    placeholder: 'https://github.com/username/project',
    colSpan: 1,
  },
  {
    name: 'liveUrl',
    label: 'Live URL',
    type: 'url',
    placeholder: 'https://project.com',
    colSpan: 1,
  },
  {
    name: 'videoUrl',
    label: 'Demo Video URL',
    type: 'url',
    placeholder: 'https://youtube.com/watch?v=...',
    colSpan: 1,
    required: false,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Describe the project, its features, and your role...',
    required: true,
    colSpan: 3,
    minHeight: 150,
  },
];