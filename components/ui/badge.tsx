import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold uppercase tracking-wide border-2 border-black rounded-none shadow-[2px_2px_0px_0px_black]",
  {
    variants: {
      variant: {
        default: "bg-[#00e054] text-black",
        secondary: "bg-[#1f2328] text-gray-200",
        destructive: "bg-red-600 text-white",
        outline: "bg-transparent text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)


function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
