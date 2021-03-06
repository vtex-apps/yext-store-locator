import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreGroupContext } from './contexts/StoreGroupContext'

const CSS_HANDLES = [
  'descriptionContainer',
  'descriptionLabel',
  'descriptionText',
] as const

interface StoreDescriptionProps {
  label: string
}

const StoreDescription: StorefrontFunctionComponent<StoreDescriptionProps> = ({
  label,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useContext(StoreGroupContext)

  if (!group) {
    return null
  }

  return (
    <div className={`${handles.descriptionContainer} mh7 mb7`}>
      {label && (
        <div className={`${handles.descriptionLabel} b t-heading-6`}>
          {label}
        </div>
      )}

      <div>
        <p className={`${handles.descriptionText} t-body`}>
          {group.description}
        </p>
      </div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeDescription.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeDescription.description',
  },
  labelTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeDescriptionLabel.title',
  },
  labelDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeDescriptionLabel.description',
  },
})

StoreDescription.schema = {
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

export default StoreDescription
