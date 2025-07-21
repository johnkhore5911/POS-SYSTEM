"use client"

import { Trash2, Search, Calculator, Package, DollarSign, RotateCcw } from "lucide-react"

interface ControlPanelProps {
  onAbortReceipt: () => void
  onVoidItem: () => void
  onOfflineReceipt: () => void
  onSubtotal: () => void
  onFindItem: () => void
  onSelectItem: () => void
  onNewPrice: () => void
  onReturn: () => void
  hasSelectedItem: boolean
  isLoading: boolean
}

export default function ControlPanel({
  onAbortReceipt,
  onVoidItem,
  onOfflineReceipt,
  onSubtotal,
  onFindItem,
  onSelectItem,
  onNewPrice,
  onReturn,
  hasSelectedItem,
  isLoading,
}: ControlPanelProps) {
  const buttons = [
    {
      label: "Abort Receipt",
      onClick: onAbortReceipt,
      icon: Trash2,
      variant: "danger" as const,
      disabled: false,
    },
    {
      label: "Void Item",
      onClick: onVoidItem,
      icon: Package,
      variant: "warning" as const,
      disabled: !hasSelectedItem,
    },
    {
      label: "Offline Receipt",
      onClick: onOfflineReceipt,
      icon: Package,
      variant: "secondary" as const,
      disabled: false,
    },
    {
      label: "Subtotal",
      onClick: onSubtotal,
      icon: Calculator,
      variant: "primary" as const,
      disabled: false,
    },
    {
      label: "Find Item",
      onClick: onFindItem,
      icon: Search,
      variant: "secondary" as const,
      disabled: false,
    },
    {
      label: "Select Item",
      onClick: onSelectItem,
      icon: Package,
      variant: "primary" as const,
      disabled: !hasSelectedItem,
    },
    {
      label: "New Price",
      onClick: onNewPrice,
      icon: DollarSign,
      variant: "secondary" as const,
      disabled: !hasSelectedItem,
    },
    {
      label: "Return",
      onClick: onReturn,
      icon: RotateCcw,
      variant: "warning" as const,
      disabled: !hasSelectedItem,
    },
  ]

  const getButtonStyles = (variant: "primary" | "secondary" | "danger" | "warning", disabled: boolean) => {
    const baseStyles =
      "flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"

    if (disabled) {
      return `${baseStyles} bg-slate-700/50 text-slate-400 border border-slate-600/30`
    }

    switch (variant) {
      case "primary":
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-500/25`
      case "secondary":
        return `${baseStyles} bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white shadow-lg`
      case "danger":
        return `${baseStyles} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/25`
      case "warning":
        return `${baseStyles} bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg hover:shadow-orange-500/25`
      default:
        return `${baseStyles} bg-slate-600 hover:bg-slate-500 text-white`
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30">
      <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Controls</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {buttons.map((button) => {
          const Icon = button.icon
          return (
            <button
              key={button.label}
              onClick={button.onClick}
              disabled={button.disabled || isLoading}
              className={getButtonStyles(button.variant, button.disabled || isLoading)}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{button.label}</span>
              <span className="sm:hidden">{button.label.split(" ")[0]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
