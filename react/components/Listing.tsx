/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import PropTypes from 'prop-types'
import slugify from 'slugify'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'addressList',
  'addressListItem',
  'addressListFirstItem',
  'addressStoreName',
  'addressStoreAddress',
  'addressListLink',
] as const

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

const Listing: FC<WrappedComponentProps & any> = ({
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
      className={`vh-75-m h-100-s overflow-y-scroll-m overflow-visible-s flex flex-column-m flex-nowrap-m order-1-m order-2-s flex-row-s flex-wrap-s t-small ${handles.addressList}`}
    >
      {items.map((item: any, i: number) => {
        return (
          <div
            key={`key_${i}`}
            className={`mb0 ph3 pv5 ${!i ? handles.addressListFirstItem : ''} ${
              handles.addressListItem
            } ${
              !i ? 'bt' : ''
            } bb bl br b--light-gray hover-bg-near-white w-100-s`}
            onClick={() => {
              handleChangeCenter(item, 12)
            }}
          >
            <div className="mr3">
              <div className="mb3">
                <Link
                  className="b no-underline underline-hover"
                  page="store.storedetail"
                  params={{
                    slug: `${Slugify(
                      `${item.name} ${item.address.state} ${item.address.postalCode}`
                    )}`,
                    store_id: String(item.id).replace('1_', ''),
                  }}
                >
                  {item.address.city}
                </Link>
              </div>

              <div>
                <div className="mb3 fw5">{item.name}</div>
                <div>
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
              <div className="flex mt3">
                <div className="pr4 br b--gray">
                  <a
                    className="no-underline underline-hover"
                    href={`tel:${item.mainPhone}`}
                  >
                    {item.mainPhone}
                  </a>
                </div>
                <div className="pl4 bl b--gray">
                  <a
                    href={item.googleMapLink}
                    className="b no-underline underline-hover"
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

Listing.propTypes = {
  items: PropTypes.array,
  onChangeCenter: PropTypes.func,
}

export default injectIntl(Listing)
