import { method } from '@vtex/api'
import slugify from 'slugify'

import { Entity, EntityCustomFields } from '../typings/yextLocations'

const DAY = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} as const

const buildMapLink = (entity: Entity) => {
  const {
    name,
    address: { line1, city, region, postalCode },
  } = entity

  const mapAddress = encodeURI(
    `${name},${line1},${city},${region},${postalCode}`
  )

  return `https://www.google.com/maps/dir/?api=1&destination=${mapAddress}`
}

const hoursFormat = (time: string, use24HourDisplay: boolean) => {
  const [hour, minute] = time.split(':')

  if (!use24HourDisplay) {
    return `${
      parseInt(hour, 10) > 12 ? parseInt(hour, 10) - 12 : hour
    }:${minute}${parseInt(hour, 10) >= 12 ? ' pm' : ' am'}`
  }

  return `${hour}:${minute}`
}

const formatBusinessHours = (entity: Entity, format: boolean) => {
  const businessHours = Object.keys(entity.hours).map((key) => {
    const hours = entity.hours[key as keyof typeof DAY].openIntervals

    const start = hours?.[0].start
    const end = hours?.[0].end

    const openingTime = start ? hoursFormat(start, format) : null
    const closingTime = end ? hoursFormat(end, format) : null
    const hoursDisplay =
      !openingTime && !closingTime
        ? `Closed`
        : `${openingTime ?? ''} - ${closingTime ?? ''}`

    return {
      dayOfWeek: DAY[key as keyof typeof DAY],
      openingTime,
      closingTime,
      hoursDisplay,
    }
  })

  return businessHours
}

const mapCustomFields = (entity: EntityCustomFields) => {
  const customFields = Object.keys(entity).reduce(
    (result: any, key) => {
      if (key.substr(0, 2) === 'c_') {
        const customField = entity[key]

        if (typeof customField === 'object') {
          if (typeof customField[0] === 'string') {
            result.textList.push({ id: key, data: entity[key] })
          } else if (typeof customField[0] === 'object') {
            result.imageList.push({ id: key, data: entity[key] })
          } else {
            const { image } = entity[key]

            result.image.push({ id: key, data: image })
          }
        } else if (typeof customField === 'string') {
          result.text.push({ id: key, data: entity[key] })
        }
      }

      return result
    },
    { text: [], textList: [], image: [], imageList: [] }
  )

  return customFields
}

const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = `${phoneNumber}`.replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return ['(', match[2], ') ', match[3], '-', match[4]].join('')
  }

  return null
}

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

export const resolvers = {
  Routes: {
    getSitemap: [
      method({
        GET: async (ctx: Context) => {
          try {
            const response = await resolvers.Query.getAllStores(null, null, ctx)

            ctx.set('Content-Type', 'text/xml')

            const lastMod = new Date().toISOString()
            const storesMap = `
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
                ${response
                  .map((item) => {
                    return `<url>
                  <loc>https://${ctx.vtex.host}/store/${Slugify(
                      `${item.name} ${item.address.region} ${item.address.postalCode}`
                    )}/${String(item.meta.id).replace('1_', '')}</loc>
                  <lastmod>${lastMod}</lastmod>
                  <changefreq>daily</changefreq>
                  <priority>0.8</priority>
               </url>`
                  })
                  .join('')}
              </urlset>`

            ctx.body = storesMap
            ctx.status = 200
          } catch (e) {
            ctx.body = e
            ctx.status = 500
          }
        },
      }),
    ],
  },
  Query: {
    getStoreSchema: async (_: any, param: any, ctx: Context) => {
      const { locationId } = param
      const {
        clients: { apps, yext },
      } = ctx

      const appId = process.env.VTEX_APP_ID as string
      const settings = await apps.getAppSettings(appId)

      const { response } = await yext.getStructuredData({
        apiKey: settings.apiKey,
        locationId,
      })

      return { response: JSON.stringify(response) }
    },
    getAllStores: async (_: any, _param: any, ctx: Context) => {
      const {
        clients: { apps, yext },
      } = ctx

      const appId = process.env.VTEX_APP_ID as string
      const settings = await apps.getAppSettings(appId)

      const locations: Entity[] = []
      let pageToken = ''

      do {
        // eslint-disable-next-line no-await-in-loop
        const response = await yext.getLocations({
          apiKey: settings.apiKey,
          limit: 50,
          pageToken,
        })

        const data = response?.response?.entities?.map((entity) => entity)

        if (data) {
          locations.push(...data)
        }

        pageToken = response.response.pageToken ?? ''
      } while (pageToken)

      return locations
    },
    getStores: async (_: any, param: any, ctx: Context) => {
      const { location, limit, filter } = param
      const {
        clients: { apps, yext },
      } = ctx

      const appId = process.env.VTEX_APP_ID as string
      const settings = await apps.getAppSettings(appId)
      const { apiKey, use24Hour, defaultLocation } = settings

      const { response } = await yext.getLocationsByAddress({
        apiKey,
        location: location || defaultLocation,
        limit,
        radius: 2500,
        filter,
      })

      if (!response) {
        return null
      }

      const locations = {
        items: response.entities.map((entity) => {
          return {
            id: entity.meta.id,
            name: entity.name,
            mainPhone: formatPhoneNumber(entity.mainPhone),
            address: {
              postalCode: entity.address.postalCode,
              country: entity.address.countryCode,
              city: entity.address.city,
              state: entity.address.region,
              neighborhood: null,
              street: entity.address.line1,
              number: null,
              complement: null,
              reference: null,
              location: {
                latitude: entity.cityCoordinate.latitude,
                longitude: entity.cityCoordinate.longitude,
              },
            },
            businessHours: formatBusinessHours(entity, use24Hour),
            googleMapLink: buildMapLink(entity),
          }
        }),
        location: response.geo
          ? {
              latitude: response.geo?.coordinate.latitude,
              longitude: response.geo?.coordinate.longitude,
            }
          : null,
      }

      return locations
    },
    getStore: async (_: any, param: any, ctx: Context) => {
      const { locationId } = param
      const {
        clients: { apps, yext },
      } = ctx

      const appId = process.env.VTEX_APP_ID as string
      const settings = await apps.getAppSettings(appId)
      const { apiKey, use24Hour } = settings

      const { response: entity } = await yext.getLocation({
        apiKey,
        locationId,
      })

      if (!entity) {
        return null
      }

      const location = {
        item: {
          id: entity.meta.id,
          name: entity.name,
          description: entity.description,
          logo: entity.logo,
          mainPhone: formatPhoneNumber(entity.mainPhone),
          emails: entity.emails,
          address: {
            postalCode: entity.address.postalCode,
            country: entity.address.countryCode,
            city: entity.address.city,
            state: entity.address.region,
            neighborhood: null,
            street: entity.address.line1,
            number: null,
            complement: null,
            reference: null,
            geoCoordinates: [
              entity.cityCoordinate.longitude,
              entity.cityCoordinate.latitude,
            ],
            location: {
              latitude: entity.cityCoordinate.latitude,
              longitude: entity.cityCoordinate.longitude,
            },
          },
          businessHours: formatBusinessHours(entity, use24Hour),
          googleMapLink: buildMapLink(entity),
          brands: entity.brands,
          paymentOptions: entity.paymentOptions,
          twitterHandle: entity.twitterHandle,
          facebookPageUrl: entity.facebookPageUrl,
          instagramHandle: entity.instagramHandle,
          customFields: mapCustomFields(entity),
        },
      }

      return location
    },
  },
}
