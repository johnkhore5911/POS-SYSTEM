export interface Item {
  barcode: string
  description: string
  qty: number
  weight: number
  price: number
}

export const mockItems: Record<string, Item> = {
  "1234567890123": {
    barcode: "1234567890123",
    description: "Dove Soap Original 100g",
    qty: 1,
    weight: 0.1,
    price: 25.0,
  },
  "1234567890124": {
    barcode: "1234567890124",
    description: "Head & Shoulders Shampoo 400ml",
    qty: 1,
    weight: 0.4,
    price: 120.0,
  },
  "1234567890125": {
    barcode: "1234567890125",
    description: "Colgate Strong Teeth 200g",
    qty: 1,
    weight: 0.2,
    price: 48.0,
  },
  "1234567890126": {
    barcode: "1234567890126",
    description: "Lux Soap Rose 100g",
    qty: 1,
    weight: 0.1,
    price: 22.0,
  },
  "1234567890127": {
    barcode: "1234567890127",
    description: "Pantene Shampoo Gold 340ml",
    qty: 1,
    weight: 0.34,
    price: 95.0,
  },
  "1234567890128": {
    barcode: "1234567890128",
    description: "Dettol Antiseptic Liquid 550ml",
    qty: 1,
    weight: 0.55,
    price: 85.0,
  },
  "1234567890129": {
    barcode: "1234567890129",
    description: "Maggi Noodles Masala 70g",
    qty: 2,
    weight: 0.07,
    price: 14.0,
  },
  "1234567890130": {
    barcode: "1234567890130",
    description: "Britannia Good Day Cookies 100g",
    qty: 1,
    weight: 0.1,
    price: 30.0,
  },
  "1234567890131": {
    barcode: "1234567890131",
    description: "Tata Salt 1kg",
    qty: 1,
    weight: 1.0,
    price: 20.0,
  },
  "1234567890132": {
    barcode: "1234567890132",
    description: "Amul Butter 500g",
    qty: 1,
    weight: 0.5,
    price: 250.0,
  },
  "1234567890133": {
    barcode: "1234567890133",
    description: "Parle-G Biscuits 200g",
    qty: 3,
    weight: 0.2,
    price: 25.0,
  },
  "1234567890134": {
    barcode: "1234567890134",
    description: "Surf Excel Detergent 1kg",
    qty: 1,
    weight: 1.0,
    price: 180.0,
  },
  "1234567890135": {
    barcode: "1234567890135",
    description: "Clinic Plus Shampoo 175ml",
    qty: 1,
    weight: 0.175,
    price: 65.0,
  },
  "1234567890136": {
    barcode: "1234567890136",
    description: "Cadbury Dairy Milk 55g",
    qty: 2,
    weight: 0.055,
    price: 35.0,
  },
  "1234567890137": {
    barcode: "1234567890137",
    description: "Vim Dishwash Gel 500ml",
    qty: 1,
    weight: 0.5,
    price: 75.0,
  },
  "1234567890138": {
    barcode: "1234567890138",
    description: "Sunsilk Shampoo Black Shine 340ml",
    qty: 1,
    weight: 0.34,
    price: 110.0,
  },
  "1234567890139": {
    barcode: "1234567890139",
    description: "Kurkure Masala Munch 90g",
    qty: 1,
    weight: 0.09,
    price: 20.0,
  },
  "1234567890140": {
    barcode: "1234567890140",
    description: "Pepsodent Toothpaste 200g",
    qty: 1,
    weight: 0.2,
    price: 55.0,
  },
  "1234567890141": {
    barcode: "1234567890141",
    description: "Rin Detergent Bar 250g",
    qty: 2,
    weight: 0.25,
    price: 15.0,
  },
  "1234567890142": {
    barcode: "1234567890142",
    description: "Nestle Maggi Sauce 1kg",
    qty: 1,
    weight: 1.0,
    price: 120.0,
  },
  "1234567890143": {
    barcode: "1234567890143",
    description: "Fair & Lovely Cream 50g",
    qty: 1,
    weight: 0.05,
    price: 85.0,
  },
  "1234567890144": {
    barcode: "1234567890144",
    description: "Haldiram Bhujia 200g",
    qty: 1,
    weight: 0.2,
    price: 45.0,
  },
  "1234567890145": {
    barcode: "1234567890145",
    description: "Johnson Baby Powder 200g",
    qty: 1,
    weight: 0.2,
    price: 95.0,
  },
  "1234567890146": {
    barcode: "1234567890146",
    description: "Lizol Disinfectant 500ml",
    qty: 1,
    weight: 0.5,
    price: 70.0,
  },
  "1234567890147": {
    barcode: "1234567890147",
    description: "Bingo Mad Angles 72g",
    qty: 1,
    weight: 0.072,
    price: 18.0,
  },
}

// Mock API functions
export async function lookupItem(barcode: string): Promise<Item> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = mockItems[barcode]
      if (item) {
        resolve(item)
      } else {
        reject(new Error("Item not found"))
      }
    }, 300)
  })
}

export async function searchItems(query: string): Promise<Item[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = Object.values(mockItems).filter((item) =>
        item.description.toLowerCase().includes(query.toLowerCase()),
      )
      resolve(results)
    }, 300)
  })
}

export async function voidItem(barcode: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 300)
  })
}
