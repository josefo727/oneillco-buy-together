export interface Variation {
  productId: number
  name: string
  salesChannel: string
  available: boolean
  displayMode: string
  dimensions: string[]
  dimensionsInputType: DimensionsInputType
  dimensionsMap: DimensionsMap
  skus: Sku[]
}

export interface DimensionsInputType {
  Color: string
  Talla: string
}

export interface DimensionsMap {
  Color: string[]
  Talla: string[]
}

export interface Sku {
  sku: number
  skuname: string
  dimensions: Dimensions
  available: boolean
  availablequantity: number
  cacheVersionUsedToCallCheckout: string
  listPriceFormated: string
  listPrice: number
  taxFormated: string
  taxAsInt: number
  bestPriceFormated: string
  bestPrice: number
  spotPrice: number
  installments: number
  installmentsValue: number
  installmentsInsterestRate: any
  image: string
  sellerId: string
  seller: string
  measures: Measures
  unitMultiplier: number
  rewardValue: number
}

export interface Dimensions {
  Color: string
  Talla: string
}

export interface Measures {
  cubicweight: number
  height: number
  length: number
  weight: number
  width: number
}
