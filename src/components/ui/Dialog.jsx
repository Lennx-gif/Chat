import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange?.(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          {/* Dialog Content Wrapper */}
          {children}
        </div>
      )}
    </AnimatePresence>
  )
}

const DialogContent = React.forwardRef(({ className, children, onOpenChange, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={cn(
        "relative w-full max-w-lg bg-base-100/90 backdrop-blur-2xl border border-base-content/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden z-50",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-left mb-6", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-black uppercase tracking-tight text-base-content", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-base-content/50 font-bold uppercase tracking-wider mt-1.5", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogClose = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={cn(
      "absolute right-6 top-6 size-8 rounded-full bg-base-content/5 hover:bg-base-content/10 flex items-center justify-center text-base-content/50 hover:text-base-content transition-all active:scale-90",
      className
    )}
    {...props}
  >
    <X className="size-4" />
  </button>
))
DialogClose.displayName = "DialogClose"

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose }
