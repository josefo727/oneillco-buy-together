import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { getSku } from './middlewares/getSku'
import { getProductSkus } from './middlewares/getProductSkus'
import { getCollectionProducts } from './middlewares/getCollectionProducts'

const TIMEOUT_MS = 30000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}

export default new Service({
  clients,
  routes: {
    'get-sku': method({
      GET: [getSku],
    }),
    'get-product-skus': method({
      GET: [getProductSkus],
    }),
    'get-collection-products': method({
      GET: [getCollectionProducts],
    }),
  },
})
