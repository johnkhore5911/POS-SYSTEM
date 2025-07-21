"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Header from "@/components/header"
import ItemTable from "@/components/item-table"
import ControlPanel from "@/components/control-panel"
import SummaryPanel from "@/components/summary-panel"
import Keypad from "@/components/keypad"
import Modal from "@/components/modal"
import type { CartItem, Summary } from "@/types/pos"
import { lookupItem, searchItems, voidItem } from "@/data/mock-items"

const TAX_RATE = 0.05

export default function POSSystem() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const [receiptDiscount, setReceiptDiscount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<{
    title: string
    content: React.ReactNode
  }>({ title: "", content: null })
  const [searchResults, setSearchResults] = useState<CartItem[]>([])
  const [showSearchModal, setShowSearchModal] = useState(false)

  const calculateSummary = useCallback((): Summary => {
    const itemCount = cartItems.length
    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0)
    const discount = receiptDiscount
    const net = subtotal - discount
    const tax = net * TAX_RATE
    const total = net + tax

    return { itemCount, discount, tax, net, total }
  }, [cartItems, receiptDiscount])

  const summary = calculateSummary()

  const handleBarcodeSubmit = async (barcode: string) => {
    setIsLoading(true)
    try {
      const item = await lookupItem(barcode)
      const cartItem: CartItem = {
        ...item,
        total: item.qty * item.price,
      }
      setCartItems((prev) => [...prev, cartItem])
      setSelectedItemIndex(cartItems.length)
    } catch (error) {
      showAlert("Item not found", "The scanned barcode was not found in the system.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchModal(false)
      return
    }

    setIsLoading(true)
    try {
      const items = await searchItems(query)
      const cartItems = items.map((item) => ({
        ...item,
        total: item.qty * item.price,
      }))
      setSearchResults(cartItems)
      setShowSearchModal(true)
    } catch (error) {
      showAlert("Search Error", "Failed to search for items.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const newCart = [...prev, item];
      setSelectedItemIndex(newCart.length - 1);
      return newCart;
    });
    setShowSearchModal(false);
    setSearchResults([]);
  }

  const handleItemSelect = (index: number) => {
    setSelectedItemIndex(index)
  }

  const handleAbortReceipt = () => {
    showConfirm(
      "Abort Receipt",
      "Are you sure you want to abort the entire receipt? This will clear all items.",
      () => {
        setCartItems([])
        setSelectedItemIndex(null)
        setReceiptDiscount(0)
      },
    )
  }

  const handleVoidItem = async () => {
    if (selectedItemIndex === null) {
      showAlert("No Selection", "Please select an item first.")
      return
    }

    const item = cartItems[selectedItemIndex]
    setIsLoading(true)
    try {
      await voidItem(item.barcode)
      setCartItems((prev) => prev.filter((_, index) => index !== selectedItemIndex))
      setSelectedItemIndex(null)
    } catch (error) {
      showAlert("Void Failed", "Failed to void the selected item.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOfflineReceipt = () => {
    showAlert("Offline Receipt", "Offline receipt functionality would be implemented here.")
  }

  const handleSubtotal = () => {
    showPrompt("Apply Discount", "Enter total discount amount:", receiptDiscount.toFixed(2), (value) => {
      const discount = Number.parseFloat(value)
      if (isNaN(discount) || discount < 0) {
        showAlert("Invalid Discount", "Please enter a valid discount amount.")
        return
      }
      setReceiptDiscount(discount)
    })
  }

  const handleFindItem = () => {
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    }
  }

  const handleSelectItem = () => {
    if (selectedItemIndex === null) {
      showAlert("No Selection", "Please select an item first.")
      return
    }

    const item = cartItems[selectedItemIndex]
    showPrompt("Update Quantity", "Enter new quantity:", Math.abs(item.qty).toString(), (value) => {
      const newQty = Number.parseInt(value, 10)
      if (isNaN(newQty) || newQty === 0) {
        showAlert("Invalid Quantity", "Please enter a valid quantity.")
        return
      }

      const finalQty = item.isReturned ? -Math.abs(newQty) : Math.abs(newQty)
      setCartItems((prev) =>
        prev.map((cartItem, index) =>
          index === selectedItemIndex ? { ...cartItem, qty: finalQty, total: finalQty * cartItem.price } : cartItem,
        ),
      )
    })
  }

  const handleNewPrice = () => {
    if (selectedItemIndex === null) {
      showAlert("No Selection", "Please select an item first.")
      return
    }

    const item = cartItems[selectedItemIndex]
    showPrompt("Update Price", "Enter new price per unit:", item.price.toFixed(2), (value) => {
      const newPrice = Number.parseFloat(value)
      if (isNaN(newPrice) || newPrice < 0) {
        showAlert("Invalid Price", "Please enter a valid price.")
        return
      }

      setCartItems((prev) =>
        prev.map((cartItem, index) =>
          index === selectedItemIndex ? { ...cartItem, price: newPrice, total: cartItem.qty * newPrice } : cartItem,
        ),
      )
    })
  }

  const handleReturn = () => {
    if (selectedItemIndex === null) {
      showAlert("No Selection", "Please select an item to mark for return.")
      return
    }

    const item = cartItems[selectedItemIndex]
    if (item.isReturned) {
      showAlert("Already Returned", "This item has already been marked for return.")
      return
    }

    setCartItems((prev) =>
      prev.map((cartItem, index) =>
        index === selectedItemIndex
          ? {
              ...cartItem,
              qty: -Math.abs(cartItem.qty),
              total: -Math.abs(cartItem.qty) * cartItem.price,
              isReturned: true,
            }
          : cartItem,
      ),
    )
  }

  const handleKeyPress = (key: string) => {
    const actions = (window as any).posKeypadActions
    if (!actions) return

    switch (key) {
      case "C":
        actions.clearBarcode()
        break
      case "←":
        actions.backspaceBarcode()
        break
      case "OK":
        actions.submitBarcode()
        break
      default:
        actions.appendToBarcode(key)
        break
    }
  }

  const handleShowTotal = () => {
    showAlert("Current Total", `The current total is: ₹${summary.total.toFixed(2)}`)
  }

  const showAlert = (title: string, message: string) => {
    setModalContent({
      title,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      ),
    })
    setShowModal(true)
  }

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModalContent({
      title,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">{message}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm()
                setShowModal(false)
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
    })
    setShowModal(true)
  }

  const showPrompt = (title: string, message: string, defaultValue: string, onSubmit: (value: string) => void) => {
    let inputValue = defaultValue

    setModalContent({
      title,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">{message}</p>
          <input
            type="text"
            defaultValue={defaultValue}
            onChange={(e) => (inputValue = e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSubmit(inputValue)
                setShowModal(false)
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      ),
    })
    setShowModal(true)
  }

  const selectedItem = selectedItemIndex !== null ? cartItems[selectedItemIndex] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="h-screen grid grid-rows-[auto_1fr_auto] font-sans">
        <Header
          onBarcodeSubmit={handleBarcodeSubmit}
          onSearch={handleSearch}
          selectedItem={
            selectedItem
              ? {
                  description: selectedItem.description,
                  qty: selectedItem.qty,
                  total: selectedItem.total,
                }
              : null
          }
          isLoading={isLoading}
        />

        <ItemTable items={cartItems} selectedItemIndex={selectedItemIndex} onItemSelect={handleItemSelect} />

        <footer className="p-4 bg-slate-800/50 backdrop-blur-sm border-t border-slate-600/50">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_3fr] gap-4">
            <ControlPanel
              onAbortReceipt={handleAbortReceipt}
              onVoidItem={handleVoidItem}
              onOfflineReceipt={handleOfflineReceipt}
              onSubtotal={handleSubtotal}
              onFindItem={handleFindItem}
              onSelectItem={handleSelectItem}
              onNewPrice={handleNewPrice}
              onReturn={handleReturn}
              hasSelectedItem={selectedItemIndex !== null}
              isLoading={isLoading}
            />

            <SummaryPanel summary={summary} />

            <Keypad onKeyPress={handleKeyPress} onShowTotal={handleShowTotal} />
          </div>
        </footer>
      </div>

      {/* Search Results Modal */}
      <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} title="Search Results">
        {searchResults.length === 0 ? (
          <div className="text-slate-300">No items found.</div>
        ) : (
          <ul className="divide-y divide-slate-700">
            {searchResults.map((item, idx) => (
              <li key={item.barcode + idx} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{item.description}</div>
                  <div className="text-xs text-slate-400">Barcode: {item.barcode}</div>
                  <div className="text-xs text-slate-400">Price: ₹{item.price.toFixed(2)}</div>
                </div>
                <button
                  className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalContent.title}>
        {modalContent.content}
      </Modal>
    </div>
  )
}
