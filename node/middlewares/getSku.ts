import { UserInputError } from '@vtex/api'
import { getAppSettings } from '../utils/credentials'

export async function getSku(ctx: Context, next: () => Promise<any>) {
  const {
    clients,
    vtex,
  } = ctx

  const { logger } = vtex;
  const { skuId } = vtex.route.params as { skuId: string };

  if (!skuId) {
    throw new UserInputError('Missing skuIds query parameter')
  }

  try {
    const { appKey, appToken } = await getAppSettings(clients.apps)

    if (!appKey || !appToken) {
      logger.error({ message: 'App settings (appKey or appToken) are not configured.' })
      ctx.status = 500
      ctx.body = { message: 'App not configured.' }
      return
    }

    const skusClient = clients.getSkusClient(vtex, appKey, appToken)

    const product = await skusClient.getSkuById(skuId)

    ctx.status = 200
    ctx.body = product
    ctx.set('Cache-Control', 'no-cache, no-store')

    await next()
  } catch (error) {
    logger.error({ message: 'skus-handler-error', error })
    ctx.status = 500
    ctx.body = { message: 'Internal Server Error' }
  }
}
