import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreGroupContext } from './contexts/StoreGroupContext'

const CSS_HANDLES = [
  'paymentOptionsContainer',
  'paymentOptionsLabel',
  'paymentOptionsText',
] as const

interface StorePaymentsProps {
  label?: string
}

const StorePaymentOptions: StorefrontFunctionComponent<StorePaymentsProps> = ({
  label,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useContext(StoreGroupContext)

  if (!group) {
    return null
  }

  return (
    <div className={`${handles.paymentOptionsContainer} mh7`}>
      {label && (
        <div className={`${handles.paymentOptionsLabel} b t-heading-6`}>
          {label}
        </div>
      )}
      <div className={`${handles.paymentOptionsText} mt4`}>
        {group.paymentOptions.join(', ')}
      </div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storePaymentOptions.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storePaymentOptions.description',
  },
  labelTitle: {
    defaultMessage: '',
    id: 'admin/editor.storePaymentOptionsLabel.title',
  },
  labelDescription: {
    defaultMessage: '',
    id: 'admin/editor.storePaymentOptionsLabel.description',
  },
})

StorePaymentOptions.schema = {
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

export default StorePaymentOptions
