import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-content shadow-lg shadow-primary/20 hover:opacity-95 hover:shadow-xl hover:shadow-primary/30",
        destructive:
          "bg-gradient-to-r from-error to-error/80 text-error-content shadow-lg shadow-error/10 hover:opacity-95",
        outline:
          "border border-base-content/10 bg-transparent text-base-content hover:bg-base-content/5",
        secondary:
          "bg-base-content/5 border border-transparent text-base-content hover:bg-base-content/10",
        ghost: "hover:bg-base-content/5 text-base-content/60 hover:text-base-content",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "bg-base-100/30 backdrop-blur-md border border-base-content/10 text-base-content hover:bg-base-100/50 shadow-md",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-9 rounded-xl px-4 text-[10px]",
        lg: "h-14 rounded-[1.5rem] px-8 text-sm",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
