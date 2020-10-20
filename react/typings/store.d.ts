interface StoreResult {
  getStore: {
    item: SpecificationGroup
  }
  getStoreSchema: {
    response: string
  }
}
export interface StoresResult {
  getStores: {
    items: SpecificationGroup[]
    location: Location
  }
}
interface BusinessHours {
  openingTime: string | null
  dayOfWeek: number
  closingTime: string | null
}
interface Address {
  addressId: string
  cacheId: string
  id: string
  userId: string
  receiverName: string
  complement: string
  neighborhood: string
  country: string
  state: string
  number: string
  street: string
  geoCoordinates: number[]
  postalCode: string
  city: string
  reference: string
  addressName: string
  addressType: string
  location: Location
}

interface Location {
  latitude: number
  longitude: number
}
export interface SpecificationGroup {
  businessHours: [BusinessHours]
  isActive: boolean
  description: string
  name: string
  id: string
  instructions: string
  seller: string
  brands: string[]
  paymentOptions: string[]
  customFields: CustomFields
  mainPhone: string
  emails: string[]
  googleMapLink: string
  twitterHandle: string
  facebookPageUrl: string
  instagramHandle: string
  address: Address
  logo: Logo
}

interface CustomFields {
  text: CustomText[]
  textList: CustomTextList[]
  image: CustomImage[]
  imageList: CustomImageList[]
}

interface CustomText {
  id: string
  data: string
}

interface CustomTextList {
  id: string
  data: string[]
}

interface CustomImage {
  id: string
  data: Image
}

interface CustomImageList {
  id: string
  data: Logo[]
}
interface Logo {
  image: Image
}

interface Image {
  url: string
}
