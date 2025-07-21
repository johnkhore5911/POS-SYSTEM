export interface CartItem {
  barcode: string
  description: string
  qty: number
  weight: number
  price: number
  total: number
  isReturned?: boolean
}

export interface Summary {
  itemCount: number
  discount: number
  tax: number
  net: number
  total: number
}
