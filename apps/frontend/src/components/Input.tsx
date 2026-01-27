import * as React from "react"
import { cn } from "../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, style, ...props }, ref) => {
    return (
      <div className="w-full space-y-2 text-left">
        {label && (
          <label className="text-sm font-semibold tracking-tight opacity-70 ml-1 block">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-[var(--radius)] glass-input px-4 py-2 text-base outline-none transition-all placeholder:text-white/20",
            "focus-visible:ring-1 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
            className
          )}
          ref={ref}
          style={style}
          {...props}
        />
        {error && (
          <p className="text-[12px] font-medium text-red-500 ml-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
