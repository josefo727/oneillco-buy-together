export interface SkuDetails {
  Id: number
  ProductId: number
  NameComplete: string
  ComplementName: string
  ProductName: string
  ProductDescription: string
  ProductRefId: string
  TaxCode: any
  SkuName: string
  IsActive: boolean
  IsTransported: boolean
  IsInventoried: boolean
  IsGiftCardRecharge: boolean
  ImageUrl: string
  DetailUrl: string
  CSCIdentification: any
  BrandId: string
  BrandName: string
  IsBrandActive: boolean
  Dimension: Dimension
  RealDimension: RealDimension
  ManufacturerCode: string
  IsKit: boolean
  KitItems: any[]
  Services: any[]
  Categories: any[]
  CategoriesFullPath: string[]
  Attachments: any[]
  Collections: any[]
  SkuSellers: SkuSeller[]
  SalesChannels: number[]
  Images: Image[]
  Videos: any[]
  SkuSpecifications: SkuSpecification[]
  ProductSpecifications: ProductSpecification[]
  ProductClustersIds: string
  PositionsInClusters: PositionsInClusters
  ProductClusterNames: ProductClusterNames
  ProductClusterHighlights: ProductClusterHighlights
  ProductCategoryIds: string
  IsDirectCategoryActive: boolean
  ProductGlobalCategoryId: number
  ProductCategories: ProductCategories
  CommercialConditionId: number
  RewardValue: number
  AlternateIds: AlternateIds
  AlternateIdValues: string[]
  EstimatedDateArrival: any
  MeasurementUnit: string
  UnitMultiplier: number
  InformationSource: string
  ModalType: any
  KeyWords: string
  ReleaseDate: string
  ProductIsVisible: boolean
  ShowIfNotAvailable: boolean
  IsProductActive: boolean
  ProductFinalScore: number
}

export interface Dimension {
  cubicweight: number
  height: number
  length: number
  weight: number
  width: number
}

export interface RealDimension {
  realCubicWeight: number
  realHeight: number
  realLength: number
  realWeight: number
  realWidth: number
}

export interface SkuSeller {
  SellerId: string
  StockKeepingUnitId: number
  SellerStockKeepingUnitId: string
  IsActive: boolean
  FreightCommissionPercentage: number
  ProductCommissionPercentage: number
}

export interface Image {
  ImageUrl: string
  ImageName: string
  FileId: number
}

export interface SkuSpecification {
  FieldId: number
  FieldName: string
  FieldValueIds: number[]
  FieldValues: string[]
  IsFilter: boolean
  FieldGroupId: number
  FieldGroupName: string
}

export interface ProductSpecification {
  FieldId: number
  FieldName: string
  FieldValueIds: number[]
  FieldValues: string[]
  IsFilter: boolean
  FieldGroupId: number
  FieldGroupName: string
}

export interface PositionsInClusters {
  "159": number
  "655": number
  "853": number
  "914": number
}

export interface ProductClusterNames {
  "159": string
  "655": string
  "853": string
  "914": string
}

export interface ProductClusterHighlights {
  "159": string
  "853": string
}

export interface ProductCategories {
  "369": string
  "388": string
  "391": string
}

export interface AlternateIds {
  Ean: string
  RefId: string
}

export interface CartSKU {
  itemId: string;
  price: number;
  sellerId?: string;
  // Add other properties if needed for simulation
}

export interface CartSimulationResult {
  regularTotal: number;
  discountedTotal: number | null;
  discountPercentage: number | null;
  loading: boolean;
  error?: Error;
}

export interface AddToCartResult {
  success: boolean;
  message: string;
}