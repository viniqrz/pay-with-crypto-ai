import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          // Size styles
          size === 'sm' && "h-9 px-3 text-xs",
          size === 'md' && "h-11 px-8 text-sm",
          size === 'lg' && "h-14 px-10 text-base",
          // Variant styles
          variant === 'primary' && "bg-[var(--primary)] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:brightness-110 border border-white/10",
          variant === 'outline' && "border border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm",
          variant === 'ghost' && "hover:bg-white/10 text-white/70 hover:text-white",
          className
        )}
        ref={ref}
        style={style}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
