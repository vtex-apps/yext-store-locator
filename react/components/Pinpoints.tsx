/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  InfoWindow,
} from 'react-google-maps'
import slugify from 'slugify'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import timeFormat from '../utils/timeFormat'

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

const CSS_HANDLES = [
  'markerInfo',
  'markerInfoStoreName',
  'markerInfoAddress',
  'markerInfoLink',
] as const

const Pinpoints = withScriptjs(
  withGoogleMap((props: any) => {
    const [state, setState] = useState({
      markerState: {},
    })

    const handles = useCssHandles(CSS_HANDLES)

    const messages = defineMessages({
      hoursLabel: {
        defaultMessage: '',
        id: 'store/hours-label',
      },
      '0': {
        defaultMessage: '',
        id: 'store/yext-store-locator.short-day-sunday',
      },
      '1': {
        defaultMessage: '',
        id: 'store/yext-store-locator.short-day-monday',
      },
      '2': {
        defaultMessage: '',
        id: 'store/yext-store-locator.short-day-tuesday',
      },
      '3': {
        defaultMessage: '',
        id: 'store/yext-store-locator.short-day-wednesday',
      },
      '4': {
        defaultMessage: '',
        id: 'store/yext-store-locator.short-day-thursday',
      },
      '5': {
        defaultMessage: '',
        id: 'store/yext-store-locator.short-day-friday',
      },
      '6': {
        defaultMessage: '',
        id: 'store/yext-store-locator.short-day-saturday',
      },
    })

    const { navigate } = useRuntime()

    const handleMarkState = (id: string) => {
      const markerState = !state.markerState[id]
        ? {
            [id]: true,
          }
        : {}

      setState({
        markerState,
      })
    }

    const [lng, lat] = props.center
    const { intl, zoom } = props

    const goTo = (item: any) => {
      const { state: _state, postalCode } = item.address

      navigate({
        page: 'store.storedetail',
        params: {
          slug: `${Slugify(`${item.name} ${_state} ${postalCode}`)}`,
          store_id: String(item.id).replace('1_', ''),
        },
      })
    }

    let icon: any = {
      url: props.icon ?? null,
    }

    if (props.iconWidth && props.iconHeight) {
      icon = {
        ...icon,
        scaledSize: {
          width: props.iconWidth,
          height: props.iconHeight,
        },
      }
    }

    return (
      <GoogleMap defaultZoom={10} zoom={zoom} center={{ lat, lng }}>
        {props.items.map((item: any, i: number) => {
          const { latitude, longitude } = item.address.location

          return (
            <Marker
              key={`marker_${i}`}
              icon={icon?.url}
              position={{ lat: latitude, lng: longitude }}
              onClick={() => {
                handleMarkState(item.id)
              }}
            >
              {(state.markerState[item.id] ||
                (Object.getOwnPropertyNames(state.markerState).length === 0 &&
                  lat === latitude &&
                  lng === longitude)) && (
                <InfoWindow
                  onCloseClick={() => {
                    handleMarkState(item.id)
                  }}
                >
                  <div className={`t-mini ${handles.markerInfo}`}>
                    <div>
                      <span
                        className={`mt2 link c-link underline-hover pointer ${handles.markerInfoLink}`}
                        onClick={(e) => {
                          e.preventDefault()
                          goTo(item)
                        }}
                      >
                        {`${item.name} - ${item.address.city}`}
                      </span>
                    </div>
                    <br />
                    <div>
                      {item.address.number ? `${item.address.number} ` : ''}
                      {`${item.address.street},`}
                    </div>
                    <div>
                      {item.address.city ? `${item.address.city}` : ''}
                      {item.address.state ? `, ${item.address.state}` : ''}
                      {item.address.postalCode
                        ? ` ${item.address.postalCode}`
                        : ''}
                      <br />
                      {item.mainPhone ? `${item.mainPhone}` : ''}
                    </div>
                    <br />
                    {item.businessHours.map((e: any, index: number) => {
                      return (
                        <div key={`hour_${index}`} className="">
                          <span className="">
                            {intl.formatMessage(messages[e.dayOfWeek])}
                          </span>
                          <br />
                          <span className="">
                            {timeFormat(e.openingTime)}
                            {` - `} {timeFormat(e.closingTime)}
                          </span>
                        </div>
                      )
                    })}
                    <br />
                    <a className="" href={item.googleMapLink}>
                      <FormattedMessage id="store/yext-store-locator.pinpoints.directions" />
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )
        })}
      </GoogleMap>
    )
  })
)

export default injectIntl(Pinpoints)
