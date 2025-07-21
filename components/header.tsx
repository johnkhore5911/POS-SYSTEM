"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, Scan } from "lucide-react"

interface HeaderProps {
  onBarcodeSubmit: (barcode: string) => void
  onSearch: (query: string) => void
  selectedItem: {
    description: string
    qty: number
    total: number
  } | null
  isLoading: boolean
}

export default function Header({ onBarcodeSubmit, onSearch, selectedItem, isLoading }: HeaderProps) {
  const [barcodeValue, setBarcodeValue] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }, [])

  const handleBarcodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && barcodeValue.trim()) {
      onBarcodeSubmit(barcodeValue.trim())
      setBarcodeValue("")
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(searchValue.trim())
    }
  }

  const appendToBarcode = (value: string) => {
    setBarcodeValue((prev) => prev + value)
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }

  const clearBarcode = () => {
    setBarcodeValue("")
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }

  const backspaceBarcode = () => {
    setBarcodeValue((prev) => prev.slice(0, -1))
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }

  // Expose functions to parent component
  useEffect(() => {
    ;(window as any).posKeypadActions = {
      appendToBarcode,
      clearBarcode,
      backspaceBarcode,
      submitBarcode: () => {
        if (barcodeValue.trim()) {
          onBarcodeSubmit(barcodeValue.trim())
          setBarcodeValue("")
        }
      },
    }
  }, [barcodeValue, onBarcodeSubmit])

  return (
    <header className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm border-b border-slate-600/50 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        {/* Barcode Input */}
        <div className="relative">
          <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            ref={barcodeInputRef}
            type="text"
            value={barcodeValue}
            onChange={(e) => setBarcodeValue(e.target.value)}
            onKeyDown={handleBarcodeKeyDown}
            placeholder="Scan barcode..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
            autoComplete="off"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Find item..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
            autoComplete="off"
            disabled={isLoading}
          />
        </div>

        {/* Item Description */}
        <div className="lg:col-span-2 text-white">
          <span className="text-sm text-slate-300">Current Item:</span>
          <div className="font-medium truncate">{selectedItem?.description || "—"}</div>
        </div>

        {/* Summary */}
        <div className="flex gap-6 text-white">
          <div>
            <span className="text-sm text-slate-300">Qty:</span>
            <span className="ml-2 font-bold text-yellow-400">{selectedItem?.qty || 0}</span>
          </div>
          <div>
            <span className="text-sm text-slate-300">Total:</span>
            <span className="ml-2 font-bold text-yellow-400">₹{selectedItem?.total?.toFixed(2) || "0.00"}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
