"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Article, ArticleStatus, Category } from "@prisma/client"
import { FieldConfig } from "@/components/generic-form"

type ArticleWithCategory = Article & {
  category: Category | null
}

export const articlesColumns: ColumnDef<ArticleWithCategory>[] = [
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
      const category = row.getValue("category") as Category | null
      return (
        <div>
          {category ? (
            <Badge variant="outline">{category.name}</Badge>
          ) : (
            <span className="text-muted-foreground">No category</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge 
          variant={
            status === "PUBLISHED" 
              ? "default" 
              : status === "DRAFT" 
                ? "secondary" 
                : "destructive"
          }
        >
          {status}
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


export const articleFields = (categories: Category[]): FieldConfig[] => [
  {
    name: 'coverImg',
    label: 'Cover Image',
    type: 'file',
    accept: 'image/*',
    maxSize: 5,
    colSpan: 3,
  },
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter article title',
    required: true,
    colSpan: 1,
  },
  {
    name: 'categoryId',
    label: 'Category',
    type: 'async-select',
    placeholder: 'Select or search category',
    fetchOptions: categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'text',
    placeholder: 'javascript, react, nextjs',
  },
  {
    name: 'excerpt',
    label: 'Excerpt',
    type: 'textarea',
    placeholder: 'Brief summary of the article',
    colSpan: 2,
  },
  {
    name: 'readTime',
    label: 'Read Time (minutes)',
    type: 'number',
    min: 1,
    max: 120,
    defaultValue: 5,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Draft', value: ArticleStatus.DRAFT },
      { label: 'Published', value: ArticleStatus.PUBLISHED },
      { label: 'Archived', value: ArticleStatus.ARCHIVED },
    ],
    defaultValue: ArticleStatus.DRAFT,
  },
  {
    name: 'content',
    label: 'Content',
    type: 'rich-text',
    placeholder: 'Write your article content here...',
    required: true,
    colSpan: 3,
    minHeight: 400,
  },
];
