/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import slugify from 'slugify'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import { SpecificationGroup } from '../typings/store'

const CSS_HANDLES = [
  'storeListAddressList',
  'storeListAddressListFirstItem',
  'storeListAddressListItem',
  'storeListStoreLinkContainer',
  'storeListStoreLink',
  'storeListAddressContainer',
  'storeListStoreName',
  'storeListAddress',
  'storeListLinks',
  'storeListLinkContainer',
  'storeListPhoneLink',
  'storeListDirectionsLink',
] as const

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

interface ListingProps {
  items: SpecificationGroup[]
  onChangeCenter: any
}

const Listing: StorefrontFunctionComponent<ListingProps> = ({
  items,
  onChangeCenter,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const handleChangeCenter = (item: any, zoom: number) => {
    const { latitude, longitude } = item.address.location

    onChangeCenter(longitude, latitude, zoom)
  }

  return (
    <div
      style={{ minWidth: '270px' }}
      className={`${handles.storeListAddressList} vh-75-m h-100-s overflow-y-scroll-m overflow-visible-s flex flex-column-m flex-nowrap-m order-1-m order-2-s flex-row-s flex-wrap-s t-small`}
    >
      {items.map((item, i: number) => {
        return (
          <div
            key={`key_${i}`}
            className={`mb0 ph3 pv5 ${
              !i ? handles.storeListAddressListFirstItem : ''
            } ${handles.storeListAddressListItem} ${
              !i ? 'bt' : ''
            } bb bl br b--light-gray hover-bg-near-white w-100-s`}
            onClick={() => {
              handleChangeCenter(item, 12)
            }}
          >
            <div className="mr3">
              <div className={`${handles.storeListStoreLinkContainer} mb3`}>
                <Link
                  className={`${handles.storeListStoreLink} b no-underline underline-hover vtex-link`}
                  page="store.storedetail"
                  params={{
                    slug: `${Slugify(
                      `${item.name} ${item.address.state} ${item.address.postalCode}`
                    )}`,
                    store_id: item.id,
                  }}
                >
                  {item.address.city}
                </Link>
              </div>

              <div className={`${handles.storeListAddressContainer}`}>
                <div className={`${handles.storeListStoreName} mb3 fw5`}>
                  {item.name}
                </div>
                <div className={`${handles.storeListAddress}`}>
                  {item.address.number ? `${item.address.number} ` : ''}
                  {item.address.street ? `${item.address.street}` : ''}
                  <br />

                  {`${item.address.city ? `${item.address.city},` : ''} ${
                    item.address.state ? `${item.address.state} ` : ''
                  } ${
                    item.address.postalCode ? `${item.address.postalCode}` : ''
                  }`}
                </div>
              </div>
              <div className={`${handles.storeListLinks} flex mt3`}>
                <div
                  className={`${handles.storeListLinkContainer} pr4 br b--gray`}
                >
                  <a
                    className={`${handles.storeListPhoneLink} no-underline underline-hover vtex-link`}
                    href={`tel:${item.mainPhone}`}
                  >
                    {item.mainPhone}
                  </a>
                </div>
                <div
                  className={`${handles.storeListLinkContainer} pl4 bl b--gray`}
                >
                  <a
                    href={item.googleMapLink}
                    className={`${handles.storeListDirectionsLink} b no-underline underline-hover vtex-link`}
                  >
                    Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Listing
