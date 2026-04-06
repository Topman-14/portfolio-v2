import * as React from "react"

export const TableIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        width="24"
        height="24"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
        <path d="M3 15H21" stroke="currentColor" strokeWidth="2" />
        <path d="M9 3V21" stroke="currentColor" strokeWidth="2" />
        <path d="M15 3V21" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
)

TableIcon.displayName = "TableIcon"
