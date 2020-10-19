export interface GeoSearchApi {
  meta: Meta
  response: GeoResponse
}

export interface EntityApi {
  meta: Meta
  response: Entity
}

export interface EntityListApi {
  meta: Meta
  response: Entity[]
}

interface Meta {
  uuid: string
  errors: string[]
}

interface GeoResponse {
  entities: Entity[]
  count: number
  geo: GeoAddress
  distances: Distance[]
}

interface Entity {
  googlePlaceId: string
  matchingSearchIds: string[]
  address: EntityAddress
  brands: string[]
  description: string
  hours: Hours
  logo: Logo
  name: string
  cityCoordinate: Coordinate
  closed: boolean
  calendars: Calendars
  emails: string[]
  facebookCoverPhoto: Thumbnail
  facebookCallToAction: FacebookCallToAction
  facebookPageUrl: string
  facebookParentPageId: string
  facebookProfilePhoto: Image
  facebookStoreId: string
  facebookVanityUrl: string
  fax: string
  featuredMessage: FeaturedMessage
  geocodedCoordinate: Coordinate
  googleAccountId: string
  googleCoverPhoto: Image
  googleProfilePhoto: Image
  instagramHandle: string
  isoRegionCode: string
  keywords: string[]
  mainPhone: string
  paymentOptions: string[]
  customKeywords: string[]
  rankTrackingEnabled: boolean
  rankTrackingFrequency: string
  rankTrackingKeywords: string[]
  rankTrackingQueryTemplates: string[]
  rankTrackingSites: string[]
  timezone: string
  tollFreePhone: string
  twitterHandle: string
  websiteUrl: WebsiteUrl
  yearEstablished: number
  yextDisplayCoordinate: Coordinate
  yextRoutableCoordinate: Coordinate
  yextWalkableCoordinate: Coordinate
  meta: Meta1
  googleAttributes: GoogleAttributes
  categoryIds: string[]
  timeZoneUtcOffset: string
}

interface EntityCustomFields extends Entity {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface Address {
  line1: string
  city: string
  region: string
  postalCode: string
}

interface EntityAddress extends Address {
  countryCode: string
}

interface GeoAddress extends Address {
  country: string
}

interface Geo {
  coordinate: Coordinate
  address: GeoAddress
}

interface Hours {
  monday: Day
  tuesday: Day
  wednesday: Day
  thursday: Day
  friday: Day
  saturday: Day
  sunday: Day
}

interface Day {
  openIntervals?: OpenIntervalsEntity[]
  isClosed: boolean
}

interface OpenIntervalsEntity {
  start: string
  end: string
}

interface Logo {
  image: Image
}

interface Image {
  url: string
  width: number
  height: number
  sourceUrl?: string
  thumbnails: Thumbnail[]
}

interface Thumbnail {
  url: string
  width: number
  height: number
}

interface Coordinate {
  latitude: number
  longitude: number
  granularity?: string
}

interface Distance {
  id: string
  distanceMiles: number
  distanceKilometers: number
}

interface Calendars {
  ids: string[]
}

interface FacebookCallToAction {
  type: string
  value: string
}

interface FeaturedMessage {
  description: string
  url: string
}

interface WebsiteUrl {
  url: string
  displayUrl: string
  preferDisplayUrl: boolean
}

interface Meta1 {
  accountId: string
  uid: string
  id: string
  timestamp: string
  labels: string[]
  folderId: string
  schemaTypes: string[]
  language: string
  countryCode: string
  entityType: string
}

interface GoogleAttributes {
  pay_check: string[]
  pay_debit_card: string[]
  requires_cash_only: string[]
}
