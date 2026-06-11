import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full bg-base-content/5 border border-base-content/5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-base-content/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
