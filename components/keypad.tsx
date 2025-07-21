"use client"

interface KeypadProps {
  onKeyPress: (key: string) => void
  onShowTotal: () => void
}

export default function Keypad({ onKeyPress, onShowTotal }: KeypadProps) {
  const keys = [
    ["7", "8", "9", "Total"],
    ["4", "5", "6", "C"],
    ["1", "2", "3", "OK"],
    ["0", "00", ".", "←"],
  ]

  const handleKeyClick = (key: string) => {
    if (key === "Total") {
      onShowTotal()
    } else {
      onKeyPress(key)
    }
  }

  const getKeyStyles = (key: string) => {
    const baseStyles =
      "h-12 rounded-lg font-semibold text-sm transition-all duration-200 transform active:scale-95 shadow-lg"

    switch (key) {
      case "Total":
        return `${baseStyles} bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white hover:shadow-green-500/25`
      case "C":
        return `${baseStyles} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white hover:shadow-red-500/25`
      case "OK":
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white hover:shadow-blue-500/25`
      case "←":
        return `${baseStyles} bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white hover:shadow-orange-500/25`
      default:
        return `${baseStyles} bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white`
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30 hidden lg:block">
      <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Keypad</h3>
      <div className="grid grid-cols-4 gap-2">
        {keys.flat().map((key) => (
          <button key={key} onClick={() => handleKeyClick(key)} className={getKeyStyles(key)}>
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}
