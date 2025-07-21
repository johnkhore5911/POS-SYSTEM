"use client"

import type { CartItem } from "@/types/pos"
import { useEffect, useState } from "react"

interface ItemTableProps {
  items: CartItem[]
  selectedItemIndex: number | null
  onItemSelect: (index: number) => void
}

export default function ItemTable({ items, selectedItemIndex, onItemSelect }: ItemTableProps) {
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (items.length > 0) {
      const lastItem = items[items.length - 1]
      setAnimatingItems((prev) => new Set(prev).add(lastItem.barcode))

      const timer = setTimeout(() => {
        setAnimatingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(lastItem.barcode)
          return newSet
        })
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [items]) // Updated to use the entire items array as dependency

  return (
    <main className="flex-1 overflow-hidden">
      <div className="overflow-y-auto overflow-x-auto min-h-[120px]">
        <table className="w-full min-w-[600px] border-collapse">
          <thead className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-700 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200 border-b border-slate-600/50 hidden sm:table-cell">
                Item #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200 border-b border-slate-600/50">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200 border-b border-slate-600/50">
                Qty
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200 border-b border-slate-600/50 hidden md:table-cell">
                Weight
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200 border-b border-slate-600/50">
                Price/Unit
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200 border-b border-slate-600/50">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={`${item.barcode}-${index}`}
                onClick={() => onItemSelect(index)}
                className={`
                  cursor-pointer transition-all duration-200 hover:bg-slate-700/30
                  ${
                    selectedItemIndex === index ? "bg-yellow-400/20 ring-1 ring-yellow-400/50" : "hover:bg-slate-700/20"
                  }
                  ${item.isReturned ? "text-red-400" : "text-white"}
                  ${animatingItems.has(item.barcode) ? "animate-fade-in" : ""}
                `}
              >
                <td className="px-4 py-3 text-sm border-b border-slate-700/30 hidden sm:table-cell font-mono">
                  {item.barcode}
                </td>
                <td className="px-4 py-3 text-sm border-b border-slate-700/30">
                  <div className="truncate max-w-xs">{item.description}</div>
                </td>
                <td className="px-4 py-3 text-sm border-b border-slate-700/30 font-semibold">{item.qty}</td>
                <td className="px-4 py-3 text-sm border-b border-slate-700/30 hidden md:table-cell">{item.weight}</td>
                <td className="px-4 py-3 text-sm border-b border-slate-700/30">₹{item.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm border-b border-slate-700/30 font-semibold">
                  ₹{item.total.toFixed(2)}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <p>No items in cart</p>
                    <p className="text-sm">Scan a barcode or search for items to get started</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
