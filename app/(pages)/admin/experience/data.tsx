"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Experience } from "@prisma/client"
import { FieldConfig } from "@/components/generic-form"

export const experienceColumns: ColumnDef<Experience>[] = [
  {
    accessorKey: "jobTitle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("jobTitle")}
        </div>
      )
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("company")}
        </div>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string | null
      return (
        <div>
          {location || <span className="text-muted-foreground">Remote</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "isCurrentRole",
    header: "Status",
    cell: ({ row }) => {
      const isCurrent = row.getValue("isCurrentRole") as boolean
      return (
        <Badge variant={isCurrent ? "default" : "secondary"}>
          {isCurrent ? "Current" : "Past"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("startDate") as Date
      return (
        <div className="text-sm text-muted-foreground">
          {format(date, "MMM yyyy")}
        </div>
      )
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const date = row.getValue("endDate") as Date | null
      const isCurrent = row.getValue("isCurrentRole") as boolean
      return (
        <div className="text-sm text-muted-foreground">
          {isCurrent ? "Present" : date ? format(date, "MMM yyyy") : "N/A"}
        </div>
      )
    },
  },
]

export const experienceFields: FieldConfig[] = [
  {
    name: 'jobTitle',
    label: 'Job Title',
    type: 'text',
    placeholder: 'Senior Software Engineer',
    required: true,
    colSpan: 1,
  },
  {
    name: 'company',
    label: 'Company',
    type: 'text',
    placeholder: 'Tech Company Inc.',
    required: true,
    colSpan: 1,
  },
  {
    name: 'location',
    label: 'Location',
    type: 'text',
    placeholder: 'San Francisco, CA',
    colSpan: 1,
  },
  {
    name: 'startDate',
    label: 'Start Date',
    type: 'date',
    required: true,
    colSpan: 1,
  },
  {
    name: 'endDate',
    label: 'End Date',
    type: 'date',
    colSpan: 1,
  },
  {
    name: 'isCurrentRole',
    label: 'Current Role',
    type: 'boolean',
    colSpan: 1,
  },
  {
    name: 'skills',
    label: 'Skills',
    type: 'text',
    placeholder: 'React, TypeScript, Node.js',
    colSpan: 2,
  },
  {
    name: 'achievements',
    label: 'Achievements',
    type: 'text',
    placeholder: 'Led team of 5 developers, Increased performance by 40%',
    colSpan: 1,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Describe your role and responsibilities...',
    required: true,
    colSpan: 3,
    minHeight: 150,
  },
];
