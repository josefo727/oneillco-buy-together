export interface ProductGroupProps {
  imageSelectProduct?: ImageSelectProductProps
  productsAndSkuIds?: string[]
  collectionIds?: number[]
}
export interface ImageSelectProductProps {
  primaryImage: string
  secondaryImage: string
  tertiaryImage: string
}
