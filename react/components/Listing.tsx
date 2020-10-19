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

    onChangeCenter([longitude, latitude], zoom)
  }

  return (
    items.length && (
      <ul className={`list ph3 mt0 ${handles.addressList}`}>
        {items.map((item: any, i: number) => {
          return (
            <li
              key={`key_${i}`}
              className={`pointer mb0 ph3 pv5 ${
                !i ? handles.addressListFirstItem : ''
              } ${handles.addressListItem} ${
                !i ? 'bt' : ''
              } bb bl br b--light-gray hover-bg-light-gray`}
              onClick={() => {
                handleChangeCenter(item, 12)
              }}
            >
              <div>
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
                  <div>{item.name}</div>
                  <div>
                    {item.address.number ? `${item.address.number} ` : ''}
                    {item.address.street ? `${item.address.street}` : ''}
                    <br />

                    {`${item.address.city ? `${item.address.city},` : ''} ${
                      item.address.state ? `${item.address.state} ` : ''
                    } ${
                      item.address.postalCode
                        ? `${item.address.postalCode}`
                        : ''
                    }`}
                  </div>
                </div>
                <div className="flex">
                  <div>{item.mainPhone}</div>
                  <div className="ml6">
                    <a
                      href={item.googleMapLink}
                      className="b no-underline underline-hover"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  )
}

Listing.propTypes = {
  items: PropTypes.array,
  onChangeCenter: PropTypes.func,
}

export default injectIntl(Listing)
