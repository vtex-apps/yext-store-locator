import React from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = [
  'storeContactsContainer',
  'storeContactsContact',
  'storeContactsLabel',
] as const

interface StoreContactProps {
  label: string
  type: 'mainPhone' | 'fax' | 'email'
  index?: number
}

const StoreContact: StorefrontFunctionComponent<StoreContactProps> = ({
  label,
  type,
  index,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  let text: string

  if (type === 'email') {
    text = group.emails[index ?? 0]
  } else {
    text = group[type]
  }

  return (
    <div className={handles.storeContactsContainer}>
      <div className={`${handles.storeContactsContact} b`}>{text}</div>
      <div className={`${handles.storeContactsLabel} t-small`}>
        {text && label}
      </div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeContact.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeContact.description',
  },
  labelTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeContactLabel.title',
  },
  labelDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeContactLabel.description',
  },
  typeTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeContactType.title',
  },
  typeDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeContactType.description',
  },
  indexTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeContactIndex.title',
  },
  indexDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeContactIndex.description',
  },
})

StoreContact.schema = {
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
    type: {
      title: messages.typeTitle.id,
      description: messages.typeDescription.id,
      type: 'string',
      enum: ['mainPhone', 'fax', 'email'],
      enumNames: ['Main Phone', 'Fax', 'Email'],
      isLayout: false,
      default: 'mainPhone',
    },
    index: {
      title: messages.indexTitle.id,
      description: messages.indexDescription.id,
      type: 'number',
      isLayout: false,
      default: '',
    },
  },
}

export default StoreContact
