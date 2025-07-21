"use client"

import type { Summary } from "@/types/pos"

interface SummaryPanelProps {
  summary: Summary
}

export default function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30">
      <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Transaction Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Item count:</span>
          <span className="text-white font-medium">{summary.itemCount}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Discount:</span>
          <span className="text-white font-medium">₹{summary.discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Tax (5%):</span>
          <span className="text-white font-medium">₹{summary.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Net:</span>
          <span className="text-white font-medium">₹{summary.net.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">C/R:</span>
          <span className="text-slate-400">—</span>
        </div>
        <div className="border-t border-slate-600/50 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold text-lg">Total:</span>
            <span className="text-yellow-400 font-bold text-xl">₹{summary.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
