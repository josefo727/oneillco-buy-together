import { IOClients, IOContext, Apps } from '@vtex/api'

import SkusClient from './skus'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get apps() {
    return this.getOrSet('apps', Apps)
  }

  public get skus() {
    return this.getOrSet('skus', SkusClient)
  }

  public getSkusClient(context: IOContext, appKey: string, appToken: string) {
    return new SkusClient(context, {
      headers: {
        'X-Vtex-Use-Https': 'true',
        'Proxy-Authorization': context.authToken,
        'x-vtex-api-appKey': appKey,
        'x-vtex-api-appToken': appToken,
      },
    })
  }
}
