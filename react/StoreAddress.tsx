import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = [
  'addressContainer',
  'addressBlock',
  'addressLabel',
  'addressDirectionsContainer',
  'addressDirectionsLink',
] as const

interface StoreAddressProps {
  label: string
}

const StoreAddress: StorefrontFunctionComponent<StoreAddressProps> = ({
  label,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  const { number, street, city, state, postalCode } = group.address

  return (
    <div className={`${handles.addressContainer} mv5 flex items-center`}>
      <div className={`${handles.addressBlock}`}>
        {label && <div className={`${handles.addressLabel} b`}>{label}</div>}
        <br />
        {number ? `${number} ` : ''}
        {street ? `${street} ` : ''}
        <br />
        {city ? `${city}` : ''}
        {state ? `, ${state}` : ''}
        {postalCode ? `, ${postalCode}` : ''}
      </div>
      <div
        className={`${handles.addressDirectionsContainer} mh7 flex items-center justify-center`}
      >
        <a
          className={`${handles.addressDirectionsLink}`}
          href={group.googleMapLink}
        >
          <FormattedMessage id="store/yext-store-locator.storeAddress.linkText" />
        </a>
      </div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeAddress.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeAddress.description',
  },
  labelTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeAddressLabel.title',
  },
  labelDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeAddressLabel.description',
  },
})

StoreAddress.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    label: {
      title: messages.labelTitle.id,
      description: messages.labelDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
  },
}

export default StoreAddress
