import { IOClients } from '@vtex/api'

import Yext from './yext'
import Sitemap from './sitemap'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get yext() {
    return this.getOrSet('yext', Yext)
  }

  public get sitemap() {
    return this.getOrSet('sitemap', Sitemap)
  }
}
